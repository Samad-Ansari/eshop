import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService, User } from '@bluebits/users';
import { Location } from '@angular/common';
import { timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {MessageService} from 'primeng/api';
import * as countriesLib from 'i18n-iso-countries';
declare const require: any;

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnDestroy {

  form: any;
  isSubmitted = false;
  editmode = false;
  currentUserId: string = '';
  countries: any = [];
  endswith$: Subject<any> = new Subject;

  constructor(
    private messageService: MessageService, 
    private formBuilder: FormBuilder, 
    private usersService: UsersService,
    private location: Location,
    private route: ActivatedRoute
    ) { 
  }

  ngOnInit(): void {
  	this.form = this.formBuilder.group({
  		name: ['', Validators.required],
  		password: [''],
  		phone: ['', Validators.required],
  		email: ['', [Validators.required, Validators.email]],
  		isAdmin: [false],
  		street: [''],
  		apartment: [''],
  		zip: [''],
  		city: [''],
  		country: ['']
  	})
  	this._getCountries();
    this._checkEditMode();
  }

  ngOnDestroy() {
    this.endswith$.next(null);
    this.endswith$.complete();
  }

  private _getCountries(){
	countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
	this.countries = Object.entries(countriesLib.getNames("en", {select: "official"})).map(
		(entry) => {
			return {
				id: entry[0],
				name: entry[1]
			}
		}
	)
  }

  private _checkEditMode(){
    this.route.params.pipe(takeUntil(this.endswith$)).subscribe( (params: any) => {
      if(params.id) {
        this.editmode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe(user =>{
          this.userForm.name.setValue(user.name);
          this.userForm.email.setValue(user.email);
          this.userForm.isAdmin.setValue(user.isAdmin);
          this.userForm.street.setValue(user.street);
          this.userForm.apartment.setValue(user.apartment);
          this.userForm.phone.setValue(user.phone);
          this.userForm.zip.setValue(user.zip);
          this.userForm.city.setValue(user.city);
          this.userForm.country.setValue(user.country);
          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        })
      }
    })
  }

  get userForm() {
    return this.form.controls;
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }
    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      password: this.userForm.name.value,
  	  phone: this.userForm.phone.value,
  	  email: this.userForm.email.value,
  	  isAdmin: this.userForm.isAdmin.value,
  	  street: this.userForm.street.value,
  	  apartment: this.userForm.apartment.value,
  	  zip: this.userForm.zip.value,
  	  city: this.userForm.city.value,
  	  country: this.userForm.country.value,
    }
    if(this.editmode){
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  }

  onCancel(){
    this.location.back();
  }

  private _addUser(user: User){
  	this.usersService.createUser(user).pipe(takeUntil(this.endswith$)).subscribe(
      (user: User) => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`User ${user.name} is Created`
      });
      timer(1000).toPromise().then( () => {
        this.location.back();
      })
    }, 
    () => {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'User is not Created'
     });
    });

  }

  private _updateUser(user: User){
    this.usersService.updateUser(user).pipe(takeUntil(this.endswith$)).subscribe(() => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'User is Updated'
      });
      timer(1000).toPromise().then( done => {
        this.location.back();
      })
    }, 
    () => {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'User is not Updated'});
    });

  }

  
}
