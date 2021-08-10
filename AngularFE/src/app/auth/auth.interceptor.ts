import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";

import { UserService } from "../shared/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private userService : UserService,private router : Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (req.headers.get('noauth'))
            return next.handle(req.clone());
        else {
            let headers = new HttpHeaders({
                "x-access-token": this.userService.getAuth("token"),
                "x-email": this.userService.getAuth("email")
            });
            let authReq = req.clone({ headers });
            return next.handle(authReq).pipe(
                tap(
                    event => { },
                    err => {
                        if (err.error.auth == false) {
                            this.router.navigateByUrl('/login');
                        }
                    })
            );
        }
    }
}