import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../Services/auth.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fgrp: FormGroup;
  msg: Promise<string | void>;
  constructor(
    public auth: AuthService
  ) {
    this.fgrp = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
   }

  ngOnInit() {
  }

  get username() {
    return this.fgrp.get('login');
  }

  get password() {
    return this.fgrp.get('password');
  }

  logIn() {
    this.msg = this.auth.signInWithEmailAndPass(this.username.value, this.password.value);
  }

}
