import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';



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
     private iab: InAppBrowser) { }

  async ngOnInit() {
  	this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
   await this.ionLoader.showLoader();
   this.device = await this.deviceService.getDevice();

   this.businessService.getBusinessById(this.id).subscribe((data)=>{
      if(data){
        this.bus=data;
        if(this.bus.latitude &&  this.bus.longitude &&
          this.bus.latitude !="0" &&  this.bus.longitude!="0"){
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
          this.properties=props;
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
    this.socialSharing.share("Test","Test");
  }

  public map(bus){
    this.router.navigateByUrl('/mapView',{state:{"business":bus}});
  }

  public propAction(prop){
    
    if(prop.property==="URL"){
       const browser = this.iab.create(prop.value);
    }else{
      this.socialSharing.shareViaEmail(prop.value,prop.value,[]);
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
