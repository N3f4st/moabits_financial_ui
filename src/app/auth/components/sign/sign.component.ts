import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { select, Store } from "@ngrx/store";
import { AppStateInterface } from "src/app/shared/types/AppState.interface";
import { signAction } from "../../store/actions/sign.action";
import {
  isSubmittingSelector,
  validationErrorSelector,
} from "../../store/selectors";
import { BackEndErrorInterface } from "../../types/BackErrorInterface";

@Component({
  selector: "app-sign",
  templateUrl: "./sign.component.html",
  styleUrls: ["./sign.component.scss"],
})
export class SignComponent implements OnInit, OnDestroy {
  finModulePath: string = "../../../../assets/finmodule.png";
  isSubmitting$: Observable<boolean>;
  backEndError$: Observable<BackEndErrorInterface | null>;
  backenErrorSubscription: Subscription;
  signForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notify: NzNotificationService,
    private store: Store<AppStateInterface>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeValues();
  }

  ngOnDestroy(): void {
    this.backenErrorSubscription.unsubscribe();
  }

  initializeForm(): void {
    this.notify.create(
      "success",
      "Sign",
      "Please, type your user name and password.",
      { nzDuration: 5000 }
    );
    this.signForm = this.fb.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  initializeValues(): void {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector));
    this.backEndError$ = this.store.pipe(select(validationErrorSelector));
    this.backenErrorSubscription = this.backEndError$.subscribe((e: any) => {
      if (e !== null) {
        this.signForm.controls["password"].setValue("");
        this.notify.create(
          "error",
          "Sign Error",
          "The user name or password does not exist.",
          { nzDuration: 5000 }
        );
        this.changeFormControlStatus(true);
      }
    });
  }

  checkFormControlValidity = () => {
    Object.values(this.signForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  };

  submitForm(): void {
    if (this.signForm.valid) {
      this.changeFormControlStatus(false);
      this.store.dispatch(signAction(this.signForm.value));
    }
  }

  changeFormControlStatus = (enabled: boolean) => {
    if (enabled) {
      this.signForm.controls["userName"].enable();
      this.signForm.controls["password"].enable();
    } else {
      this.signForm.controls["userName"].disable();
      this.signForm.controls["password"].disable();
    }
  };
}
