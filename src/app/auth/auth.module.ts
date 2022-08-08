import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { RegisterComponent } from "./components/register/register.component";
import { SignComponent } from "./components/sign/sign.component";
import { AuthService } from "./services/auth.service";

import { StoreModule } from "@ngrx/store";
import { reducers } from "./store/reducers";
import { EffectsModule } from "@ngrx/effects";
import { RegisterEffect } from "./store/effects/register.effect";
import { SignEffect } from "./store/effects/sign.effect";

import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzNotificationServiceModule } from "ng-zorro-antd/notification";

const routes: Routes = [
  { path: "register", component: RegisterComponent },
  { path: "sign", component: SignComponent },
];

@NgModule({
  declarations: [RegisterComponent, SignComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzTypographyModule,
    NzButtonModule,
    NzNotificationServiceModule,
    StoreModule.forFeature("auth", reducers),
    EffectsModule.forFeature([RegisterEffect, SignEffect]),
    RouterModule.forChild(routes),
  ],
  providers: [AuthService],
})
export class AuthModule {}
