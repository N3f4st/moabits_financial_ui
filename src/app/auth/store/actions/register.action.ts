import { createAction, props } from "@ngrx/store";
import { RegisterRequestInterface } from "src/app/auth/types/RegisterRequest.interface";
import { BackEndErrorInterface } from "../../types/BackErrorInterface";
import { CurrentAppUserInterface } from "../../types/CurrentAppUser.interface";
import { ActionTypes } from "../actionTypes";

export const registerAction = createAction(
  ActionTypes.REGISTER,
  props<{ request: RegisterRequestInterface }>()
);

export const registerSuccessAction = createAction(
  ActionTypes.REGISTER_SUCCESS,
  props<{ currentAppUser: CurrentAppUserInterface }>()
);

export const registerFailureAction = createAction(
  ActionTypes.REGISTER_FAILURE,
  props<{ error: BackEndErrorInterface }>()
);
