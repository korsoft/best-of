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
 
const { PushNotifications } = Plugins;
 
@Injectable({
  providedIn: 'root'
})
export class FcmService {
 
  constructor(private router: Router,
  	private devicePushService:DevicePushService) { }
 
  initPush(uuid) {
    if (Capacitor.platform !== 'web') {
      this.registerPush(uuid);
    }
  }
 
  private registerPush(uuid) {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
 
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log(token.value);
        this.devicePushService.updateByDevice(uuid,token.value).subscribe(updated => {
            console.log("token generate");

        }, error => {
           console.log(error);
           if(error.error){
           	  this.devicePushService.create(uuid,token.value).subscribe(create => {
                    console.log("token create");

                }, error => {
                   console.log(error);                   
                });
           }
        });
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
 
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          this.router.navigateByUrl(`/notification/${data.detailsId}`);
        }
      }
    );
  }
}
