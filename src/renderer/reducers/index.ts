import { ActionTypes } from "../actions";
import * as BusybeeMessageTypes from "../../shared/constants/busybee-message-types";
import * as _ from "lodash";
import {NavState} from "../../shared/enums/NavState"

let initialTSTestRunData:AnyOfArrays = {};
let initialTSTreeTestRunData:AnyOfArrays = {};

const initialState = {
  currentNavState: NavState.RUN_TEST,
  db: null,
  runTestHistory: [
    {runId: 1533079149908}, {runId: 1533079149908}, {runId: 1533079149908}, {runId: 1533079149908}
  ],
  testDirPath: '/Users/simontownsend/dev/busybee/test/IT/fixtures/REST-ws-test',
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
        case BusybeeMessageTypes.TEST_RUN_STATUS:
          let msgData:any = action.payload.data;

          let tsRunDataArr = [];
          let newTsRunData:any = {};
          if (state.timeSeriesTestRunData[msgData.runId]) {
            tsRunDataArr = state.timeSeriesTestRunData[msgData.runId].slice();
            newTsRunData = Object.assign({}, state.timeSeriesTestRunData);
          }
          tsRunDataArr.push(action.payload.data);
          newTsRunData[msgData.runId] = tsRunDataArr;
          
          let tsTreeRunDataArr = [];
          let newTsTreeRunData:any = {};
          if (state.timeSeriesTreeTestRunData[msgData.runId]) {
            tsTreeRunDataArr = state.timeSeriesTreeTestRunData[msgData.runId].slice();
            newTsTreeRunData = Object.assign({}, state.timeSeriesTreeTestRunData);
          }
          tsTreeRunDataArr.push(buildTreeTestRunData(action.payload.data));
          newTsTreeRunData[msgData.runId] = tsTreeRunDataArr;
          
          return set(
            state, 
            {
              timeSeriesTestRunData: newTsRunData, 
              timeSeriesTreeTestRunData: newTsTreeRunData
            }
          );
        default:
          return state;
      }
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
    
    
    // add each environment to each host
  });
  
  return treeData;
};


export default rootReducer;