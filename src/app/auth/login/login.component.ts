import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';

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
    private fb: Facebook
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
      let response:FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
      console.log(response);
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
