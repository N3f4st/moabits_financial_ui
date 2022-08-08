import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { switchMap, map, catchError, tap } from "rxjs/operators";
import { of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  signAction,
  signFailureAction,
  signSuccessAction,
} from "../actions/sign.action";
import { SignResponseInterface } from "../../types/SignResponse.interface";

@Injectable()
export class SignEffect {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  sign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signAction),
      switchMap((request: any) => {
        return this.authService.sign(request).pipe(
          map((signResponse: SignResponseInterface) => {
            return signSuccessAction({ signResponse });
          }),

          catchError((errorResponse: HttpErrorResponse) => {
            return of(signFailureAction(errorResponse.error));
          })
        );
      })
    )
  );

  redirectAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signSuccessAction),
        tap(() => {
          this.router.navigateByUrl("/");
        })
      ),
    { dispatch: false }
  );
}
