import { NavLocation } from "../../shared/enums/NavLocation";
import { State, ReducerAction, set } from ".";
import { Connection } from "typeorm";
import { ActionTypes } from "../actions";

export interface AppState extends State {
    currentNavLocation: NavLocation,
    db: Connection | null
  }
  
const initialAppState:AppState = {
    currentNavLocation: NavLocation.TEST_RUN,
    db: null
};

export default (state:AppState = initialAppState, action:ReducerAction):AppState => {
    switch (action.type) {
        case ActionTypes.DB_READY:
            return set(state, {db: action.payload});
        case ActionTypes.BUSYBEE_MESSAGE_RECIEVED:
            switch (action.payload.type) {
                default:
                return state;
            }
        case ActionTypes.NAVIGATE:
            return set(state, {currentNavLocation: action.payload})
        default:
            return state;
    }
};