const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
import { UserEntity } from '../entities/UserEntity';
​import { Connection, getConnectionManager, ConnectionManager, createConnection } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import * as IpcMessageTypes from '../../shared/constants/ipc-message-types';
import { RunTestConfig } from '../../shared/models/RunTestConfig';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';

export class ActionTypes {
  static readonly DB_READY = 'DB_READY'; 
  static readonly FETCH_DB = 'FETCH_DB';
  static readonly SAVE_USER = 'SAVE_USER';
  static readonly FETCH_USER = 'FETCH_USER';
  static readonly SET_USER = 'SET_USER';
  static readonly RUN_TEST = 'RUN_TEST';
  static readonly BUSYBEE_MESSAGE_RECIEVED = 'BUSYBEE_MESSAGE_RECIEVED';
}
    
export function fetchDb() {
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
                entities: [UserEntity],
                synchronize: true,
                autoSave: true,
                autoSaveCallback: async (data: Uint8Array) => {
                    ipcRenderer.send(IpcMessageTypes.WRITE_DB_DATA, data);
                }
            });
        }
        
        dispatch(dbReady(db));
    });
  }
}

export const dbReady = (db:Connection) => ({
  type: ActionTypes.DB_READY,
  payload: db
});

export function fetchUser() {
  return async (dispatch:Dispatch<AnyAction>, getState:()=>any) => {
    const { db } = getState();
    const userRepo = db.getRepository(UserEntity);
    const user = await userRepo.findOne(1);
    dispatch(setUser(user));
  }
}

export function saveUser(userForm:any) {
  return async (dispatch:Dispatch<AnyAction>, getState:()=>any) => {  
    const { db } = getState();
    const userRepo = db.getRepository(UserEntity);
    const user = new UserEntity(userForm);
    await userRepo.save(user);
    
    const savedUser = await userRepo.findOne({name: user.name});
    dispatch(setUser(savedUser));
  }
}

export const setUser = (user: UserEntity) => ({
  type: ActionTypes.SET_USER,
  payload: user
});

export function runTest(runTestConfig:RunTestConfig) {
  return (dispatch:Dispatch<AnyAction>) => {  
    // ask for the db connection
    ipcRenderer.send(IpcMessageTypes.RUN_BUSYBEE_TEST, runTestConfig);
  }
}

export function listenForBusybeeMessages() {
  return (dispatch:Dispatch<AnyAction>) => {  
    ipcRenderer.on(IpcMessageTypes.BUSYBEE_MSG, async (event:any, msg:BusybeeMessageI) => {
        dispatch(busybeeMessageRecieved(msg));
    });
  }
}

export const busybeeMessageRecieved = (msg: BusybeeMessageI) => ({
  type: ActionTypes.BUSYBEE_MESSAGE_RECIEVED,
  payload: msg
});