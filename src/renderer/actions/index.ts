import AppActions,  { AppActionTypes } from './app';
import TestRunActions, { TestRunActionTypes } from './testRun';
import ToastActions, { ToastActionTypes } from './toast';

export const ActionTypes = {
  app: AppActionTypes,
  toast: ToastActionTypes,
  testRun: TestRunActionTypes,
}

export const Actions = {
  app: AppActions,
  toast: ToastActions,
  testRun: TestRunActions
}