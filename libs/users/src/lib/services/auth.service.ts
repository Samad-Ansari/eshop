import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import * as countriesLib from 'i18n-iso-countries';
import { LocalstorageService } from './localstorage.service'
declare const require: any;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURLUser: string = environment.apiURL + 'users';

  constructor(private router: Router, private http: HttpClient, private token: LocalstorageService) { }

  login(email: string, password: string) : Observable<User> {
    return this.http.post<User>(`${this.apiURLUser}/login`, {email, password})
  }

  logout() {
  	this.token.removeToken();
  	this.router.navigate(['/login'])
  }


}
