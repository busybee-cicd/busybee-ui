import { State, ReducerAction, set } from ".";
import { ActionTypes } from "../actions";
import { BusybeeTestResults } from "busybee-results-react";

export interface TestResultState extends State {
    currentTestResults: BusybeeTestResults | null;
    fetching: boolean;
}
  
const initialState:TestResultState = {
    currentTestResults: null,
    fetching: false
};

export default (state:TestResultState = initialState, action:ReducerAction):TestResultState => {
    switch (action.type) {
        case ActionTypes.testResult.FETCHING_TEST_RESULTS:
            return set(state, {fetching: action.payload});
        case ActionTypes.testResult.SET_CURRENT_TEST_RESULTS:
            return set(state, {currentTestResults: action.payload});
        default:
            return state;
    }
};