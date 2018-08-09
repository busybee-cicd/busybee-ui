const ipcRenderer = require('electron').ipcRenderer;
// db
require('reflect-metadata');
​import { Repository } from 'typeorm';
import { Dispatch, AnyAction } from 'redux';
import {IpcMessageType }from '../../shared/constants/IpcMessageType';
import { TestRunConfig } from '../../shared/models/TestRunConfig';
import { TestRunStatusEntity } from '../entities/TestRunStatusEntity';
import { RootState } from '../reducers';
import { WSConnectionInfo } from '../../shared/models/WSConnectionInfo';

export class TestRunActionTypes {
  static readonly SET_CURRENT_TEST_RUN_ID = 'SET_CURRENT_TEST_RUN_ID';
  static readonly BUSYBEE_MESSAGE_RECIEVED = 'BUSYBEE_MESSAGE_RECIEVED';
  static readonly TEST_RUN_STATUS_RECIEVED = 'TEST_RUN_STATUS_RECIEVED';
  static readonly TEST_RUN_RESULT_RECIEVED = 'TEST_RUN_RESULT_RECIEVED';
  static readonly TEST_RUN_HISTORY_RECIEVED = 'TEST_RUN_HISTORY_RECIEVED';
  static readonly SET_TIME_SERIES_RUN_DATA = 'SET_TIME_SERIES_RUN_DATA';
  static readonly SET_TEST_RUN_VIEW_SLIDER_INDEX = 'SET_TEST_RUN_VIEW_SLIDER_INDEX';
  static readonly SET_REMOTE_CONNECT = 'SET_REMOTE_CONNECT';
  static readonly SET_IS_RUNNING = 'SET_IS_RUNNING';
}

export default class TestRunActions {

    static runTest(runTestConfig:TestRunConfig) {
        return (dispatch:Dispatch<any>) => {  
            // ask for the db connection
            ipcRenderer.send(IpcMessageType.RUN_BUSYBEE_TEST, runTestConfig);
            dispatch(TestRunActions.setCurrentTestRunId(null));
            dispatch(TestRunActions.setIsRunning(true));
        }
    }
    
    static cancelTest() {
        return async (dispatch:Dispatch<any>, getState:() => RootState) => {  
            const { app, testRun } = getState();
            const { db } = app;
            const { currentRunId } = testRun;

            if (db && currentRunId) {
                const statusRepo:Repository<TestRunStatusEntity> = db.getRepository(TestRunStatusEntity);
                await statusRepo.delete({runId: currentRunId});
            }
            
            // ask for the db connection
            ipcRenderer.send(IpcMessageType.CANCEL_BUSYBEE_TEST);
            dispatch(TestRunActions.setCurrentTestRunId(null));
            dispatch(TestRunActions.setIsRunning(false));
        }
    }

    static fetchTestRunHistory() {
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
                    
            dispatch(TestRunActions.testRunHistoryRecieved(orderedHistory));
        }
    }

    static testRunStatusRecieved(status: TestRunStatusEntity) {
        return {
            type: TestRunActionTypes.TEST_RUN_STATUS_RECIEVED,
            payload: status
        }
    }

    static testRunResultRecieved(result: any) {
        return {
            type: TestRunActionTypes.TEST_RUN_RESULT_RECIEVED,
            payload: result
        }
    }

    static testRunHistoryRecieved(history: TestRunStatusEntity[]) {
        return {
            type: TestRunActionTypes.TEST_RUN_HISTORY_RECIEVED,
            payload: history
        }
    }

    static setCurrentTestRunId(runId: string | null) {
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
            dispatch(TestRunActions.setTimeSeriesRunData(timeSeriesData));
            dispatch(TestRunActions.currentTestRunIdSet(runId))
        }
    }

    static currentTestRunIdSet(id: string | null) {
        return {
            type: TestRunActionTypes.SET_CURRENT_TEST_RUN_ID,
            payload: id
        }
    }

    static setTimeSeriesRunData(data:AnyOfArrays) {
        return {
            type: TestRunActionTypes.SET_TIME_SERIES_RUN_DATA,
            payload: data
        }
    }

    static setTestRunViewSliderIndex(index:number) {
        return {
            type: TestRunActionTypes.SET_TEST_RUN_VIEW_SLIDER_INDEX,
            payload: index
        }
    }

    static setRemoteConnect(value:boolean) {
        return {
            type: TestRunActionTypes.SET_REMOTE_CONNECT,
            payload: value
        }
    }

    static setIsRunning(value:boolean) {
        return {
            type: TestRunActionTypes.SET_IS_RUNNING,
            payload: value
        }
    }

    static connectToWs(config:WSConnectionInfo) {
        return (dispatch:Dispatch<any>) => {  
            // ask for the db connection
            ipcRenderer.send(IpcMessageType.INIT_WS_CLIENT, config);
            dispatch(TestRunActions.setCurrentTestRunId(null));
            dispatch(TestRunActions.setIsRunning(true));
        }
    }
}