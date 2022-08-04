import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiRootUrl =environment.baseUrl +'Authenticate/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(apiRootUrl+'login', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(apiRootUrl+'register', {
      username,
      email,
      password
    }, httpOptions);
  }

  refreshToken(token: string) {
    return this.http.post(apiRootUrl+'refreshtoken', {
      refreshToken: token
    }, httpOptions);
  }

  forgotPassword(email : string ){
    return this.http.post(apiRootUrl+'forgotPassword' , {email : email} , httpOptions );
  }

  resetPassword( newPassword : string , confirmedPassword : string , token : string){
    return this.http.post(apiRootUrl+'resetPassword?token='+token , {
      newPassword : newPassword ,
       confirmedPassword : confirmedPassword
      } , httpOptions );

  }
}
