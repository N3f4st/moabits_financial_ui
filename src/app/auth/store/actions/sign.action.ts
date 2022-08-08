import { createAction, props } from "@ngrx/store";
import { BackEndErrorInterface } from "../../types/BackErrorInterface";
import { SignRequestInterface } from "../../types/SignRequest.interface";
import { SignResponseInterface } from "../../types/SignResponse.interface";
import { ActionTypes } from "../actionTypes";

export const signAction = createAction(
  ActionTypes.SIGN,
  props<{ request: SignRequestInterface }>()
);

export const signSuccessAction = createAction(
  ActionTypes.SIGN_SUCCESS,
  props<{ signResponse: SignResponseInterface }>()
);

export const signFailureAction = createAction(
  ActionTypes.SIGN_FAILURE,
  props<{ error: BackEndErrorInterface }>()
);
