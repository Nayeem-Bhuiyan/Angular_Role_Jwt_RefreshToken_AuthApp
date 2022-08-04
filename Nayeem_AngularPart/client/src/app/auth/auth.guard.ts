import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { NotificationService } from "../services/notification.service";
import { TokenStorageService } from "../services/token-storage.service";


@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  public jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private tokenService: TokenStorageService
  ) {}
  async canActivate() {
    const token = this.tokenService.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    const isRefreshSuccess = await this.refreshingTokens(token);
    if (!isRefreshSuccess) {
      this.router.navigate(["login"]);
    }

    return isRefreshSuccess;
  }

  private async refreshingTokens(token: string | null): Promise<boolean> {
    const refreshToken: string | null =
      this.tokenService.getRefreshToken();

    if (!token || !refreshToken) {
      return false;
    }

    const tokenModel = JSON.stringify({
      accessToken: token,
      refreshToken: refreshToken,
    });

    let isRefreshSuccess: boolean;
    try {
      const response = await lastValueFrom(
        this.http.post(
          environment.baseUrl + "Authenticate/refresh-token",
          tokenModel
        )
      );
      const newToken = (<any>response).accessToken;
      const newRefreshToken = (<any>response).refreshToken;
      this.tokenService.saveToken(newToken);
      this.tokenService.saveRefreshToken(newRefreshToken);
      this.notificationService.showSuccess("Token renewed successfully", "Success");
      isRefreshSuccess = true;
    } catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }
}
