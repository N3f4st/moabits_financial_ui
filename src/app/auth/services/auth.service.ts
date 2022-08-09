import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CurrentAppUserInterface } from "../types/CurrentAppUser.interface";
import { RegisterRequestInterface } from "../types/RegisterRequest.interface";
import { SignRequestInterface } from "../types/SignRequest.interface";
import { SignResponseInterface } from "../types/SignResponse.interface";

@Injectable()
export class AuthService {
  apiUrl: String = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerAppUser(
    appUserPayload: RegisterRequestInterface
  ): Observable<CurrentAppUserInterface> {
    const registerUrl = `${this.apiUrl}/auth/register`;
    return this.http.post<CurrentAppUserInterface>(registerUrl, appUserPayload);
  }

  sign(signUser: SignRequestInterface): Observable<SignResponseInterface> {
    const signBody = this.formatDataForm(signUser);
    const signUrl = `${this.apiUrl}/auth/sign`;
    return this.http.post<SignResponseInterface>(signUrl, signBody);
  }

  formatDataForm(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value || value === false) formData.append(key, String(value));
    });
    return formData;
  }
}
