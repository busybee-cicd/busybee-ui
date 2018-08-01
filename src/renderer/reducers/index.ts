import { ActionTypes } from "../actions";
import * as BusybeeMessageTypes from "../../shared/constants/busybee-message-types";
import * as _ from "lodash";

let initialTSTestRunData:AnyOfArrays = {};
let initialTSTreeTestRunData:AnyOfArrays = {};

const initialState = {
  db: null,
  testDirPath: '/Users/simontownsend/dev/busybee/test/IT/fixtures/REST-ws-test',
  wsHost: 'localhost',
  wsPort: 8080,
  timeSeriesTestRunData : initialTSTestRunData,
  timeSeriesTreeTestRunData: initialTSTreeTestRunData
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
          if (state.timeSeriesTestRunData[msgData.timestamp]) {
            tsRunDataArr = state.timeSeriesTestRunData[msgData.timestamp].slice();
            newTsRunData = Object.assign({}, state.timeSeriesTestRunData);
          }
          tsRunDataArr.push(action.payload.data);
          newTsRunData[msgData.timestamp] = tsRunDataArr;
          
          let tsTreeRunDataArr = [];
          let newTsTreeRunData:any = {};
          if (state.timeSeriesTreeTestRunData[msgData.timestamp]) {
            tsTreeRunDataArr = state.timeSeriesTreeTestRunData[msgData.timestamp].slice();
            newTsTreeRunData = Object.assign({}, state.timeSeriesTreeTestRunData);
          }
          tsTreeRunDataArr.push(buildTreeTestRunData(action.payload.data));
          newTsTreeRunData[msgData.timestamp] = tsTreeRunDataArr;
          
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
    default:
      return state;
  }
};


const buildTreeTestRunData = (testRunStatus:any) => {
  
  const hosts:any[] = [];
  const treeData = {
    name: testRunStatus.timestamp,
    children: hosts
  };
  
  _.forEach(testRunStatus.hosts, (hostData, hostName) => {
    
    // add each host
    // const environments:any[] = [];
    treeData.children.push({
      name: hostName,
      attributes: {
        load: hostData.load,
        capacity: hostData.capacity
      },
      // children: environments
    });
    
    
    // add each environment to each host
  });
  
  return treeData;
};


export default rootReducer;