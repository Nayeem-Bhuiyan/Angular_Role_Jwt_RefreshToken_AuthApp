import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError, catchError } from "rxjs";
import { TokenStorageService } from "../services/token-storage.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private tokenService:TokenStorageService, private router:Router){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (req.headers.get("No-Auth") === 'True') {
            return next.handle(req.clone())
        }
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        const token = this.tokenService.getToken();

        req = this.addToken(req, token);
        return next.handle(req).pipe(
            catchError(
                (error:HttpErrorResponse) => {
                    console.log(error.status);
                if (error.status === 401) {
                    this.router.navigate(['/login'])
                } 
                else if(error.status === 403){
                    this.router.navigate(['/forbidden'])
                }
                return throwError(() => "Something is wrong")   
            })
        )
    }

    private addToken(request:HttpRequest<any>, token:string){
        return request.clone(
            {
                setHeaders: { Authorization : `Bearer ${token}` }
            }
        )
    }

}