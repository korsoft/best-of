import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../services/loader.service';
import { BusinessService } from '../services/business.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


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

  constructor(private activatedRoute: ActivatedRoute,
     private storage: Storage,
     private router: Router,
     private ionLoader: LoaderService,
     private businessService: BusinessService,
     public toastController: ToastController,
     private callNumber: CallNumber,
     private socialSharing: SocialSharing) { }

  async ngOnInit() {
  	this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
   await this.ionLoader.showLoader();
   this.businessService.getBusinessById(this.id).subscribe((data)=>{
      if(data){
        this.bus=data;
        this.latitude = parseFloat(this.bus.latitude);
        this.longitude = parseFloat(this.bus.longitude);
        this.ionLoader.hideLoader();
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

   async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 5000
    });
    toast.present();
  }
}
