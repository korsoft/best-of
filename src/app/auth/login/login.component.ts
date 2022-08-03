import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import '@cyril-colin/capacitor-google-auth';

import {  Plugins } from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fcmService: FcmService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private fb: Facebook,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]]
      });
  }

  gotoRegister(){
    this.router.navigateByUrl('/register');
  }

  gotoReset(){
    this.router.navigateByUrl('/resetPassword');
  }

  async loginByFacebook(){
    try {
      /*let response:FacebookLoginResponse = await this.fb.login(['email']);
      console.log("response facebook",JSON.stringify(response));*/
      let accessToken:string = null; 
      try {
        accessToken = await this.fb.getAccessToken();
      } catch(error2){
        console.log(error2);
      }
      if(!accessToken){
        try {
          let response:FacebookLoginResponse = await this.fb.login(['email']);
          if(response && response.authResponse){
            accessToken = response.authResponse.accessToken;
          }
        } catch(error3){
          console.log(error3);
        }
      }
      if(!accessToken){
        accessToken = await this.fb.getAccessToken();
      }
      console.log("accessToken",accessToken);
      if(accessToken){
        let responseAuth = await this.fcmService.loginByFacebook(accessToken);
        console.log(responseAuth);
        this.router.navigateByUrl('/favorites');
      }
    } catch(error){
      console.log(error);
      await this.presentToast(error);
    }
  }

  async loginByGoogle(){
    try {
        let googleUser = await Plugins.GoogleAuth.signIn();
        console.log(JSON.stringify(googleUser));
        let idToken = googleUser.authentication.idToken;
        let serverAuthCode = googleUser.serverAuthCode;
        console.log("idToken",idToken);
        if(idToken){
          let response = await this.fcmService.loginByGoogle(idToken, serverAuthCode);
          console.log(response);
          this.router.navigateByUrl('/favorites');
        }
      } catch(error){
        console.log(error);
      }
  }

  async submit(){
    console.log("submit form....");
    if(!this.loginForm.valid){
      await this.presentToast("All fields required");
      return;
    }
    try {
      await this.fcmService.loginByEmailAndPassword(this.loginForm.value.email,this.loginForm.value.password);
      this.router.navigateByUrl('/favorites');
    } catch(error){
      console.log(error);
      await this.presentToast(error);
    }
  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 5000
    });
    toast.present();
  }
}
