import { State, ReducerAction, set } from ".";
import { ActionTypes } from "../actions";
import { ToastMessageI } from "../../shared/models/ToastMessageI";

export interface ToastState extends State {
    message: ToastMessageI | null;
}
  
const initialState:ToastState = {
    message: null
};

export default (state:ToastState = initialState, action:ReducerAction):ToastState => {
    switch (action.type) {
        case ActionTypes.toast.SET_TOAST:
            return set(state, {message: action.payload});
        default:
            return state;
    }
};