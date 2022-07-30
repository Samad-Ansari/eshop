import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginFormGroup: any;
  isSubmitted = false;
  authError = false;
  authMessage = "Email or Password is wrong"
  constructor(
  	private localstorageService: LocalstorageService, 
  	private formBuilder: FormBuilder, 
  	private authService: AuthService,
  	private router: Router
  	) { }

  ngOnInit(): void {
  	this._initLoginForm();
  }

  get loginForm(){
  	return this.loginFormGroup.controls;
  }

  private _initLoginForm() {
  	this.loginFormGroup = this.formBuilder.group({
  		email: ['', [Validators.required, Validators.email]],
  		password: ['', Validators.required]
  	})
  }

  onSubmit(){
  	this.isSubmitted = true;
  	if(this.loginFormGroup.invalid) return;
  	const loginData = {
  		email: this.loginForm.email.value,
  		password: this.loginForm.password.value
  	}

  	this.authService.login(loginData.email, loginData.password).subscribe(
  	(user) => {
  		this.authError = false;
  		this.localstorageService.setToken(user.token);
  		this.router.navigate(['/']);
  	}, (error) => {
  		this.authError = true
  		if(error.status !== 400){
  			this.authMessage = "Error in the Server, please try again later !";
  		}
  	})
  }

}
