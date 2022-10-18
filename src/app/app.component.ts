import { Component, NgZone, OnInit } from '@angular/core';
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
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { SearchPage } from './pages/search/search.page';
import { FcmService } from './services/fcm.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';


const { Device } = Plugins;
const { Browser } = Plugins;
const { App } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public devi="";
  public backUrl:String = 'home';
  public appVersionNumber:String = '';
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
      icon: 'custom-location-map'
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
      title: 'Share the App',
      url: '',
      action: (url,i) => {
        this.shareTheApp(); 
      },
      icon: 'share-outline'
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
      title: 'Instagram',
      url:'',
      action: (url,i) => {
        this.getInstagramUrl();
      },
      icon: 'custom-white-instagram'
    },
    {
      title: 'Like',
      url: '',
      action: (url,i) => {
        this.socialSharing.shareViaFacebookWithPasteMessageHint("Check out the Best Of app to find the best of everything https://bestoflocal.app");
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
      title: 'List Your Business',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.app/advertise-your-business/');
      },
      icon: 'custom-megaphone'
    },
    {
      title: 'Join Our Team',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.app/join-our-team/');
      },
      icon: 'people-outline'
    },
    {
      title: 'FAQs',
      url: '',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.app/faq/');
      },
      icon: 'help-circle-outline'
    },
    {
      title: 'About Us',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.app/about/');
      },
      icon: 'information-circle-outline'
    },
    {
      title: 'Legal',
      url:'',
      action: (url,i) => {
        this.sendToExternalUrl('https://bestoflocal.app/legal/');
      },
      icon: 'custom-security-protection-shield'
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
      internalPage: false,
      isFavorites: true,
      icon: 'custom-grey-bookmark'
    },
    {
      url: '',
      internalPage: false,
      isShareTheApp: true,
      icon: 'share-outline'
    },
    {
      url:'/search',
      internalPage: true,
      icon: 'custom-grey-search'
    }
  ];

  public locationName:string = "";
  public isLogged:boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deviceService:DeviceService,
    private router: Router,
    private fcmService:FcmService,
    private socialSharing: SocialSharing,
    private storage: Storage,
    private menu: MenuController,
    private deeplinks: Deeplinks,
    private zone: NgZone,
    private appVersion : AppVersion
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {


     this.appVersion.getVersionNumber().then(version => {
      this.appVersionNumber = version;
      console.log("appVersion",this.appVersionNumber);
     }).catch(reason => {
      console.log("get app version error",reason);
     });
      App.addListener('appUrlOpen', (data: any) => {
        this.zone.run(() => {
            // Example url: https://beerswift.app/tabs/tab2
            // slug = /tabs/tab2

            //alert("match: " + JSON.stringify(data));
            //{"url":"https:\/\/bestoflocal.app.link\/redirect?page=%7CbusinessDetail%7C32194489","iosSourceApplication":"","iosOpenInPlace":""}
            const page = data.url.split("redirect?page=").pop();
            if(page){
                this.router.navigateByUrl(page.replace(/%7C/g, '/'));
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    });

      this.deeplinks.route({
        '/temp': '/temp'
      }).subscribe(match => {
        //alert("match: " + JSON.stringify(match));
        console.log('Successfully matched route', match);
      }, nomatch => {
        //alert("nomatch: " + JSON.stringify(nomatch));
        console.error('Got a deeplink that didn\'t match', nomatch);
        if(nomatch['$link']){
          let linkData = nomatch['$link'];
          if(linkData['extra'] && linkData['extra']['branch_data']){
            let branchData = JSON.parse(linkData['extra']['branch_data']);
            if(branchData['+alias'] && branchData['+alias'] == 'redirect' && branchData['page']){
              let page = branchData['page'];
              this.router.navigateByUrl(page.replace(/\|/g, '/'));
            }
          }
        }
      });

    this.statusBar.styleDefault();
    this.splashScreen.hide();

    
    
    Device.getInfo().then((info) => {
      console.log("device info",info)
      this.deviceService.createDevice(info).subscribe();
      //this.fcmService.initPush(info.uuid);
    });

    setTimeout(()=>{
      this.storage.get("location").then((location) => {
        console.log("location",location);
        if(location)
          this.locationName = location.Name;
      });
    },500);

    setTimeout(async ()=> {
      await this.checkUserLogged();
    },500);

   
    

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
            this.storage.get("location").then((location) => {
              if(location)
                this.locationName = location.Name;
            });
            this.appPages[0].url = decodeURIComponent(event.url).replace("?reload=true","");
          } 

          this.checkUserLogged();

       }
       
     })
    });

  }

   ngOnInit() {

  }


  async logout(){
    await this.fcmService.logout();
    this.isLogged = false;
    this.router.navigateByUrl('/home');
  }

  async deleteAccount(){
    this.router.navigateByUrl('/deleteAccount');
  }

  openMenu(){
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  showBackButton(){
    let canShow = !this.router.url.includes("/home") && !this.router.url.includes("/login")
                    && !this.router.url.includes("/register") && !this.router.url.includes("/reset");
    if(!canShow){
      this.clearBackUrls();
    }

    if(this.backUrlHistorical.includes('/login') || this.backUrlHistorical.includes('/register') || this.backUrlHistorical.includes('/reset')){
      canShow = false;
      this.clearBackUrls();
    }

    return canShow;
  }

  getBackUrl(){
    return this.backUrlHistorical[this.backUrlHistorical.length-1];
  }

  clearBackUrls(){
    this.backUrlHistorical = [];
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
  async gotoPage(page){
    if(page.internalPage === true){
      this.router.navigateByUrl(page.url);
    } else if(page.isShareTheApp === true){
      this.shareTheApp();
    } else if(page.isChatUrl === true){
      this.getChatUrl();
    } else if(page.isFavorites === true){
      let currentUser = await this.fcmService.getCurrentUser();

      if(!currentUser){
        this.router.navigateByUrl('/login');
        return;
      }
      this.router.navigateByUrl('/favorites');
    }
  }

  async getInstagramUrl(){
    /*this.bottomPages.forEach((item)=>{
      item.icon = item.icon.replace('-sunburst-','-grey-');
    });*/
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "home",
      action: "open_instagram"
    });
    let location = await this.storage.get('location');
    if(location){
      console.log("getInstagramUrl",location.Instagram_Url);
      if(location.Instagram_Url && location.Instagram_Url.length>3)
        Browser.open({ url: location.Instagram_Url })
    }
  }

  async checkUserLogged(){
    let currentUser = await this.fcmService.getCurrentUser();
    console.log("currentUser",currentUser);
    this.isLogged = currentUser !== null && currentUser.uid;
  }

  async getChatUrl(){
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "home",
      action: "open_chat"
    });
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

  async shareTheApp(){
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "home",
      action: "share_app"
    });
    this.storage.get("location").then((loc)=>{ 
      this.socialSharing.share("Hey, check out The BEST OF LOCAL app. It's the coolest, easiest way to find the best restaurants and more. Here's the download. https://bit.ly/3eNGWkH");
  });   
  }

  async sendToExternalUrl(gotoUrl){
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "home",
      action: "open_external_url",
      url: gotoUrl
    });
    Browser.open({ url: gotoUrl })
  }

}
