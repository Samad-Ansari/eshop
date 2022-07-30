import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService, User } from '@bluebits/users';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [],
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  endswith$ : Subject<any> = new Subject();
  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this._getUsers()
  	
  }

  ngOnDestroy(){
    this.endswith$.next(null);
    this.endswith$.complete();
  }

  deleteUser(userId: string){
    this.confirmationService.confirm({
            message: 'Do you want to Delete this User?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.usersService.deleteUser(userId).pipe(takeUntil(this.endswith$)).subscribe((user: User) => {
                this._getUsers();
                this.messageService.add({
                  severity:'success', 
                  summary:'Success', 
                  detail:`User ${user.name} is Deleted`
                });
              }, 
              () => {
                this.messageService.add({
                  severity:'error', 
                  summary:'Error', 
                  detail:'User is not Deleted'
                });
              })
            },
            reject: () => {}
        });
  }

  getCountryName(countryKey: string) {
    if (countryKey) 
      return this.usersService.getCountry(countryKey);
    else return '';
  }

  updateUser(userId: string){
    this.router.navigateByUrl(`users/form/${userId}`);
  }

  private _getUsers() {
   this.usersService.getUsers().pipe(takeUntil(this.endswith$)).subscribe(users => {
      this.users = users;
    }) 
  }
}
