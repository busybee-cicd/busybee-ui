const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
import { UserEntity } from '../entities/UserEntity';
​import { Connection, getConnectionManager, ConnectionManager, createConnection } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import * as IpcMessageTypes from '../../shared/constants/ipc-message-types';
import {NavState} from '../../shared/enums/NavState';
import { RunTestConfig } from '../../shared/models/RunTestConfig';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';
import { RunTestStatusEntity } from '../entities/RunTestStatusEntity';
import * as BusybeeMessageTypes from "../../shared/constants/busybee-message-types";

export class ActionTypes {
  static readonly DB_READY = 'DB_READY'; 
  static readonly FETCH_DB = 'FETCH_DB';
  static readonly SAVE_USER = 'SAVE_USER';
  static readonly FETCH_USER = 'FETCH_USER';
  static readonly SET_USER = 'SET_USER';
  static readonly RUN_TEST = 'RUN_TEST';
  static readonly BUSYBEE_MESSAGE_RECIEVED = 'BUSYBEE_MESSAGE_RECIEVED';
  static readonly RUN_TEST_STATUS_RECIEVED = 'RUN_TEST_STATUS_RECIEVED';
  static readonly NAVIGATE = 'NAVIGATE';
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
                entities: [UserEntity, RunTestStatusEntity],
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
  return (dispatch:Dispatch<AnyAction>, getState: () =>any) => {  
    ipcRenderer.on(IpcMessageTypes.BUSYBEE_MSG, async (event:any, msg:BusybeeMessageI) => {
      const { db } = getState();

      switch (msg.type) {
        case BusybeeMessageTypes.TEST_RUN_STATUS:
          if (!db) {
            throw Error("no active database connection")
          }
          
          const msgData:any = msg.data;
          const statusRepo = db.getRepository(RunTestStatusEntity);
          await statusRepo.save(new RunTestStatusEntity(msgData));
          const savedStatus: RunTestStatusEntity| undefined = await statusRepo.findOne({
            runId: msgData.runId,
            timestamp: msgData.timestamp
          });
          if (!savedStatus) {
            throw Error("no active database connection")
          }
          dispatch(runTestStatusRecieved(savedStatus));
          break;
        default:
          dispatch(busybeeMessageRecieved(msg));
      }
    });
  }
}

export const runTestStatusRecieved = (status: RunTestStatusEntity) => ({
  type: ActionTypes.RUN_TEST_STATUS_RECIEVED,
  payload: status
});

export const busybeeMessageRecieved = (msg: BusybeeMessageI) => ({
  type: ActionTypes.BUSYBEE_MESSAGE_RECIEVED,
  payload: msg
});

export const navigate = (navState: NavState) => ({
  type: ActionTypes.NAVIGATE,
  payload: navState
});