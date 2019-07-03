import { Dispatch, AnyAction } from "redux";
import { TestRunResultsEntity } from '../entities/TestRunResultsEntity';
import { Repository } from "typeorm";
import { RootState } from "../reducers";
import { BusybeeTestResults } from "busybee-results-react";

export class TestResultActionTypes {
    static readonly TEST_RESULTS_RECIEVED = 'TEST_RESULTS_RECIEVED'; 
    static readonly FETCHING_TEST_RESULTS = 'FETCHING_TEST_RESULTS';
    static readonly SET_CURRENT_TEST_RESULTS = 'SET_CURRENT_TEST_RESULTS';
}

export default class TestResultActions {

    // this is called when a testResult is recieved via running a test (not fetched from DB)
    static testResultRecieved(result: any) {
        return {
            type: TestResultActionTypes.TEST_RESULTS_RECIEVED,
            payload: result
        }
    }

    static setCurrentTestResults(result:BusybeeTestResults|null) {
        return {
            type: TestResultActionTypes.SET_CURRENT_TEST_RESULTS,
            payload: result
        }
    }

    static fetchingTestResults(value: boolean) {
        return {
            type: TestResultActionTypes.FETCHING_TEST_RESULTS,
            payload: value
        }
    }

    static fetchTestResults(runId:string) {
        return async (dispatch:Dispatch<AnyAction>, getState:() => RootState) => {
            dispatch(this.fetchingTestResults(true));
            const { app } = getState()
            const { db } = app;
        
            if (!db) {
                throw Error("no active database connection")
            }
            
            const repo:Repository<TestRunResultsEntity> = db.getRepository(TestRunResultsEntity);
            const results = await repo.findOne({runId: runId});
            results === undefined ?
                dispatch(this.setCurrentTestResults(null))
                : dispatch(this.setCurrentTestResults(results.data));

            dispatch(this.fetchingTestResults(false));
        }
    }
}