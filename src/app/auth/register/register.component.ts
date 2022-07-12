import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private fcmService: FcmService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      repassword: ['', [Validators.required, Validators.minLength(6)]]
      });
     
  }

  gotoLogin(){
    this.router.navigateByUrl('/login');
  }

  async submit(){
    console.log("submit form....");
    if(!this.registerForm.valid){
      await this.presentToast("All fields required");
      return;
    }
    if(this.registerForm.value.password !== this.registerForm.value.repassword){
      await this.presentToast("Password is different");
      return;
    }
    try {
      let response = await this.fcmService.registerByEmailAndPassword(this.registerForm.value.email,this.registerForm.value.password);
      await this.presentToast("Account was created. Please check your email to verify the account");
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
