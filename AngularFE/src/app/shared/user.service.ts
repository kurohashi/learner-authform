import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    fullName: '',
    email: '',
    password: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  //HttpMethods

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl+'/open/v1/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/open/v1/authenticate', authCredentials,this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/v1/userProfile');
  }


  //Helper Methods

  setAuth(res: object) {
    localStorage.setItem('token', res["data"]["token"]);
    localStorage.setItem('email', res["data"]["email"]);
  }

  getAuth(key) {
    return localStorage.getItem(key);
  }

  deleteAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  isLoggedIn(callback) {
    this.getUserProfile().subscribe(
      res => {
        if (res && res["statusCode"] == 200)
          return callback();
        callback("not logged in");
      },
      err => { 
        callback("not logged in");
      }
    );
  }
}
