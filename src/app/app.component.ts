import { Component, OnInit } from '@angular/core';
import { Router , NavigationStart, NavigationEnd} from '@angular/router';

import { DeviceService } from './services/device.service';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//import { FcmService } from './services/fcm.service';
import {  Plugins } from '@capacitor/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';


const { Device } = Plugins;
const { Browser } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public devi="";
  public backUrl:String = 'home';
  private backUrlHistorical:Array<String> = [];



  public appPages = [
    {
      title: 'Home',
      url: '/home',
      action: (url,i) => {
        if(this.router.url!="/home"){
           this.selectedIndex = i;
           //this.storage.clear().then((val) => {
            this.router.navigateByUrl(url);
           //});
       }
      },
      icon: 'Home-outline'
    },
    /*{
      title: 'My Favorites',
      url: '/favorites',
      action: (url,i) => {
        this.selectedIndex = i;
        this.router.navigateByUrl(url);
      },
      icon: 'bookmark-outline'
    },*/
    {
      title: 'Select Location',
      url: '/select-location',
      action: (url,i) => {
        this.selectedIndex = i;
        this.router.navigateByUrl(url);
      },
      icon: 'location-outline'
    }, 
    {
      title: 'Search',
      url: '/search',
      action: (url,i) => {
        this.selectedIndex = i;
        this.router.navigateByUrl(url);
      },
      icon: 'search-outline'
    },
    
    {
      title: 'Chat',
      url:'',
      action: (url,i) => {
        this.getChatUrl();
      },
      icon: 'chatbubble-outline'
    },
    {
      title: 'Like',
      url: '',
      action: (url,i) => {
        this.socialSharing.shareViaFacebookWithPasteMessageHint("Check out the Best Of app to find the best of everything https://bestoflocal.net");
      },
      icon: 'thumbs-up-outline'
    },
     /*{
      title: 'Account',
      url: '/account',
      action: (url,i) => {

      },
      icon: 'person-outline'
    },*/
    {
      title: 'Tell a Friend ',
      url: '',
      action: (url,i) => {
        this.storage.get("location").then((loc)=>{ 
            this.socialSharing.share("Check out the Best Of app to find the best of everything in '"+loc.Name+"'' https://bit.ly/3eNGWkH",
           "Hey, check out the Best Of");
        });         
      },
      icon: 'share-outline'
    },
    {
      title: 'FAQs',
      url: '',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.net/faq/');
      },
      icon: 'thumbs-up-outline'
    },
    {
      title: 'About Us',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.net/about/');
      },
      icon: 'information-circle-outline'
    },
    {
      title: 'Legal',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.net/legal/');
      },
      icon: 'help-circle-outline'
    },
    {
      title: 'Advertise Your Business',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.net/advertise-your-business/');
      },
      icon: 'help-circle-outline'
    },
    {
      title: 'Join Our Team',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestofventures.com/join-our-team/');
      },
      icon: 'help-circle-outline'
    },
    /*{
      title: 'Become a Sponsor',
      url:'/become-of-sponsor',
      action: (url,i) => {
        this.selectedIndex = i;
        this.router.navigateByUrl(url);
      },
      icon: 'information-circle-outline'
    },
    {
      title: 'Notifications',
      url: '/notifications',
      action: (url,i) => {

      },
      icon: 'notifications-outline'
    },*/  
    
    
    
  ];

  public bottomPages = [
    {
      url:'',
      internalPage: false,
      isChatUrl: true,
      icon: 'custom-grey-chat'
    },
    {
      url:'/favorites',
      internalPage: true,
      icon: 'custom-grey-bookmark'
    },
    {
      url: '',
      internalPage: false,
      isInstagramUrl: true,
      icon: 'custom-grey-instagram'
    },
    {
      url:'/search',
      internalPage: true,
      icon: 'custom-grey-search'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deviceService:DeviceService,
    private router: Router,
    //private fcmService:FcmService,
    private socialSharing: SocialSharing,
    private storage: Storage,
    private menu: MenuController

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    
    Device.getInfo().then((info) => {
      this.deviceService.createDevice(info).subscribe();
      //this.fcmService.initPush(info.uuid);
    });

    this.router.events.subscribe((event) => {

      console.log("event",event);

      if(event instanceof NavigationStart){
        this.changePageSelected(event.url);
        if(!this.backUrlHistorical.includes(event.url)){
          this.backUrlHistorical.push(this.router.url);
        } else if(this.backUrlHistorical[this.backUrlHistorical.length-1] == event.url){
          this.backUrlHistorical.pop();
        }
      }

       if(event instanceof NavigationEnd) {
        
          if(event.url && event.url.startsWith("/home")) {
            if(event.url.includes("reload=true")){
              console.log("recovering the device again");
              Device.getInfo().then((info) => {
                console.log("device",info);
                this.deviceService.createDevice(info).subscribe();
                //this.fcmService.initPush(info.uuid);
              });
            }
            this.appPages[0].url = decodeURIComponent(event.url).replace("?reload=true","");
          }
       }
       
     })
    });

  }

   ngOnInit() {

  }

  openMenu(){
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  showBackButton(){
    return !this.router.url.includes("/home");
  }

  getBackUrl(){
    return this.backUrlHistorical[this.backUrlHistorical.length-1];
  }

  changePageSelected(newUrl){
    console.log("changePageSelected",newUrl);
    this.bottomPages.forEach((item)=>{
      item.icon = item.icon.replace('-sunburst-','-grey-');
    });
    let page =this.bottomPages.filter(item => newUrl.includes(item.url) && item.url != '');
    console.log("page",page);
    if(page && page.length>0)
      page[0].icon = page[0].icon.replace('-grey-','-sunburst-');
  }
  gotoPage(page){
    if(page.internalPage === true){
      this.router.navigateByUrl(page.url);
    } else if(page.isInstagramUrl === true){
      this.getInstagramUrl();
    } else if(page.isChatUrl === true){
      this.getChatUrl();
    }
  }

  async getInstagramUrl(){
    this.bottomPages.forEach((item)=>{
      item.icon = item.icon.replace('-sunburst-','-grey-');
    });
    let location = await this.storage.get('location');
    if(location){
      console.log("getInstagramUrl",location.Instagram_Url);
      if(location.Instagram_Url && location.Instagram_Url.length>3)
        Browser.open({ url: location.Instagram_Url })
    }
  }

  async getChatUrl(){
    this.bottomPages.forEach((item)=>{
      item.icon = item.icon.replace('-sunburst-','-grey-');
    });
    let location = await this.storage.get('location');
    if(location){
      console.log("getChatUrl",location.Chat_Url);
      if(location.Chat_Url && location.Chat_Url.length>3)
        Browser.open({ url: location.Chat_Url })
    }
  }

  async sendToExternalUrl(gotoUrl){
    Browser.open({ url: gotoUrl })
  }

}
