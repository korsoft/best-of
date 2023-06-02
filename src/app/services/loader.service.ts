import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    public loadingController: LoadingController
  ) { }

  // This will show then autohide the loader
  showHideAutoLoader() {

    this.loadingController.create({
      message: 'This Loader Will Auto Hide in 2 Seconds',
      duration: 2000,
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });

  }

  // Show the loader for infinite time
  async showLoader() {

    try {
      let res = await this.loadingController.create({
        message: ''
      });
      await res.present();
    } catch(err){
      console.log(err);
    }
  }

  // Hide the loader if already created otherwise return error
  async hideLoader() {

    try {
      await this.loadingController.dismiss();
    } catch(err){
      console.log(err);
    }

  }


  async showSpeechVoice() {

    let res = await this.loadingController.create({
      message: "I'm listening...",
      backdropDismiss:true
    });
    await res.present();
    return res;
  }

  async hideSpeechVoice() {

    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });

  }


}