import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import * as countriesLib from 'i18n-iso-countries';
declare const require: any;


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiURLUser: string = environment.apiURL + 'users';

  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {
  	return this.http.get<User[]>(this.apiURLUser)
  }

  getUser(userId: string): Observable<User> {
  	return this.http.get<User>(`${this.apiURLUser}/${userId}`)
  }

  getCountries(): { id: string; name: string }[] {
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
  
    return  Object.entries(countriesLib.getNames("en", {select: "official"})).map(
      (entry) => {
        return {
          id: entry[0],
          name: entry[1]
        }
      }
    )

  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUser}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }
  
  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en');
  }

  createUser(user: User): Observable<User> {
  	return this.http.post<User>(
      this.apiURLUser, user);
  }

  deleteUser(userId: string): Observable<any> {
  	return this.http.delete<any>(`${this.apiURLUser}/${userId}`);
  }

  updateUser(user: User): Observable<User> {
  	return this.http.put<User>(`${this.apiURLUser}/${user.id}`, user);
  }


}
