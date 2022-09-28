import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, provideRoutes } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../services/loader.service';
import { BusinessService } from '../services/business.service';
import { BookmarkService } from '../services/bookmark.service';
import { DeviceService } from '../services/device.service';
import { BusinessPropertiesService } from '../services/business-properties.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Plugins } from '@capacitor/core';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { FcmService } from '../services/fcm.service';
import { SettingsService } from '../services/settings.service';

const { Browser } = Plugins;



@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss'],
})
export class BusinessDetailComponent implements OnInit {
  id:string;
  public bus:any={
  	"qpId":0,"listing_id":"","location":"","category":"","sort_order":"","status":"","Name":"","summary":"",
  	"body":"","address_label":"","address":"","latitude":"","longitude":"","call_label":"","call":"","other_info_label":"","other_info":"",
  	"body_image":""};
  public latitude:number;
  public longitude:number;
  public properties:Array<any>;
  public bookmark:any;
  public device:any;
  public location:any;
  public isRestaurant:boolean = false;
  public is_classifieds:any = null;
  public sponsoredLabel:string = '';

  public PROPERTY_TYPE = {
    "33338836": "facebook",
    "33338837": "instagram",
    "33338838": "twitter",
    "33338839": "youtube",
    "33338840": "pinterest",
    "33338841": "url",
    "33338842": "email",
    "33338843": "phone"
  };

  constructor(private activatedRoute: ActivatedRoute,
     private storage: Storage,
     private router: Router,
     private ionLoader: LoaderService,
     private businessService: BusinessService,
     private businessPropertiesService: BusinessPropertiesService,
     private bookmarkService:BookmarkService,
     private deviceService:DeviceService,
     public toastController: ToastController,
     private callNumber: CallNumber,
     private socialSharing: SocialSharing,
     private geolocation: Geolocation,
     private launchNavigator: LaunchNavigator,
     private clipboard: Clipboard,
     private emailComposer: EmailComposer,
     private fcmService: FcmService,
     private settingsService : SettingsService) { }

  async ngOnInit() {

    let currentUser = await this.fcmService.getCurrentUser();

    await this.fcmService.analyticsLogEvent("screen_view",{
      page: "business_details"
    });

    await this.fcmService.analyticsSetCurrentScreen("Business Details");

    this.sponsoredLabel = await this.settingsService.getValue(this.settingsService.SPONSORED_LABEL);
    console.log("sponsoredLabel",this.sponsoredLabel);

  	this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.is_classifieds = this.activatedRoute.snapshot.queryParamMap.get('is_classifieds') ?? '0';

   
   await this.ionLoader.showLoader();
   
   this.device = await this.deviceService.getDevice();

   console.log("device",this.device);

   this.storage.get("location").then((loc)=>{ 
     console.log("location",loc);
     this.location = loc;
   });

   this.businessService.getBusinessById(this.id,this.device.uuid).subscribe((data:any)=>{
      if(data){
        console.log("business details",data);
        this.bus=data;
        this.fcmService.analyticsLogEvent("screen_action",{
          page: "business_details",
          action:'view_details',
          business: data.Name
        });
        if(this.bus.latitude &&  this.bus.longitude &&
          this.bus.latitude !="0" &&  this.bus.longitude!="0"){
            this.bus.showMap=true;
           this.latitude = parseFloat(this.bus.latitude);
           this.longitude = parseFloat(this.bus.longitude);
        }else{
          this.bus.showMap=false;
        }
        if(this.bus.call){
          this.bus.showCall=true;
          
        }else{
          this.bus.showCall=false;
        }
       
        this.businessPropertiesService.getBusinessPropertiesByBusiness(this.bus.qpId).subscribe((props:Array<any>)=>{
          console.log("props",props);
          let propArray=props.filter((p)=>{
             return (p.label!=null && p.label!=="" && p.property!=="Facebook" && p.property!=="Instagram");
          });
          for(let i=1;i<=8;i++){
            let mediaLink = `Media_Link_${i}`;
            let mediaLinkType = `Media_Link_${i}_Type`;
            let mediaLinkLabel = `Media_Link_${i}_Label`;
            if(this.bus[mediaLink] && this.bus[mediaLinkType] && this.bus[mediaLinkLabel]){
                propArray.push({
                    "label":this.bus[mediaLinkLabel],
                    "listing_id":0,
                    "position":99,
                    "property": this.PROPERTY_TYPE[this.bus[mediaLinkType]],
                    "qpId": 0,
                    "value":this.bus[mediaLink]
                });
            }
          }
          for(let i=0;i<propArray.length;i++){
            let p = propArray[i];
            if(p.property.toLowerCase()==='menu')
              p.position = 1;
            else if(p.property.toLowerCase()==='url')
              p.position = 2;
            else if(p.property.toLowerCase()==='reservations')
              p.position = 3;
            else if(p.property.toLowerCase()==='appointment')
              p.position = 4;
            else if(p.property.toLowerCase()==='takeout/delivery')
              p.position = 5;
            else if(p.property.toLowerCase()==='email')
              p.position = 6;
            else
              p.position = 99;
          
        }
        propArray.sort(function(a,b){
            if(a.position>b.position)
              return 1;
            else if(b.position>a.position)
              return -1;
            else
              return 0;
          });

          this.properties = propArray;
          
          console.log("business properties",this.properties);
          if(currentUser != null && currentUser.uid){
            this.bookmarkService.getBookMark(currentUser.uid,this.bus.qpId).subscribe((bookmark:Array<any>)=>{
              if(bookmark.length){
                this.bookmark = bookmark[0];
              }else{
                this.bookmark = null;
              }
            });
          }
          this.ionLoader.hideLoader();
        });
        
      }else{
        this.presentToast("No data for business");
        this.ionLoader.hideLoader();
      }
   });
              

  }

  async doRefresh(event) {
    console.log('Begin async operation');

    await this.ngOnInit();
    event.target.complete();
    
  }

  public getPropertyIcon(property){
    if(property.toLowerCase()==='appointment')
      return 'checkbox';
    else if(property.toLowerCase()==='takeout/delivery')
      return 'basket';
    else if(property.toLowerCase()==='menu')
      return 'restaurant';
    else if(property.toLowerCase()==='reservations')
      return 'calendar';
    else if(property.toLowerCase()==='url')
      return 'aperture';
    else if(property.toLowerCase()==='email')
      return 'mail';
    else if(property.toLowerCase()==='phone')
      return 'call';
    else if(property.toLowerCase()==='facebook')
      return 'logo-facebook';
    else if(property.toLowerCase()==='instagram')
      return 'logo-instagram';
    else if(property.toLowerCase()==='twitter')
      return 'logo-twitter';
    else if(property.toLowerCase()==='youtube')
      return 'logo-youtube';
  }

  public call(bus){
    this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_details",
      action:'call',
      business: bus.Name
    });
    this.callNumber.callNumber(bus.call, true);
  }

  public share(bus){
    this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_details",
      action:'share',
      business: bus.Name
    });
    this.socialSharing.share("Check out the Best Of app to find the best of everything in '"+this.location.Name+"'' https://bit.ly/3eNGWkH",
    "Hey, check out the Best Of");
    
  }

  public map(bus){
    this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_map",
      business: bus.Name
    });
    //this.router.navigateByUrl('/mapView',{state:{"business":bus}});
    this.openNavigator(null);
  }

  public copyAddress(bus){
    this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_details",
      action: "copy_address",
      business: bus.Name
    });
    console.log("copy address",bus.address);
    this.clipboard.copy(bus.address);
    this.presentToast("Address copied!");
  }

  public openNavigator(event){
    console.log("open navigator",event);
    this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_details",
      action:"open_navigator",
      business: this.bus.Name
    });
    this.geolocation.getCurrentPosition().then((resp) => {
      this.launchNavigator.navigate([this.latitude, this.longitude], {
        start:  ""+resp.coords.latitude+","+resp.coords.longitude
      });
     }).catch((error) => {
         console.log(error);
     });
  }

  async shareBusiness(){
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_details",
      action: "share",
      business: this.bus.Name
    });
    this.socialSharing.share(
      "Here's a great place I want you to check out",
      null,
      null, //this.bus.body_image,
      "https://bestoflocal.app.link/redirect?page=|businessDetail|"+this.bus.qpId);
  }

  async openShareExperienceLink(){
    Browser.open({ url: this.location.Share_Experience_Link });
  }

  	
  async propAction(prop){
   
    if(prop.property==="Email"){
      await this.fcmService.analyticsLogEvent("screen_action",{
        page: "business_details",
        action: "email",
        business: this.bus.Name
      });
      console.log("email...");
      // Check if sharing via email is supported
      this.emailComposer.getClients().then((apps: []) => {
        console.log("apps",JSON.stringify(apps));
        //if (apps.length>0) {
          let email = {
            to: prop.value,
            subject: prop.label,
            body: prop.label
          }
          
          // Send a text message using default options
          this.emailComposer.open(email).then(()=>{
            console.log("opening email client...");
          }).catch(er => console.log(JSON.stringify(er)));
       //}
       }).catch(e => {
         console.log(JSON.stringify(e));
       });

      /*this.socialSharing.canShareViaEmail().then(() => {
        this.socialSharing.shareViaEmail(prop.label,prop.label,["augusto.moguel@gmail.com"]).then(()=>{
          console.log("share email");
        }).catch((e)=>{
          console.log(JSON.stringify(e));
        });
      }).catch((e) => {
        console.log(JSON.stringify(e));
      });*/
      
    }else if(prop.property==="Phone"){
      this.callNumber.callNumber(prop.value, true);
    } else if(prop.property==="Facebook"){
      await this.fcmService.analyticsLogEvent("screen_action",{
        page: "business_details",
        action: "facebook",
        business: this.bus.Name
      });
      Browser.open({ url: prop.value });
    } else if(prop.property==="Instagram"){
      await this.fcmService.analyticsLogEvent("screen_action",{
        page: "business_details",
        action: "instagram",
        business: this.bus.Name
      });
      Browser.open({ url: prop.value });
    } else { //URL, Menu, Reservations, Takeout/Delivery, Appointment
      await this.fcmService.analyticsLogEvent("screen_action",{
        page: "business_details",
        action: "open_url",
        business: this.bus.Name,
        url: prop.value
      });
      Browser.open({ url: prop.value });
    }
  }

  async openBusinessUrl(){
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "business_details",
      action: "open_url_logo",
      business: this.bus.Name
    });
    console.log("openBusinessUrl",this.bus);
    if(this.bus && this.bus.Business_Logo_URL && this.bus.Business_Logo_URL.length>0){
      Browser.open({ url: this.bus.Business_Logo_URL });
    }
  }

  public async toogleBookmark(){
     let currentUser = await this.fcmService.getCurrentUser();
     if(currentUser == null || !currentUser.uid){
       this.router.navigateByUrl('/login');
       return;
     }
     await this.ionLoader.showLoader();
    if(this.bookmark){
      await this.fcmService.analyticsLogEvent("screen_action",{
        page: "business_details",
        action: "remove_bookmark",
        business: this.bus.Name
      });
      this.bookmarkService.deleteBookmark(this.bookmark.qpId).subscribe((res)=>{
        this.bookmark=null;
        this.ionLoader.hideLoader();
      });

    }else{
      await this.fcmService.analyticsLogEvent("screen_action",{
        page: "business_details",
        action: "create_bookmark",
        business: this.bus.Name
      });
      
      this.bookmarkService.createBookmark(currentUser.uid,this.bus.qpId).subscribe((res)=>{
        this.bookmark=res;
        this.ionLoader.hideLoader();
      });
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
