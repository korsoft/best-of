import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent implements OnInit {

  deleteForm: FormGroup;

  constructor(
    private router: Router,
    private fcmService: FcmService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.deleteForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]]
      });
  }

  async submit(){
    console.log("submit form....");
    if(!this.deleteForm.valid){
      await this.presentToast("Email is required");
      return;
    }
    let currentUser = await this.fcmService.getCurrentUser();
    console.log("currentUser",JSON.stringify(currentUser));
    if(!currentUser || currentUser?.email.toLowerCase() !== this.deleteForm.value.email.toLowerCase()){
      await this.presentToast("Email wrong");
      return;
    }
    try {
      console.log("delete account....");
      await this.fcmService.deleteAccount();
      this.router.navigateByUrl('/home');
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
