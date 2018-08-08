import AppActions,  { AppActionTypes } from './app';
import TestRunActions, { TestRunActionTypes } from './testRun';

export const ActionTypes = {
  app: AppActionTypes,
  testRun: TestRunActionTypes,
}

export const Actions = {
  app: AppActions,
  testRun: TestRunActions
}