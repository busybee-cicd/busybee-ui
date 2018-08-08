const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
import { UserEntity } from '../entities/UserEntity';
​import { Connection, getConnectionManager, ConnectionManager, createConnection, Repository } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import * as IpcMessageTypes from '../../shared/constants/ipc-message-types';
import {NavLocation} from '../../shared/enums/NavLocation';
import { TestRunConfig } from '../../shared/models/TestRunConfig';
import { BusybeeMessageI } from '../../shared/models/BusybeeMessageI';
import { TestRunStatusEntity } from '../entities/TestRunStatusEntity';
import * as BusybeeMessageTypes from "../../shared/constants/busybee-message-types";
import { TestRunResultEntity } from '../entities/TestRunResultEntity';
import { RootState } from '../reducers';
import { WSConnectionInfo } from '../../shared/models/WSConnectionInfo';

export class ActionTypes {
  static readonly DB_READY = 'DB_READY'; 
  static readonly FETCH_DB = 'FETCH_DB';
  static readonly SAVE_USER = 'SAVE_USER';
  static readonly FETCH_USER = 'FETCH_USER';
  static readonly SET_USER = 'SET_USER';
  static readonly RUN_TEST = 'RUN_TEST';
  static readonly SET_CURRENT_TEST_RUN_ID = 'SET_CURRENT_TEST_RUN_ID';
  static readonly BUSYBEE_MESSAGE_RECIEVED = 'BUSYBEE_MESSAGE_RECIEVED';
  static readonly TEST_RUN_STATUS_RECIEVED = 'TEST_RUN_STATUS_RECIEVED';
  static readonly TEST_RUN_RESULT_RECIEVED = 'TEST_RUN_RESULT_RECIEVED';
  static readonly NAVIGATE = 'NAVIGATE';
  static readonly FETCH_TEST_RUN_HISTORY = 'FETCH_TEST_RUN_HISTROY';
  static readonly TEST_RUN_HISTORY_RECIEVED = 'TEST_RUN_HISTORY_RECIEVED';
  static readonly SET_TIME_SERIES_RUN_DATA = 'SET_TIME_SERIES_RUN_DATA';
  static readonly SET_TEST_RUN_VIEW_SLIDER_INDEX = 'SET_TEST_RUN_VIEW_SLIDER_INDEX';
  static readonly SET_REMOTE_CONNECT = 'SET_REMOTE_CONNECT';
  static readonly SET_IS_RUNNING = 'SET_IS_RUNNING';
}

const entities = [
  TestRunStatusEntity,
  TestRunResultEntity
];
    
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
                entities: entities,
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

export const setUser = (user: UserEntity) => ({
  type: ActionTypes.SET_USER,
  payload: user
});

export function runTest(runTestConfig:TestRunConfig) {
  return (dispatch:Dispatch<any>) => {  
    // ask for the db connection
    ipcRenderer.send(IpcMessageTypes.RUN_BUSYBEE_TEST, runTestConfig);
    dispatch(setCurrentTestRunId(null));
    dispatch(setIsRunning(true));
  }
}

export function listenForBusybeeMessages() {
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
          dispatch(testRunStatusRecieved(savedStatus));
          break;
        case BusybeeMessageTypes.TEST_RUN_RESULT:
          const resultRepo:Repository<TestRunResultEntity> = db.getRepository(TestRunResultEntity);
          const savedResult = await resultRepo.save(new TestRunStatusEntity(msg));
          if (!savedResult) {
            throw Error("error when saving result!")
          }

          dispatch(fetchTestRunHistory());
          dispatch(setIsRunning(false));
          dispatch(testRunResultRecieved(savedResult));
        break;
        default:
          dispatch(busybeeMessageRecieved(msg));
      }
    });
  }
}

export function fetchTestRunHistory() {
  return async (dispatch:Dispatch<AnyAction>, getState:() => RootState) => {
    const { app } = getState()
    const { db } = app;

    if (!db) {
      throw Error("no active database connection")
    }

    const statusRepo:Repository<TestRunStatusEntity> = db.getRepository(TestRunStatusEntity);
    const orderedHistory:TestRunStatusEntity[] = await
      statusRepo
        .createQueryBuilder("status")
        .groupBy("status.runTimestamp")
        .orderBy("status.runTimestamp", "DESC")
        .getMany()
            
    dispatch(testRunHistoryRecieved(orderedHistory));
  }
}

export const testRunStatusRecieved = (status: TestRunStatusEntity) => ({
  type: ActionTypes.TEST_RUN_STATUS_RECIEVED,
  payload: status
});

export const testRunResultRecieved = (result: any) => ({
  type: ActionTypes.TEST_RUN_RESULT_RECIEVED,
  payload: result
});

export const busybeeMessageRecieved = (msg: BusybeeMessageI) => ({
  type: ActionTypes.BUSYBEE_MESSAGE_RECIEVED,
  payload: msg
});

export const navigate = (navLocation: NavLocation) => ({
  type: ActionTypes.NAVIGATE,
  payload: navLocation
});

export const testRunHistoryRecieved = (history: TestRunStatusEntity[]) => ({
  type: ActionTypes.TEST_RUN_HISTORY_RECIEVED,
  payload: history
});

export function setCurrentTestRunId(runId: string | null) {
  return async (dispatch:Dispatch<AnyAction>, getState:() => RootState) => {
    const { app, testRun } = getState();
    const { db } = app;
    const { timeSeriesData } = testRun;

    if (!db) {
      throw Error("no active database connection")
    }

    if (runId != null && !timeSeriesData[runId]) {
      // we need to populate this run's data into the timeSeriesTestRunData
      const statusRepo:Repository<TestRunStatusEntity> = db.getRepository(TestRunStatusEntity);
      const orderedRunData:TestRunStatusEntity[] = await
      statusRepo
        .createQueryBuilder("status")
        .where(`status.runId = "${runId}"`)
        .orderBy("status.timestamp", "ASC")
        .getMany()

        timeSeriesData[runId] = orderedRunData;
    }
    dispatch(setTimeSeriesRunData(timeSeriesData));
    dispatch(currentTestRunIdSet(runId))
  }
}

export const currentTestRunIdSet = (id: string | null) => ({
  type: ActionTypes.SET_CURRENT_TEST_RUN_ID,
  payload: id
});

export const setTimeSeriesRunData = (data:AnyOfArrays) => ({
  type: ActionTypes.SET_TIME_SERIES_RUN_DATA,
  payload: data
});

export const setTestRunViewSliderIndex = (index:number) => ({
  type: ActionTypes.SET_TEST_RUN_VIEW_SLIDER_INDEX,
  payload: index
});

export const setRemoteConnect = (value:boolean) => ({
  type: ActionTypes.SET_REMOTE_CONNECT,
  payload: value
});

export const setIsRunning = (value:boolean) => ({
  type: ActionTypes.SET_IS_RUNNING,
  payload: value
});


export function connectToWs(config:WSConnectionInfo) {
  return (dispatch:Dispatch<any>) => {  
    // ask for the db connection
    ipcRenderer.send(IpcMessageTypes.INIT_WS_CLIENT, config);
    dispatch(setCurrentTestRunId(null));
    dispatch(setIsRunning(true));
  }
}