import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManagementGuard } from "./guards/management.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.default),
  },
  {
    path: "management",
    loadChildren: () =>
      import("./management/management.module").then((m) => m.default),
    canLoad: [ManagementGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ManagementGuard],
})
export class AppRoutingModule {}
