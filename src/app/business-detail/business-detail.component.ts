import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Plugins } from '@capacitor/core';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

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
     private clipboard: Clipboard) { }

  async ngOnInit() {
  	this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
   await this.ionLoader.showLoader();
   
   this.device = await this.deviceService.getDevice();

   console.log("device",this.device);

   this.storage.get("location").then((loc)=>{ 
     console.log("location",loc);
     this.location = loc;
   });

   this.businessService.getBusinessById(this.id,this.device.uuid).subscribe((data)=>{
      if(data){
        console.log("business details",data);
        this.bus=data;
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
          this.properties=props.filter((p)=>{
             return (p.label!=null && p.label!=="");
          });
          console.log("business properties",this.properties);
          if(this.device)
            this.bookmarkService.getBookMark(this.device.uuid,this.bus.qpId).subscribe((bookmark:Array<any>)=>{
              if(bookmark.length){
                this.bookmark = bookmark[0];
              }else{
                this.bookmark = null;
              }
            });
          this.ionLoader.hideLoader();
        });
        
      }else{
        this.presentToast("No data for business");
        this.ionLoader.hideLoader();
      }
   });
              

  }


  public call(bus){
    this.callNumber.callNumber(bus.call, true);
  }

  public share(bus){
    
    this.socialSharing.share("Check out the Best Of app to find the best of everything in '"+this.location.Name+"'' https://bit.ly/3eNGWkH",
    "Hey, check out the Best Of");
    
  }

  public map(bus){
    //this.router.navigateByUrl('/mapView',{state:{"business":bus}});
    this.openNavigator(null);
  }

  public copyAddress(bus){
    console.log("copy address",bus.address);
    this.clipboard.copy(bus.address);
    this.presentToast("Address copied!");
  }

  public openNavigator(event){
    console.log("open navigator",event);
    this.geolocation.getCurrentPosition().then((resp) => {
      this.launchNavigator.navigate([this.latitude, this.longitude], {
        start:  ""+resp.coords.latitude+","+resp.coords.longitude
      });
     }).catch((error) => {
         console.log(error);
     });
  }

  async shareBusiness(){
    this.socialSharing.share(
      "Here's a great place I want you to check out",
      null,
      this.bus.body_image,
      "https://bestoflocal.app.link/redirect?page=|businessDetail|"+this.bus.qpId);
  }

  async openShareExperienceLink(){
    Browser.open({ url: this.location.Share_Experience_Link });
  }

  	
  async propAction(prop){
    
    if(prop.property==="URL"){
      Browser.open({ url: prop.value });
    }else if(prop.property==="Email"){
      this.socialSharing.shareViaEmail(prop.value,prop.value,[]);
    }else if(prop.property==="Phone"){
      this.callNumber.callNumber(prop.value, true);
    } else if(prop.property==="Facebook"){
      Browser.open({ url: prop.value });
    } else if(prop.property==="Instagram"){
      Browser.open({ url: prop.value });
    }
  }

  async openBusinessUrl(){
    console.log("openBusinessUrl",this.bus);
    if(this.bus && this.bus.Business_Logo_URL && this.bus.Business_Logo_URL.length>0){
      Browser.open({ url: this.bus.Business_Logo_URL });
    }
  }

  public async toogleBookmark(){
     await this.ionLoader.showLoader();
    if(this.bookmark){
      this.bookmarkService.deleteBookmark(this.bookmark.qpId).subscribe((res)=>{
        this.bookmark=null;
        this.ionLoader.hideLoader();
      });

    }else{
      this.bookmarkService.createBookmark(this.device.uuid,this.bus.qpId).subscribe((res)=>{
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
