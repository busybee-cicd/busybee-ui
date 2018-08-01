'use strict'

import { app, BrowserWindow, Event, ipcMain } from 'electron'
import * as path from 'path'
import { format as   formatUrl } from 'url'
import SQL from 'sql.js';
import * as MessageTypes from '../shared/constants/ipc-message-types';
import * as fs from 'fs-extra';
import * as WebSocket from 'ws';
import { WSConnectionInfo } from '../shared/models/WSConnectionInfo';
import { RunTestConfig } from '../shared/models/RunTestConfig';
import { spawn } from 'child_process';
import { IOUtil, Logger, LoggerConf } from 'busybee-util';

const loggerConf = new LoggerConf(
  {
    constructor: {
      name: 'MainProcess'
    }
  },
  process.env['LOG_LEVEL'] || 'INFO',
  null
);
const logger = new Logger(loggerConf);
const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow:BrowserWindow|null;

function createMainWindow() {
  const window = new BrowserWindow();
  window.setSize(1200,900);

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
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
  })

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
const databaseFilePath = path.join(app.getPath('userData'), 'databases/starter.db');
ipcMain.on(MessageTypes.GET_DB_FILE, async (event:Event) => {

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
    
    event.sender.send(MessageTypes.DB_FILE_READY, dbFile);
  } catch (e) {
    logger.error(e.message);
  }
});

ipcMain.on(MessageTypes.WRITE_DB_DATA, (event:Event, dbData:Uint8Array) => {
  const buffer = new Buffer(dbData);
  fs.writeFile(databaseFilePath, buffer); 
});

// Busybee CMDLine events
ipcMain.on(MessageTypes.RUN_BUSYBEE_TEST, (event: Event, runConfig:RunTestConfig) => {
  busybeeTest(runConfig);
});

ipcMain.on(MessageTypes.INIT_WS_CLIENT, (event: Event, connectionInfo:WSConnectionInfo|null = null) => {
  initWs(connectionInfo);
});

function initWs(connectionInfo:WSConnectionInfo|null): WebSocket {
  logger.debug('initWs')
  let uri = 'ws://localhost:8080';
  if (connectionInfo) {
    uri = `ws:${connectionInfo.host}:${connectionInfo.port}`;
  }
  const ws = new WebSocket(uri);
  
  ws.onerror = (e:any) => {
    logger.debug('ws error');
    logger.debug(e, true);
  }
  
  ws.onopen = () => {
    logger.debug('socket opened!')
  }
  
  ws.onmessage = (e:any) => {
    logger.debug('ws data recieved!');
    // pass to the render
    if (mainWindow !== null) {
      // send data to the browser
      mainWindow.webContents.send(MessageTypes.BUSYBEE_MSG, JSON.parse(e.data));
    }
  }
  
  ws.onclose = () => {
    logger.debug('ws closed!');
  }
  
  return ws;
}


function busybeeTest(runConfig:RunTestConfig) {
  logger.debug('busybeeTest')
  // run busybee
  const runCmd  = spawn('busybee', ['test', '-d', runConfig.dirPath, '-w', `${runConfig.wsConnectionInfo.port}`]);
  
  runCmd.stderr.on('data', (data) => {
    logger.debug('error recieved');
    logger.debug(data.toString());
    runCmd.kill('SIGHUP');
  });
  
  let ws:WebSocket;
  runCmd.stdout.on('data', (data) => {
    let lines = IOUtil.parseDataBuffer(data);
    lines.forEach((l) => {
      logger.debug(l);
      if (l.startsWith(`INFO: wss running at ${runConfig.wsConnectionInfo.port}`)) {
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
