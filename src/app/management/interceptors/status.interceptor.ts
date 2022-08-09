import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { PersistanceService } from "src/app/services/persistance.service";
import { NzNotificationService } from "ng-zorro-antd/notification";

@Injectable()
export class StatusInterceptor implements HttpInterceptor {
  constructor(
    private persistanceService: PersistanceService,
    private notify: NzNotificationService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          this.persistanceService.clear();
          location.reload();
          this.notify.create(
            "warning",
            "Session expired",
            "The session has expired due to security."
          );
        }
        return throwError(error);
      })
    );
  }
}
