import { BackEndErrorInterface } from "./BackErrorInterface";
import { CurrentAppUserInterface } from "./CurrentAppUser.interface";
import { SignResponseInterface } from "./SignResponse.interface";

export interface AuthStateInterface {
  isSubmitting: boolean;
  currentAppUser: CurrentAppUserInterface | null;
  isLoggedIn: boolean | null;
  validationError: BackEndErrorInterface;
  accessToken: SignResponseInterface | null;
}
