import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route,
} from "@angular/router";
import { PersistanceService } from "../services/persistance.service";

@Injectable()
export class ManagementGuard implements CanLoad, CanActivate {
  constructor(
    private router: Router,
    private persistanceService: PersistanceService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkForToGrantTokenAcceess();
  }

  canLoad(route: Route): boolean {
    // Here we can set authorization polices like roles to prevent access.
    return this.checkForToGrantTokenAcceess();
  }

  checkForToGrantTokenAcceess(): boolean {
    const currCredentials = this.persistanceService.get("accessToken");
    if (currCredentials != null) {
      return true;
    }

    this.router.navigate(["/auth/sign"]);
    return false;
  }
}
