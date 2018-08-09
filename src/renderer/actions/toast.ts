import { ToastLevel } from "../../shared/constants/ToastLevel";

export class ToastActionTypes {
  static readonly SET_TOAST = 'SET_TOAST'; 
}

export default class ToastActions {
    
    static dismiss() {
        return {
            type: ToastActionTypes.SET_TOAST,
            payload: null
        }
    }

    static error(value:string) {
        return {
            type: ToastActionTypes.SET_TOAST,
            payload:  {
                value: value,
                level: ToastLevel.ERROR
            }
        }
    }

}