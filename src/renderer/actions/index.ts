import AppActions,  { AppActionTypes } from './app';
import TestRunActions, { TestRunActionTypes } from './testRun';
import ToastActions, { ToastActionTypes } from './toast';
import TestResultActions, { TestResultActionTypes }  from './testResult';

export const ActionTypes = {
  app: AppActionTypes,
  toast: ToastActionTypes,
  testResult: TestResultActionTypes,
  testRun: TestRunActionTypes,
}

export const Actions = {
  app: AppActions,
  toast: ToastActions,
  testResult: TestResultActions,
  testRun: TestRunActions
}