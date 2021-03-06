const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
​import { Connection, getConnectionManager, ConnectionManager, createConnection, Repository } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import { IpcMessageType } from '../../shared/constants/IPCMessageType';
import { NavLocation } from '../../shared/enums/NavLocation';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';
import { TestRunStatusEntity } from '../entities/TestRunStatusEntity';
import { TestRunResultsEntity } from '../entities/TestRunResultsEntity';
import TestRunActions from './testRun';
import TestResultActions from './testResult';
import ToastActions from './toast';
import { BusybeeMessageType } from '../../shared/constants/BusybeeMessageType';
import { RootState } from '../reducers';

export class AppActionTypes {
  static readonly DB_READY = 'DB_READY'; 
  static readonly NAVIGATE = 'NAVIGATE';
  static readonly BUSYBEE_MESSAGE_RECIEVED = 'BUSYBEE_MESSAGE_RECIEVED';
  static readonly APPEND_LOG = 'APPEND_LOG';
  static readonly CLEAR_LOG = 'CLEAR_LOG';
}

const entities = [
    TestRunStatusEntity,
    TestRunResultsEntity
];

export default class AppActions {

    static appendLog(msg:string) {
        return {
            type: AppActionTypes.APPEND_LOG,
            payload: msg
        }
    }

    static clearLog() {
        return {
            type: AppActionTypes.CLEAR_LOG
        }
    }
    
    static fetchDb() {
        return (dispatch:Dispatch<AnyAction>) => {  
            // ask for the db connection
            ipcRenderer.send(IpcMessageType.GET_DB_FILE);
            // listen for the db connection
            ipcRenderer.on(IpcMessageType.DB_FILE_READY, async (event:any, dbFile:Uint8Array) => {
                // check for existing connection
                let db:Connection;
                const manager:ConnectionManager = getConnectionManager();
                if (manager.has('default')) {
                  db = manager.get();
                } else {
                  db = await createConnection({
                        type: 'sqljs',
                        database: dbFile,
                        entities: entities,
                        synchronize: true,
                        autoSave: true,
                        autoSaveCallback: async (data: Uint8Array) => {
                            ipcRenderer.send(IpcMessageType.WRITE_DB_DATA, data);
                        }
                    });
                }
                
                dispatch(AppActions.dbReady(db));
            });
        }
    }

    static dbReady(db:Connection) {
        return {
            type: AppActionTypes.DB_READY,
            payload: db 
        }
    }

    static listenForIpcMessages() {
        return (dispatch:Dispatch<any>, getState: () => RootState) => {  
            ipcRenderer.on(IpcMessageType.BUSYBEE_MSG, async (event:any, msg:BusybeeMessageI) => {
                const { app } = getState();
                const { db } = app;
        
                if (!db) {
                    throw Error("no active database connection")
                }
        
                switch (msg.type) {
                    case BusybeeMessageType.TEST_RUN_STATUS:
                        const statusRepo:Repository<TestRunStatusEntity> = db.getRepository(TestRunStatusEntity);
                        const savedStatus = await statusRepo.save(new TestRunStatusEntity(msg));
                        if (!savedStatus) {
                            throw Error("error when saving status!")
                        }
                        dispatch(TestRunActions.testRunStatusRecieved(savedStatus));
                        break;
                    case BusybeeMessageType.TEST_RUN_RESULT:
                        const resultRepo:Repository<TestRunResultsEntity> = db.getRepository(TestRunResultsEntity);
                        const savedResult = await resultRepo.save(new TestRunResultsEntity(msg));
                        if (!savedResult) {
                            throw Error("error when saving result!")
                        }
        
                        dispatch(TestRunActions.fetchTestRunHistory());
                        dispatch(TestRunActions.setIsRunning(false));
                        dispatch(TestResultActions.testResultRecieved(savedResult));
                        // navigate to result?
                        break;
                    default:
                        dispatch(AppActions.busybeeMessageRecieved(msg));
                }
            });

            ipcRenderer.on(IpcMessageType.WS_CLIENT_CLOSED, (event:any, message:string) => {
                dispatch(TestRunActions.setRemoteConnect(false));
            });

            ipcRenderer.on(IpcMessageType.WS_CLIENT_ERROR, (event:any, message:string) => {
                dispatch(TestRunActions.setIsRunning(false));
                dispatch(ToastActions.error(message));
            });

            ipcRenderer.on(IpcMessageType.BUSYBEE_LOG_MSG, (event:any, message:string) => {
                dispatch(AppActions.appendLog(message));
            });
        }
    }

    static busybeeMessageRecieved(msg:BusybeeMessageI) {
        return {
            type: AppActionTypes.BUSYBEE_MESSAGE_RECIEVED,
            payload: msg
        }
    }

    static navigate(navLocation: NavLocation) {
        return {
            type: AppActionTypes.NAVIGATE,
            payload: navLocation
        }
    }
}