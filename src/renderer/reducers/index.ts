import { ActionTypes } from "../actions";
import * as _ from "lodash";
import {NavState} from "../../shared/enums/NavState"
import { Connection } from "typeorm";

let initialTSTestRunData:AnyOfArrays = {};
let initialTSTreeTestRunData:AnyOfArrays = {};


interface AppState {
  currentNavState: NavState,
  db: Connection | null,
  runTestHistory: any[],
  testDirPath: string,
  timeSeriesTestRunData: AnyOfArrays,
  timeSeriesTreeTestRunData: AnyOfArrays,
  wsHost: string,
  wsPort: number
}

const initialState:AppState = {
  currentNavState: NavState.RUN_TEST,
  db: null,
  runTestHistory: [
    {runId: 1533079149908}, {runId: 1533079149908}, {runId: 1533079149908}, {runId: 1533079149908}
  ],
  testDirPath: '/Users/simontownsend/dev/busybee/test/IT/fixtures/REST-multi-env',
  timeSeriesTestRunData : initialTSTestRunData,
  timeSeriesTreeTestRunData: initialTSTreeTestRunData,
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
    case ActionTypes.RUN_TEST_STATUS_RECIEVED:
      let tsRunDataArr = [];
      let newTsRunData:any = {};
      let status = action.payload;
      let runId = status.runId.getTime();
      if (state.timeSeriesTestRunData[runId]) {
        tsRunDataArr = state.timeSeriesTestRunData[runId].slice();
        newTsRunData = Object.assign({}, state.timeSeriesTestRunData);
      }
      tsRunDataArr.push(status.data);
      newTsRunData[runId] = tsRunDataArr;
      
      let tsTreeRunDataArr = [];
      let newTsTreeRunData:any = {};
      if (state.timeSeriesTreeTestRunData[runId]) {
        tsTreeRunDataArr = state.timeSeriesTreeTestRunData[runId].slice();
        newTsTreeRunData = Object.assign({}, state.timeSeriesTreeTestRunData);
      }
      tsTreeRunDataArr.push(buildTreeTestRunData(status.data));
      newTsTreeRunData[runId] = tsTreeRunDataArr;
      
      return set(
        state, 
        {
          timeSeriesTestRunData: newTsRunData, 
          timeSeriesTreeTestRunData: newTsTreeRunData
        }
      );
    case ActionTypes.NAVIGATE:
      return set(state, {currentNavState: action.payload})
    default:
      return state;
  }
};


const buildTreeTestRunData = (testRunStatus:any) => {
  
  const hosts:any[] = [];
  const treeData = {
    name: `${testRunStatus.runId}`,
    attributes: {
      timestamp: `${new Date(testRunStatus.timestamp).toUTCString()}`
    },
    children: hosts
  };
  
  _.forEach(testRunStatus.hosts, (hostData, hostName) => {
    
    // get en
    const environments:any[] = [];
    _.forEach(hostData.envs, (hostEnvData, envId) => {
      const envData = testRunStatus.envs[envId];
      const testSets:string[] = _.map(envData.testSets, (data:any, testSetName) => {
        return testSetName;
      });
      let portOffset:number = hostEnvData.portOffset;
      const ports:number[] = hostEnvData.ports.map((p:number) => { return p + portOffset });
      environments.push({
        name: envData.suiteEnvID,
        attributes: {
          suiteID: envData.suiteID,
          testSets: testSets,
          ports: ports
        }
      });
    });
    
    // add each host
    treeData.children.push({
      name: hostName,
      attributes: {
        load: hostData.load,
        capacity: hostData.capacity
      },
      children: environments
    });
    
  });
  
  return treeData;
};


export default rootReducer;