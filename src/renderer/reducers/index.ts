import { combineReducers } from 'redux';
import appReducer, { AppState } from './app';
import testRunReducer, { TestRunState } from './testRun';

export interface State {}

export interface ReducerAction {
  type: string;
  payload: any;
}

export const set = (state:any, updatedFields:any):any  => {
  return Object.assign({}, state, updatedFields);
}

export interface RootState {
  app: AppState;
  testRun: TestRunState;
}

export default combineReducers<any, any>({
  app: appReducer,
  testRun: testRunReducer
});