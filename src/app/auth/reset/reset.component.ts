import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
   private router: Router,
    private fcmService: FcmService,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]]
      });
  }

  gotoLogin(){
    this.router.navigateByUrl('/login');
  }

  async submit(){
    console.log("submit form....");
    if(!this.resetForm.valid){
      await this.presentToast("Email is required");
      return;
    }
    try {
      await this.fcmService.resetPassword(this.resetForm.value.email);
      this.presentToast("Email sent.Please check your inbox");
      this.router.navigateByUrl('/login');
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
