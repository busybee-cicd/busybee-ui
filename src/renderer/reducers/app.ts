import { NavLocation } from "../../shared/enums/NavLocation";
import { State, ReducerAction, set } from ".";
import { Connection } from "typeorm";
import { ActionTypes } from "../actions";

export interface AppState extends State {
    currentNavLocation: NavLocation,
    db: Connection | null,
    log: string[]
  }
  
const initialState:AppState = {
    currentNavLocation: NavLocation.TEST_RUN,
    db: null,
    log: []
};

export default (state:AppState = initialState, action:ReducerAction):AppState => {
    switch (action.type) {
        case ActionTypes.app.DB_READY:
            return set(state, {db: action.payload});
        case ActionTypes.app.BUSYBEE_MESSAGE_RECIEVED:
            switch (action.payload.type) {
                default:
                return state;
            }
        case ActionTypes.app.NAVIGATE:
            return set(state, {currentNavLocation: action.payload})
        case ActionTypes.app.APPEND_LOG:
            return set(state, {log: [ ...state.log, action.payload ]})
        case ActionTypes.app.CLEAR_LOG:
            return set(state, {log: []})
        default:
            return state;
    }
};