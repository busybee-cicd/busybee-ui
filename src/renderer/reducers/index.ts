import { ActionTypes } from "../actions";
import { NavState } from "../../shared/enums/NavState"
import { Connection } from "typeorm";
import { TestRunStatusEntity } from "../entities/TestRunStatusEntity";

let initialTSTestRunData:AnyOfArrays = {};

export interface AppState {
  currentNavState: NavState,
  currentTestRunId: string | null,
  db: Connection | null,
  runViewSliderIndex: number,
  testRunHistory: any[],
  testDirPath: string,
  timeSeriesTestRunData: AnyOfArrays,
  wsHost: string,
  wsPort: number
}

const initialState:AppState = {
  currentNavState: NavState.TEST_RUN,
  currentTestRunId: null,
  db: null,
  runViewSliderIndex: 0,
  testRunHistory: [],
  testDirPath: '/Users/212589146/dev/busybee/busybee/test/IT/fixtures/REST-multi-env',
  timeSeriesTestRunData : initialTSTestRunData,
  wsHost: 'localhost',
  wsPort: 8080
};

const set = (state:any, newState:any):any  => {
  return Object.assign({}, state, newState);
}
const rootReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case ActionTypes.DB_READY:
      return set(state, {db: action.payload});
    case ActionTypes.SET_USER:
      return set(state, {user: action.payload});
    case ActionTypes.BUSYBEE_MESSAGE_RECIEVED:
      switch (action.payload.type) {
        default:
          return state;
      }
    case ActionTypes.SET_CURRENT_TEST_RUN_ID:
      return set(state, {currentTestRunId: action.payload});
    case ActionTypes.TEST_RUN_STATUS_RECIEVED:
      let tsRunDataArr = [];
      let newTsRunData:any = {};
      let status:TestRunStatusEntity = action.payload;
      let runId = status.runId;
      if (state.timeSeriesTestRunData[runId]) {
        tsRunDataArr = state.timeSeriesTestRunData[runId].slice();
        newTsRunData = Object.assign({}, state.timeSeriesTestRunData);
      }
      tsRunDataArr.push(status);
      newTsRunData[runId] = tsRunDataArr;
      
      let updateState:any = {
        timeSeriesTestRunData: newTsRunData,
      };
  
      if (state.currentTestRunId === null) {
        // ensure that if this is a fresh run that it is displayed in the UI
        updateState.currentTestRunId = status.runId;
      }

      updateState.runViewSliderIndex = tsRunDataArr.length - 1;

      return set(state, updateState);
    case ActionTypes.TEST_RUN_RESULT_RECIEVED:
      console.log('TEST_RUN_RESULT_RECIEVED')
      return state;
    case ActionTypes.SET_TIME_SERIES_RUN_DATA:
      return set(state, {timeSeriesTestRunData: action.payload})
    case ActionTypes.TEST_RUN_HISTORY_RECIEVED:
      return set(state, {testRunHistory: action.payload})
    case ActionTypes.SET_TEST_RUN_VIEW_SLIDER_INDEX:
      return set(state, {runViewSliderIndex: action.payload})
    case ActionTypes.NAVIGATE:
      return set(state, {currentNavState: action.payload})
    default:
      return state;
  }
};

export default rootReducer;