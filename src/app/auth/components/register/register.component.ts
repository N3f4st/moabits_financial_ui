import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Observable, Subscription } from "rxjs";
import { AppStateInterface } from "src/app/shared/types/AppState.interface";
import { registerAction } from "../../store/actions/register.action";
import {
  isSubmittingSelector,
  validationErrorSelector,
} from "../../store/selectors";
import { BackEndErrorInterface } from "../../types/BackErrorInterface";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  moabitsLogo: string = "../../../../assets/moabitsLogo.png";
  isSubmitting$: Observable<boolean>;
  backEndError$: Observable<BackEndErrorInterface | null>;
  backenErrorSubscription: Subscription;
  signUpForm!: FormGroup;

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
    this.signUpForm = this.fb.group({
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
      checkPassword: ["", [Validators.required, this.confirmationValidator]],
      fullName: ["", [Validators.required]],
    });
  }

  initializeValues(): void {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector));
    this.backEndError$ = this.store.pipe(select(validationErrorSelector));
    this.backenErrorSubscription = this.backEndError$.subscribe((e: any) => {
      if (e != null && e === "Conflict") {
        this.signUpForm.controls["userName"].setValue("");
        this.notify.create(
          "error",
          "Register Error",
          "The user name is already taken.",
          { nzDuration: 6000 }
        );
        this.changeFormControlStatus(true);
      }
    });
  }

  submitForm(): void {
    if (this.signUpForm.valid) {
      this.changeFormControlStatus(false);
      this.store.dispatch(registerAction(this.signUpForm.value));
    } else {
      this.checkFormControlValidity();
    }
  }

  updateConfirmValidator(): void {
    this.signUpForm.controls["checkPassword"].updateValueAndValidity();
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls["password"].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  checkFormControlValidity = () => {
    Object.values(this.signUpForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  };

  changeFormControlStatus = (enabled: boolean) => {
    if (enabled) {
      this.signUpForm.controls["userName"].enable();
      this.signUpForm.controls["password"].enable();
      this.signUpForm.controls["checkPassword"].enable();
      this.signUpForm.controls["fullName"].enable();
    } else {
      this.signUpForm.controls["userName"].disable();
      this.signUpForm.controls["password"].disable();
      this.signUpForm.controls["checkPassword"].disable();
      this.signUpForm.controls["fullName"].disable();
    }
  };
}
