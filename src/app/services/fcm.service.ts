import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';
import { DevicePushService } from './device-push.service';
import { FirebaseAnalytics } from '@awesome-cordova-plugins/firebase-analytics/ngx';
import { FirebaseAuthentication } from '@awesome-cordova-plugins/firebase-authentication/ngx';
const { PushNotifications } = Plugins;
 
@Injectable({
  providedIn: 'root'
})
export class FcmService {
 
  constructor(private router: Router,
    private devicePushService:DevicePushService, 
    private firebaseAnalytics: FirebaseAnalytics,
    private firebaseAuthentication: FirebaseAuthentication) { }
 
  initPush(uuid) {
    if (Capacitor.platform !== 'web') {
      this.registerPush(uuid);
    }
  }
  

  async analyticsLogEvent(event_name, params){
    try {
      await this.firebaseAnalytics.logEvent(event_name, params);
    } catch(e){
      console.error("analytics log error ",e);
    }
  }

  async analyticsSetCurrentScreen(screen_name){
    try {
      await this.firebaseAnalytics.setCurrentScreen(screen_name);
    } catch(e){
      console.error("analytics log error",e);
    }
  }

  async loginByEmailAndPassword(email:string,password:string){
    return await this.firebaseAuthentication.signInWithEmailAndPassword(email,password);
  }

  async resetPassword(email:string){
    await this.firebaseAuthentication.sendPasswordResetEmail(email);
  }

  async getCurrentUser() {
    try {
      let currentUser = await this.firebaseAuthentication.getCurrentUser();
      console.log(JSON.stringify(currentUser));
      if(currentUser && currentUser.uid)
        return currentUser;
      return null;
    } catch(error){
      console.log("error",error);
    }
    return null;
  }

  async logout(){
    try {
      await this.firebaseAuthentication.signOut();
      return true;
    } catch(error){
      console.log(error);
      return false;
    }
  }

  async registerByEmailAndPassword(email:string, password:string){
    let response = await this.firebaseAuthentication.createUserWithEmailAndPassword(email,password);
    await this.firebaseAuthentication.sendEmailVerification();
    return response;
  }

  private registerPush(uuid) {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        console.log("registerPush granted");
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
 
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log("pushRegistration token=",token.value);
        /*this.devicePushService.updateByDevice(uuid,token.value).subscribe(updated => {
            console.log("PushNotificationToken.tokenGenerated")
        }, error => {
           if(error.error){
               this.devicePushService.create(uuid,token.value).subscribe();
           }
        });*/
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('PushNotifications.registrationError: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
       (notification: PushNotification) => {
        console.log('pushNotificationReceived: ',JSON.stringify(notification));
      }
    );
 
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
        //const data = notification.notification.data;
        console.log('Action performed: ', JSON.stringify(notification));
        /*if (data.detailsId) {
          this.router.navigateByUrl(`/notification/${data.detailsId}`);
        }*/
      }
    );
  }
}