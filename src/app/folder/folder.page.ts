import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoaderService } from '../services/loader.service';
import { BusinessService } from '../services/business.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Plugins } from '@capacitor/core';
import OnScreen from 'onscreen';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeviceService } from '../services/device.service';
import { FcmService } from '../services/fcm.service';
import { SettingsService } from '../services/settings.service';

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
  private os = null;
  public device:any;
  public is_classifieds:any=null;
  public sponsoredLabel:string='';

  constructor(private activatedRoute: ActivatedRoute,
     private storage: Storage,
     private router: Router,
     private ionLoader: LoaderService,
     private businessService: BusinessService,
     public toastController: ToastController,
     private callNumber: CallNumber,
     private socialSharing: SocialSharing,
     private geolocation: Geolocation,
     private launchNavigator: LaunchNavigator,
     private deviceService: DeviceService,
     private fcmService : FcmService,
     private settingsService : SettingsService) { }
    
    
  async ngOnInit() {  
    this.loading=true;
    this.folder = this.activatedRoute.snapshot.paramMap.get('name');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.device = await this.deviceService.getDevice();

    this.is_classifieds = this.activatedRoute.snapshot.queryParamMap.get('is_classifieds') ?? '0';

    console.log("is_classifieds",this.is_classifieds);

    this.sponsoredLabel = await this.settingsService.getValue(this.settingsService.SPONSORED_LABEL);
    console.log("sponsoredLabel",this.sponsoredLabel);
  
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
          console.log("subcategories",this.subcategories);
          let subcat = val.find(c => c.qpId === Number(this.id));
          console.log("subcat",subcat);
          if(subcat){
            this.is_classifieds = subcat.is_classifieds;
          }
          if(!this.fullSubcategories.length){
             if(this.location){
                
               this.businessService.getBusinessByLocationAndCategory(loc.qpId,this.id,this.device.uuid).subscribe((data1:Array<any>)=>{
                 console.log("data1",data1);
                this.businessService.getBusinessByLocationAndCategory2(loc.qpId,this.id,this.device.uuid).subscribe((data2:Array<any>)=>{
                  console.log("data2",data2);
                  this.businessService.getBusinessByLocationAndCategory3(loc.qpId,this.id,this.device.uuid).subscribe((data3:Array<any>)=>{
                    console.log("data3",data3);
                    this.businessService.getBusinessByLocationAndCategory4(loc.qpId,this.id,this.device.uuid).subscribe((data4:Array<any>)=>{
                      console.log("data4",data4);
                      let dataTmp = data1;
                      dataTmp = dataTmp.concat(data2);
                      dataTmp = dataTmp.concat(data3);
                      dataTmp = dataTmp.concat(data4);
                      let data = [];
                      console.log("dataTmp",dataTmp);
                      dataTmp.forEach((item)=>{
                          var exists = data.find((item2)=>item2.qpId==item.qpId);
                          if(!exists)
                            data.push(item);
                      });
                      if(data.length){
                        data.sort(
                          (b1,b2)=>{
                            return b1.sort_order - b2.sort_order; 

                          });
                          
                          let firsts = data.filter(item => this.is_classifieds == '1' && item.is_classified && item.is_classified == '1' && item.carousel_level && item.carousel_level == '1');
                          let seconds = data.filter(item => this.is_classifieds == '1' && item.is_classified && item.is_classified == '1' && item.carousel_level && item.carousel_level == '2');
                          data = data.filter(item => this.is_classifieds != '1' || !item.is_classified || item.is_classified != '1' || !item.carousel_level || item.carousel_level != '1');
                          data = data.filter(item => this.is_classifieds != '1' || !item.is_classified || item.is_classified != '1' || !item.carousel_level || item.carousel_level != '2');
                          console.log("firsts",firsts);
                          console.log("seconds",seconds);
                          let first = null;
                          let second = null;
                          if(firsts.length>0){ //random select only 1 first
                            let firstIndex = Math.floor(Math.random()*firsts.length);
                            first = firsts[firstIndex];
                            firsts.splice(firstIndex,1);
                          }
                          if(seconds.length>0){ //random select only 1 second
                            let secondIndex = Math.floor(Math.random()*seconds.length);
                            second = seconds[secondIndex];
                            seconds.splice(secondIndex,1);
                          }

                          let dataT = [];
                          if(first){
                            dataT = dataT.concat(first);
                          }
                          if(second){
                            dataT = dataT.concat(second);
                          }
                          if(firsts.length>0){
                            dataT = dataT.concat(...firsts);
                          }
                          if(seconds.length>0){
                            dataT = dataT.concat(...seconds);
                          }
                          if(data.length>0){
                            dataT = dataT.concat(...data);
                          }



                        data = dataT;

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
                  });
                });
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

  public openNavigator(bus){
   this.fcmService.analyticsLogEvent("screen_action",{
      page: "categories",
      action: "open_navigator",
      business: bus.Name
    });
    console.log("open navigator",bus);
    let latitude = parseFloat(bus.latitude);
    let longitude = parseFloat(bus.longitude);
    this.geolocation.getCurrentPosition().then((resp) => {
      this.launchNavigator.navigate([latitude, longitude], {
        start:  ""+resp.coords.latitude+","+resp.coords.longitude
      });
    }).catch((error) => {
        console.log(error);
    });
  }
  
  onScroll(event) {
    //console.log("event", event);
    /*if(this.os == null)
      this.attachOnScreenEvent();
    else {
      this.os.destroy();
      this.os.attach();
    }*/
    
  }

  attachOnScreenEvent(){
    this.os = new OnScreen({
      tolerance: 300,
      debounce: 0,
      container: '.container'
    });

    this.os.on('enter', '.card-basic-style-business', (element, event) => {
      console.log("element",element);
      element.children[element.children.length-1].children[0].style.display='flex'
    });
    this.os.on('leave', '.card-basic-style-business', (element, event) => {
      console.log("element",element);
      element.children[element.children.length-1].children[0].style.display='none';
    });
  }


  async ionViewWillEnter(){
    
    await this.fcmService.analyticsLogEvent("screen_view",{
      page: "categories_page"
    });
    
    await this.fcmService.analyticsSetCurrentScreen("Categories/Subcategories");

  }

  async goToBussines(cat){
    let locationObj = await this.storage.get('location');
    console.log("cat",cat);
    switch (cat.action_type) {
      case "1":
        this.router.navigateByUrl('/website/Buzz');
        break;
      case "2":
        this.router.navigateByUrl('/website/Weather');
        break;
      case "3":
        Browser.open({ url: cat.categoryUrl });
        break;
      default:
        this.router.navigateByUrl('/folder/'+locationObj.qpId+'/'+cat.qpId+'/'+encodeURIComponent(cat.subcat_name));
        break;
    }
    
  }

  goToBussinesDetail(bus){
    if(!bus.default_link)
      this.router.navigateByUrl('/businessDetail/'+bus.qpId+'?is_classifieds='+this.is_classifieds);
    else{
      Browser.open({ url: bus.default_link })
    }
  }

  getScrollPosition(event){
    console.log(event);
  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 5000
    });
    toast.present();
  }

  async shareSubCategory(subcategory){
    console.log("share subcategory",subcategory);
    let locationObj = await this.storage.get('location');
    let is_classifieds = subcategory?.is_classifieds ?? '0';
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "subcategory",
      action: "share",
      subcategory: subcategory.subcat_name
    });
    this.socialSharing.share(
      `Check out ${subcategory.subcat_name} on Best of Local`,
      null,
      null, //this.bus.body_image,
      `https://bestoflocal.app.link/redirect?page=|folder|${locationObj.qpId}|${subcategory.qpId}|${encodeURIComponent(subcategory.subcat_name)}?is_classifieds=${is_classifieds}`);
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
          return (currentBus.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) ||
                  (currentBus.summary.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }
  }

  public call(bus){
    this.callNumber.callNumber(bus.call, true);
  }

  public share(bus){
    
    this.socialSharing.share(
      "Here's an invite to a great place on the Best Of Local app",
      null,
      null, //bus.body_image,
      "https://bestoflocal.app.link/redirect?page=|businessDetail|"+bus.qpId);

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
