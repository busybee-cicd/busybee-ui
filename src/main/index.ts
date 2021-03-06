'use strict'

import { app, BrowserWindow, Event, ipcMain } from 'electron'
import * as path from 'path'
import { format as   formatUrl } from 'url'
import SQL from 'sql.js';
import { IpcMessageType } from '../shared/constants/IPCMessageType';
import * as fs from 'fs-extra';
import * as WebSocket from 'ws';
import { WSConnectionInfo } from '../shared/models/WSConnectionInfo';
import { TestRunConfig } from '../shared/models/TestRunConfig';
import { spawn, ChildProcess } from 'child_process';
import { IOUtil, Logger, LoggerConf } from 'busybee-util';
// require('shell-path').sync();
require('fix-path')();
const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow:BrowserWindow|null;
const logLevel = process.env.LOG_LEVEL || 'INFO';
let logCb = null;
if (logLevel === 'DEBUG ' && !isDevelopment) {
  logCb = (msg:string) => {
    if (mainWindow)
      mainWindow.webContents.send(IpcMessageType.BUSYBEE_LOG_MSG, msg);
  }
}
const loggerConf = new LoggerConf(
  {
    constructor: {
      name: 'MainProcess'
    }
  },
  logLevel,
  logCb
);
const logger = new Logger(loggerConf);

function createMainWindow() {
  const window = new BrowserWindow({titleBarStyle: 'hidden'});
  window.setSize(1200,900);

  if (isDevelopment) {
    window.webContents.openDevTools()
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  });

  console.log(process.env['LOG_LEVEL']);
  console.log(isDevelopment ? 'isDev' : 'production!')
  window.webContents.send(IpcMessageType.BUSYBEE_LOG_MSG, isDevelopment ? 'isDev' : 'production!');

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})


/**
 * database
 */
const databaseDir = path.join(app.getPath('userData'), 'databases')
fs.mkdirsSync(databaseDir);
const databaseFilePath = path.join(databaseDir, 'busybee-ui.db');

ipcMain.on(IpcMessageType.GET_DB_FILE, async (event:Event) => {

  try {
    
    let dbFile:Uint8Array|null;
    if (fs.pathExistsSync(databaseFilePath)) {
      dbFile = await fs.readFile(databaseFilePath);
    } else {
      const db = new SQL.Database();
      dbFile = db.export();
      const buffer = new Buffer(dbFile);
      await fs.writeFile(databaseFilePath, buffer);
    }
    
    event.sender.send(IpcMessageType.DB_FILE_READY, dbFile);
  } catch (e) {
    logger.error(e.message);
  }
});

ipcMain.on(IpcMessageType.WRITE_DB_DATA, (event:Event, dbData:Uint8Array) => {
  const buffer = new Buffer(dbData);
  fs.writeFile(databaseFilePath, buffer); 
});

// Busybee CMDLine events
ipcMain.on(IpcMessageType.RUN_BUSYBEE_TEST, (event: Event, runConfig:TestRunConfig) => {
  busybeeTest(runConfig);
});

ipcMain.on(IpcMessageType.WS_CLIENT_INIT, (event: Event, connectionInfo:WSConnectionInfo|null = null) => {
  initWs(connectionInfo);
});

ipcMain.on(IpcMessageType.CANCEL_BUSYBEE_TEST, (event: Event) => {
  if (runCmd) {
    runCmd.kill();
    runCmd = null;
  }
  if (ws) {
    ws.close();
    ws = null;
  }
});

let ws:WebSocket | null;
function initWs(connectionInfo:WSConnectionInfo|null): WebSocket {
  logger.debug('initWs');
  if (ws) {
    ws.close();
  }
  
  let uri = 'ws://localhost:8080';
  if (connectionInfo) {
    uri = `ws:${connectionInfo.host}:${connectionInfo.port}`;
  }
  ws = new WebSocket(uri);
  
  ws.onerror = (e:any) => {
    logger.debug('ws error');
    logger.debug(e, true);
    if (mainWindow) {
      mainWindow.webContents.send(IpcMessageType.WS_CLIENT_ERROR, `Error communicating with Busybee @ ${uri}. Please ensure that the port is available. If connecting remotely confirm that Busybee is running`);
    }
  }
  
  ws.onopen = () => {
    logger.debug('socket opened!')
  }
  
  ws.onmessage = (e:any) => {
    logger.debug('ws data recieved!');
    // pass to the render
    if (mainWindow !== null) {
      // send data to the browser
      mainWindow.webContents.send(IpcMessageType.BUSYBEE_MSG, JSON.parse(e.data));
    }
  }
  
  ws.onclose = () => {
    logger.debug('ws closed!');
    ws = null;
    if (mainWindow) {
      mainWindow.webContents.send(IpcMessageType.WS_CLIENT_CLOSED);
    }
  }
  
  return ws;
}

let runCmd:ChildProcess | null;
function busybeeTest(runConfig:TestRunConfig) {
  logger.debug('busybeeTest');
  console.log(process.env.PATH)
  // run busybee
  let spawnOpts = {
    env: {
      PATH: process.env.PATH
    }
  }
  runCmd = spawn('busybee', ['test', '-d', runConfig.dirPath, '-w', `${runConfig.wsConnectionInfo.port}`], spawnOpts);

  runCmd.stderr.on('data', (data) => {
    if (!runCmd) return;
    logger.debug('error recieved');
    logger.debug(data.toString());
    runCmd.kill('SIGHUP');
  });
  
  let ws:WebSocket;
  runCmd.stdout.on('data', (data) => {
    let lines = IOUtil.parseDataBuffer(data);
    lines.forEach((l) => {
      logger.debug(l);
      if (l.indexOf(`wss running at ${runConfig.wsConnectionInfo.port}`) !== -1) {
        initWs(runConfig.wsConnectionInfo);
      }
    })
  });
  
  runCmd.on('close', () => {
    logger.debug('close');
    if (ws) {
      ws.close();
    }
  });
};
