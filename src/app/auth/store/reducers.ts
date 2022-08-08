import { Action, createReducer, on } from "@ngrx/store";
import { AuthStateInterface } from "../types/AuthState.interface";
import {
  registerAction,
  registerFailureAction,
  registerSuccessAction,
} from "./actions/register.action";
import {
  signAction,
  signFailureAction,
  signSuccessAction,
} from "./actions/sign.action";

const initialState: AuthStateInterface = {
  isSubmitting: false,
  currentAppUser: null,
  validationError: null,
  isLoggedIn: null,
  accessToken: null,
};

const authReducer = createReducer(
  initialState,
  on(
    registerAction,
    (state): AuthStateInterface => ({
      ...state,
      isSubmitting: true,
      validationError: null,
    })
  ),
  on(
    registerSuccessAction,
    (state, action): AuthStateInterface => ({
      ...state,
      isSubmitting: false,
      isLoggedIn: true,
      currentAppUser: action.currentAppUser,
    })
  ),
  on(
    registerFailureAction,
    (state, action): AuthStateInterface => ({
      ...state,
      isSubmitting: false,
      validationError: action.error,
    })
  ),

  on(
    signAction,
    (state): AuthStateInterface => ({
      ...state,
      isSubmitting: true,
      validationError: null,
    })
  ),
  on(
    signSuccessAction,
    (state, action): AuthStateInterface => ({
      ...state,
      isSubmitting: false,
      isLoggedIn: true,
      accessToken: action.signResponse,
    })
  ),
  on(
    signFailureAction,
    (state, action): AuthStateInterface => ({
      ...state,
      isSubmitting: false,
      validationError: action.error,
    })
  )
);

export function reducers(state: AuthStateInterface, action: Action) {
  return authReducer(state, action);
}
