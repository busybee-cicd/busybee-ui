import { combineReducers } from 'redux';
import appReducer, { AppState } from './app';
import testRunReducer, { TestRunState } from './testRun';
import toastReducer, { ToastState } from './toast';
import testResultReducer, { TestResultState } from './testResult';

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
  testResult: TestResultState;
  testRun: TestRunState;
  toast: ToastState;
}

export default combineReducers<any, any>({
  app: appReducer,
  testResult: testResultReducer,
  testRun: testRunReducer,
  toast: toastReducer
});