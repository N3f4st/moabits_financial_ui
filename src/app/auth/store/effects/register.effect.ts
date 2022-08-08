import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import {
  registerAction,
  registerFailureAction,
  registerSuccessAction,
} from "../actions/register.action";
import { switchMap, map, catchError, finalize, tap } from "rxjs/operators";
import { CurrentAppUserInterface } from "../../types/CurrentAppUser.interface";
import { of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable()
export class RegisterEffect {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAction),
      switchMap((request: any) => {
        return this.authService.registerAppUser(request).pipe(
          map((currentAppUser: CurrentAppUserInterface) => {
            return registerSuccessAction({ currentAppUser });
          }),

          catchError((errorResponse: HttpErrorResponse) => {
            return of(registerFailureAction(errorResponse.error));
          })
        );
      })
    )
  );

  redirectAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registerSuccessAction),
        tap(() => {
          this.router.navigateByUrl("auth/sign");
        })
      ),
    { dispatch: false }
  );
}
