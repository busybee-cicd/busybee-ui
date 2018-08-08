const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
​import { Connection, getConnectionManager, ConnectionManager, createConnection, Repository } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import * as IpcMessageTypes from '../../shared/constants/ipc-message-types';
import { NavLocation } from '../../shared/enums/NavLocation';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';
import { TestRunStatusEntity } from '../entities/TestRunStatusEntity';
import { TestRunResultEntity } from '../entities/TestRunResultEntity';
import TestRunActions from './testRun';
import BusybeeMessageTypes from '../../shared/constants/busybee-message-types';
import { RootState } from '../reducers';

export class AppActionTypes {
  static readonly DB_READY = 'DB_READY'; 
  static readonly NAVIGATE = 'NAVIGATE';
  static readonly BUSYBEE_MESSAGE_RECIEVED = 'BUSYBEE_MESSAGE_RECIEVED';
}

const entities = [
    TestRunStatusEntity,
    TestRunResultEntity
];

export default class AppActions {
    
    static fetchDb() {
        return (dispatch:Dispatch<AnyAction>) => {  
            // ask for the db connection
            ipcRenderer.send(IpcMessageTypes.GET_DB_FILE);
            // listen for the db connection
            ipcRenderer.on(IpcMessageTypes.DB_FILE_READY, async (event:any, dbFile:Uint8Array) => {
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
                            ipcRenderer.send(IpcMessageTypes.WRITE_DB_DATA, data);
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

    static listenForBusybeeMessages() {
        return (dispatch:Dispatch<any>, getState: () => RootState) => {  
            ipcRenderer.on(IpcMessageTypes.BUSYBEE_MSG, async (event:any, msg:BusybeeMessageI) => {
            const { app } = getState();
            const { db } = app;
    
            if (!db) {
                throw Error("no active database connection")
            }
    
            switch (msg.type) {
                case BusybeeMessageTypes.TEST_RUN_STATUS:
                    const statusRepo:Repository<TestRunStatusEntity> = db.getRepository(TestRunStatusEntity);
                    const savedStatus = await statusRepo.save(new TestRunStatusEntity(msg));
                    if (!savedStatus) {
                        throw Error("error when saving status!")
                    }
                    dispatch(TestRunActions.testRunStatusRecieved(savedStatus));
                    break;
                case BusybeeMessageTypes.TEST_RUN_RESULT:
                    const resultRepo:Repository<TestRunResultEntity> = db.getRepository(TestRunResultEntity);
                    const savedResult = await resultRepo.save(new TestRunStatusEntity(msg));
                    if (!savedResult) {
                        throw Error("error when saving result!")
                    }
    
                    dispatch(TestRunActions.fetchTestRunHistory());
                    dispatch(TestRunActions.setIsRunning(false));
                    dispatch(TestRunActions.testRunResultRecieved(savedResult));
                    break;
                default:
                    dispatch(AppActions.busybeeMessageRecieved(msg));
            }
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