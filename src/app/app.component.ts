import { Component, OnInit } from '@angular/core';
import { Router , NavigationStart, NavigationEnd} from '@angular/router';

import { DeviceService } from './services/device.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './services/fcm.service';
import {  Plugins } from '@capacitor/core';



const { Device } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public devi="";
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'Home'
    },
    {
      title: 'Notifications',
      url: '/folder/Inbox',
      icon: 'notifications'
    },
    {
      title: 'Search',
      url: '/folder/Outbox',
      icon: 'search'
    },
    {
      title: 'Like',
      url: '/folder/Favorites',
      icon: 'thumbs-up'
    },
    {
      title: 'Share',
      url: '/folder/Archived',
      icon: 'share'
    }
  ];
  

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deviceService:DeviceService,
    private router: Router,
    private fcmService:FcmService

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    Device.getInfo().then((info) => {
      this.deviceService.createDevice(info).subscribe();
      this.fcmService.initPush(info.uuid);
    });

    this.router.events.subscribe((event) => {
      
       if(event instanceof NavigationEnd) {
          if(event.url && event.url.startsWith("/home")) {
            this.appPages[0].url = decodeURIComponent(event.url);      
          }    
       }
     })
    });

  }

  ngOnInit() {
   
  
  }


}
