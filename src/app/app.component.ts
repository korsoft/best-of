import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Router , NavigationStart, NavigationEnd} from '@angular/router';

import { DeviceService } from './services/device.service';

import { AlertController, MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
//import { FcmService } from './services/fcm.service';
import {  AppState, Plugins } from '@capacitor/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { SearchPage } from './pages/search/search.page';
import { FcmService } from './services/fcm.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { DeviceSettingsService } from './services/device-settings.service';
import { DataSettingsService } from './services/data-settings.service';
import { BranchService } from './services/branch.service';


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
        console.log("CURRENTURLT: " + this.router.url);
        console.log("URLT: " + url);
        const currentUrl = decodeURIComponent(this.router.url).replace('?reload=true','');
        if(currentUrl == url){
          this.storage.clear().then((val) => {
            this.router.navigateByUrl('/home?reload=true');
           });
        } else if(this.router.url!="/home"){
          console.log("url intro");
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
    private deviceSettingsService:DeviceSettingsService,
    private dataSettingsService:DataSettingsService,
    private router: Router,
    private fcmService:FcmService,
    private socialSharing: SocialSharing,
    private storage: Storage,
    private menu: MenuController,
    private deeplinks: Deeplinks,
    private zone: NgZone,
    private appVersion : AppVersion,
    private alertController: AlertController,
    private toastController: ToastController,
    private branchService: BranchService
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
            if(data.url.includes("https://bestoflocal.app.link") || data.url.includes("https://bestoflocal-alternate.app.link")){
              console.log(data.url);
              const queryParams : any = this.getAllUrlParams(data.url);
              //const page = data.url.split("redirect?page=").pop();
              const page = queryParams.page;
              console.log("page",page);
              if(page){
                  this.router.navigateByUrl(page.replace(/%7C/g, '/').replace(/%7c/g, '/'));
              } else {
                const url = data.url.split('?')[0];
                console.log("url deeplink",url);
                //const urlEncoded = encodeURIComponent(url);
                //console.log("urlEnconded",urlEncoded);
                this.branchService.getDataFromDeeplink(url).subscribe((res:any) => {
                  console.log("res==>",JSON.stringify(res));
                  if(res.data && res.data['$deeplink_path']){
                    this.router.navigateByUrl(`/${res.data['$deeplink_path']}`);
                  }
                });
              }
            } 
            // If no match, do nothing - let regular routing
            // logic take over
        });
    });

    App.addListener('appStateChange', (state: AppState) => {
        if (state.isActive) {
          Device.getInfo().then((info) => {
            this.dataSettingsService.getDataSettings().toPromise().then((dataSettingsLst:any[]) => {
              if(dataSettingsLst != null && dataSettingsLst.length>0){
                let dataSettings:any = dataSettingsLst[0];
                this.deviceSettingsService.getDeviceByUUID(info.uuid).toPromise().then((deviceLst:any[]) => {
                  if(deviceLst != null && deviceLst.length > 0){
                    let deviceSettings:any = deviceLst[0];
                    deviceSettings.appVersion = info.appVersion;
                    if(deviceSettings.appVersion != dataSettings.appVersion){
                      this.presentToast();
                    }
                    let reloadData = deviceSettings.dataVersion != dataSettings.dataVersion;
                    if(reloadData){
                      deviceSettings.dataVersion = dataSettings.dataVersion;
                    }
                    console.log("deviceLst",deviceLst);
                    this.deviceSettingsService.updateDevice(deviceSettings).toPromise().then((res) => {
                      if(reloadData){
                        this.storage.get("location").then((location)=>{
                          this.storage.clear().then((val) => {
                            this.storage.set("location",location);
                            this.router.navigateByUrl('/home/'+location.Name+'?reload=true');
                          });
                        });
                      }
                    });
                  } else {
                    const deviceSettings = {
                      uuid: info.uuid,
                      appVersion: info.appVersion,
                      dataVersion: dataSettings.dataVersion
                    }
                    this.deviceSettingsService.createDevice(deviceSettings).toPromise().then((res) => {
                      this.storage.get("location").then((location)=>{
                        this.storage.clear().then((val) => {
                          this.storage.set("location",location);
                          this.router.navigateByUrl('/home/'+location.Name+'?reload=true');
                        });
                      });
                    });
                  }
                });
              }
            });
          });
        } 
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
    /*const alert = await this.alertController.create({
      header: 'Delete your Account',
      cssClass: 'my-alert-class',
      message: 'Are you sure you want to delete all of your saved favorites?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm No Delete Account');
          },
        },
        {
          text: 'Yes',
          handler: async () => {
            console.log('Confirm Delete Account');
            let currentUser = await this.fcmService.getCurrentUser();
            console.log("currentUser",JSON.stringify(currentUser));
            try {
              console.log("delete account....");
              await this.fcmService.deleteAccount();
              await this.showMessage("Account deleted");
              this.isLogged = false;
              this.router.navigateByUrl('/home');
            } catch(error){
              console.log(error);
              await this.showMessage(error);
            }
          },
        },
      ],
    });

    await alert.present();  */
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
    const currentUrl = this.router.routerState?.snapshot?.url;
    console.log("currentUrl",currentUrl);
    if(currentUrl.includes("/businessDetail/")){
      this.branchService.shareBusinessEmit();
      return;
    }
    if(currentUrl.includes('/folder/') && !currentUrl.includes('classified_category')){
      this.branchService.shareSubCategoryEmit();
      return;
    }
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "home",
      action: "share_app"
    });
    this.storage.get("location").then((loc)=>{ 
      this.socialSharing.share("Hey, check out The BEST OF LOCAL app. It's the coolest, easiest way to find the best restaurants and more. Here's the download. https://bestoflocal.app.link");
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

  async showMessage(message:string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 5000
    });
    toast.present();
  }

  async presentToast() {
    let currentTime = new Date().getTime();
    let lastTime = await this.storage.get('lastRememberUpdateApp');
    console.log("currentTime: " + currentTime + " lastTime: " + lastTime);
    if(currentTime > lastTime){
      let currentTimePlusOneHour = new Date(currentTime + (1 * 60 * 60 * 1000)); //increase an hour
      await this.storage.set("lastRememberUpdateApp",currentTimePlusOneHour.getTime());
      const alert = await this.alertController.create({
        cssClass: 'my-alert-class',
        header: 'APP UPDATE REQUIRED',
        message: 'New content, better performance. Download the latest version of Best Of Local now.',
        buttons: [
          {
            text: 'Close',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm close');
            },
          },
          {
            text: 'Update',
            cssClass: 'primary',
            handler: () => {
              console.log('Confirm Okay');
              if(this.platform.is('ios')){
                Browser.open({ url: 'https://apps.apple.com/mx/app/best-of-local/id1537019225' });
              } else {
                Browser.open({ url: 'https://play.google.com/store/apps/details?id=bestofventures.app.bestoflocal' });
              }
            },
          },
        ],
      });

      await alert.present();
    }
  }

  private getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
  
        // (optional) keep case consistent
        //paramName = paramName.toLowerCase();
        //if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
  
        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
  
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
  
          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string'){
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }
  
    return obj;
  }

}
