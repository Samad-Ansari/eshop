// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { User } from '../models/user';
// import { Observable } from 'rxjs';
// import { environment } from '@env/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {
//   apiURLUser: string = environment.apiURL + 'users';

//   constructor(private http: HttpClient) { }


//   getUsers(): Observable<User[]> {
//   	return this.http.get<User[]>(this.apiURLUser)
//   }

//   getUser(userId: string): Observable<User> {
//   	return this.http.get<User>(`${this.apiURLUser}/${userId}`)
//   }

//   createUser(user: User): Observable<User> {
//   	return this.http.post<User>(
//       this.apiURLUser, user);
//   }

//   deleteUser(userId: string): Observable<any> {
//   	return this.http.delete<any>(`${this.apiURLUser}/${userId}`);
//   }

//   updateUser(user: User): Observable<User> {
//   	return this.http.put<User>(`${this.apiURLUser}/${user.id}`, user);
//   }


// }
