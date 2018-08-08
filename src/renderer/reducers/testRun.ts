import { ActionTypes } from "../actions";
import { ReducerAction, State, set } from ".";
import { TestRunStatusEntity } from "../entities/TestRunStatusEntity";

export interface TestRunState extends State {
    currentRunId: string | null,
    sliderIndex: number,
    history: any[],
    timeSeriesData: AnyOfArrays
  }
  
let initialTSTestRunData:AnyOfArrays = {};

const initialTestRunState:TestRunState = {
    currentRunId: null,
    sliderIndex: 0,
    history: [],
    timeSeriesData : initialTSTestRunData,
};

export default (state:TestRunState = initialTestRunState, action:ReducerAction):TestRunState => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_TEST_RUN_ID:
            return set(state, {currentRunId: action.payload, sliderIndex: 0});
        case ActionTypes.TEST_RUN_STATUS_RECIEVED:
        let tsRunDataArr = [];
        let newTsRunData:any = {};
        let status:TestRunStatusEntity = action.payload;
        let runId = status.runId;
        if (state.timeSeriesData[runId]) {
            tsRunDataArr = state.timeSeriesData[runId].slice();
            newTsRunData = Object.assign({}, state.timeSeriesData);
        }
        tsRunDataArr.push(status);
        newTsRunData[runId] = tsRunDataArr;
        
        let updateState:any = {
            timeSeriesData: newTsRunData,
            sliderIndex: tsRunDataArr.length - 1
        };

        if (state.currentRunId === null) {
            // ensure that if this is a fresh run that it is displayed in the UI
            updateState.currentRunId = status.runId;
        }

            return set(state, updateState);
        case ActionTypes.TEST_RUN_RESULT_RECIEVED:
        console.log('TEST_RUN_RESULT_RECIEVED')
            return state;
        case ActionTypes.SET_TIME_SERIES_RUN_DATA:
            return set(state, {timeSeriesData: action.payload});
        case ActionTypes.TEST_RUN_HISTORY_RECIEVED:
            return set(state, {history: action.payload});
        case ActionTypes.SET_TEST_RUN_VIEW_SLIDER_INDEX:
            return set(state, {sliderIndex: action.payload});
        default:
            return state;
    }
}