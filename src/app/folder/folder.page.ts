import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../services/loader.service';
import { BusinessService } from '../services/business.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public id: string;
  public subcategories:Array<any>=[];
  public location={"name":"",latitude:0,longitude:0};
  public fullSubcategories:Array<any>=[];
  public business:Array<any>=[];
  public fullBusiness:Array<any>=[];
  private localImage:Array<any>=[];
  public loading = true;

  constructor(private activatedRoute: ActivatedRoute,
     private storage: Storage,
     private router: Router,
     private ionLoader: LoaderService,
     private businessService: BusinessService,
     public toastController: ToastController,
     private callNumber: CallNumber,
     private socialSharing: SocialSharing) { }

  async ngOnInit() {  
       
  }


  async ionViewWillEnter(){
    this.loading=true;
    this.folder = this.activatedRoute.snapshot.paramMap.get('name');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  
    this.storage.get("location").then((loc)=> {
      if(!loc){
        this.presentToast("No data for this location");
        this.loading=false;
        return;
      }
      this.location=loc;
      this.storage.get("subcategories").then( async (val) => {
        if(!val){
           this.subcategories=[];
           this.fullSubcategories=[];
           this.business = [];
           this.fullBusiness = [];
           
        }else{
          this.subcategories=val.filter((cat, index, array)=>{
            return (cat.cat_name===this.folder);  
          });
          this.fullSubcategories=this.subcategories;
          if(!this.fullSubcategories.length){
             if(this.location){
                
               this.businessService.getBusinessByLocationAndCategory(loc.qpId,this.folder).subscribe((data:Array<any>)=>{
                  if(data.length){
                    data.sort(
                      (b1,b2)=>{
                        return b1.sort_order - b2.sort_order; 

                      });
                    this.fullBusiness = data;
                    this.business = data;
                    for (var i = 0; i < this.business.length; i++) {
                      this.business[i].showMap=true;
                      if(this.business[i].latitude &&  this.business[i].longitude &&
                        this.business[i].latitude !="0" &&  this.business[i].longitude!="0"){
                        this.business[i].distance = this.getDistanceFromLatLon(this.business[i].latitude,this.business[i].longitude,
                                                       this.location.latitude, this.location.longitude  );
                      }else{
                        this.business[i].showMap=false;
                      }
                      if(this.business[i].call){
                        this.business[i].showCall=true;
                      }else{
                        this.business[i].showCall=false;
                      }
                    }
                    this.loading=false;
                  }else{
                    this.fullBusiness = [];
                    this.presentToast("No data for category");
                    this.loading=false;
                  }
               });
              }else{
                this.presentToast("No data for category");
                this.loading=false;
              }
          }else{
            let image = "";
            for (var i =  0; i < this.fullSubcategories.length; i++) {
              image = await this.storage.get(this.fullSubcategories[i].cat_icon);
              if(image){
                this.localImage[this.fullSubcategories[i].cat_icon] = image;
              }else{
                image = String( await this.getBase64ImageFromUrl(this.fullSubcategories[i].cat_icon));
                            
                if(!image.startsWith("data:image/jpeg;base64,"))
                  image =  "data:image/jpeg;base64,"+image;

                this.storage.set(this.fullSubcategories[i].cat_icon,image);
                this.localImage[this.fullSubcategories[i].cat_icon]=image;
              }
            }
            this.loading=false;
          }
        }
      });

    });
  }

  goToBussines(cat){
    this.router.navigateByUrl('/folder/'+cat.qpId+'/'+encodeURIComponent(cat.subcat_name));
  }

  goToBussinesDetail(bus){
    if(!bus.default_link)
      this.router.navigateByUrl('/businessDetail/'+bus.qpId);
    else{
      Browser.open({ url: bus.default_link })
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

  

  async filterList(evt) {
  
    const searchTerm = evt.srcElement.value;
    if(this.fullSubcategories.length){
      if (!searchTerm) {
        this.subcategories= this.fullSubcategories;
        return;
      }

      this.subcategories = this.fullSubcategories.filter(currentCat => {
        if (currentCat.subcat_name && searchTerm) {
          return (currentCat.subcat_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }else{
      if (!searchTerm) {
        this.business= this.fullBusiness;
        return;
      }

      this.business = this.fullBusiness.filter(currentBus=> {
        if (currentBus.Name && searchTerm) {
          return (currentBus.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }
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

  public getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return (d * 0.62137).toFixed(2);
  }

  private deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  async  getBase64ImageFromUrl(imageUrl) {
      let res = await fetch(imageUrl);
      let blob = await res.blob();
      
    //  console.log(blob.size);

      let bytes = await new Response(blob).arrayBuffer();
      return this.arrayBufferToBase64(bytes);
  }

  private arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  getImage(url){
    return this.localImage[url];
  }
}
