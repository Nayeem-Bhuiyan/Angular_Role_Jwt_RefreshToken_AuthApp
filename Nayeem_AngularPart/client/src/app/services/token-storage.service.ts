import { Injectable } from "@angular/core";

const authAccessToken = "accessToken";
const authRefreshToken = "refreshToken";
const authUser = "auth-user";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(authAccessToken);
    window.sessionStorage.setItem(authAccessToken, token);

    const user = this.getUser();
    if (user.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(authAccessToken);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(authRefreshToken);
    window.sessionStorage.setItem(authRefreshToken, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(authRefreshToken);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(authUser);
    window.sessionStorage.setItem(authUser, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(authUser);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public setRoles(roles: []) {
    window.sessionStorage.setItem("roles", JSON.stringify(roles));
  }

  public getRoles(): [] {
      return JSON.parse(window.sessionStorage.getItem('roles'))
  }



  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

}

