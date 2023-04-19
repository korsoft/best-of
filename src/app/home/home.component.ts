import { Component, OnInit,ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { LocationService } from '../location.service';
import { CategoryService } from '../category.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {  Plugins } from '@capacitor/core';
import { IonContent, LoadingController } from '@ionic/angular';
import { LoaderService } from '../services/loader.service';
import { LocationCategoriesService } from '../services/location-categories.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { DeviceService } from '../services/device.service';
import { FcmService } from '../services/fcm.service';
import { SettingsService } from '../services/settings.service';
const { Browser } = Plugins;
const { Device } = Plugins;
declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  picture_home?: string;
  marker?: Marker;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  geocoder:any;
  public location:Location = {
    lat: 51.678418,
    lng: 7.809007,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    picture_home: null,
    zoom: 5
  };
  public folder: string;
  private localImage:Array<any>=[];
  selectedCard:number=0;
  public categorys:Array<any>=[];
  public selectedElement;
  public device:any;

  @ViewChild(IonContent) pageTop: IonContent;
  
  constructor(private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    public mapsApiLoader: MapsAPILoader,
    private wrapper: GoogleMapsAPIWrapper,
    private cdr:ChangeDetectorRef,
    private locationService:LocationService,
    private categoryService:CategoryService,
    private router: Router,
    private storage: Storage,
    private ionLoader: LoaderService,
    private deviceService: DeviceService,
    private locationCategoriesService:LocationCategoriesService,
    private fcmService : FcmService,
    private settingsService : SettingsService,
    public platform: Platform,
    private socialSharing: SocialSharing) {
  	this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnInit() {
    Device.getInfo().then((info) => {
      console.log("device info",info)
      //this.deviceService.createDevice(info).subscribe();
      this.fcmService.initPush(info.uuid);
    });

    this.settingsService.reloadGlobalSettings();

  }

  async doRefresh(event) {
    console.log('Begin async operation');

    await this.loadPage();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 3000);
    
  }
  
  async setOption(option,cat){

    /*if(cat.NoAction === '1')
      return;
    */
    let locationObj = await this.storage.get('location');

    console.log("option",option);
    console.log("category",cat);

    let is_classifieds = cat?.is_classifieds ?? '0';

    let classified_category = cat?.classified_category ?? '0';

    let sort_by_name = cat?.SortSubcategories ?? '0';

  	/*if(this.selectedCard!=option){
     let tempOption=this.selectedCard;
     let up = this.selectedCard > option;
  	 this.selectedCard=option;
     if(this.platform.is("ios") ){
        if(tempOption + 3 < this.categorys.length)
          setTimeout (() => {
              this.scrollCustomImplementation(document.getElementById(cat.viewId),up);
          });

     }else{
        setTimeout (() => {
          document.getElementById(cat.viewId).scrollIntoView({behavior: "smooth"});
        });
     }


     this.cdr.detectChanges();
  	}else{*/
      switch (cat.action_type) {
        case "1":
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_buzz"
          });
          this.router.navigateByUrl('/website/Buzz');
          break;
        case "2":
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_weather"
          });
          this.router.navigateByUrl('/website/Weather');
          break;
        case "3":
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_category_url",
            url: cat.categoryUrl
          });
          Browser.open({ url: cat.categoryUrl });
          break;
        default:
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_category",
            category: cat.cat_name
          });
          this.router.navigateByUrl(`/folder/${locationObj.qpId}/${cat.qpId}/${cat.cat_name}?is_classifieds=${is_classifieds}&classified_category=${classified_category}&sort_by_name=${sort_by_name}`);
          break;
      }

  	//}
  }

  async getChatUrl(){
    let location = await this.storage.get('location');
    console.log("getChatUrl",location);
    if(location){
      if(location.Home_Card_URL && location.Home_Card_URL.length>3)
        Browser.open({ url: location.Home_Card_URL })
    }
  }

  async shareCategory(category){
    let locationObj = await this.storage.get('location');
    let is_classifieds = category?.is_classifieds ?? '0';
    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "category",
      action: "share",
      category: category.cat_name
    });
    this.socialSharing.share(
      `Check out ${category.cat_name} on Best of Local`,
      null,
      null, //this.bus.body_image,
      `https://bestoflocal.app.link/redirect?page=|folder|${locationObj.qpId}|${category.qpId}|${category.cat_name}?is_classifieds=${is_classifieds}`);
  }

  gotoSearch(){
      this.router.navigateByUrl('/search');
  }

 /* findAddressByCoordinates(latitude,longitude) {
    this.geocoder.geocode({
      'location': {
        lat: latitude,
        lng: longitude
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results,latitude,longitude);
    })
  }

  decomposeAddressComponents(addressArray,latitude,longitude) {
    if (addressArray.length == 0) return false;
    let address = addressArray[0].address_components;

    for(let element of address) {
      if (element.length == 0 && !element['types']) continue

      if (element['types'].indexOf('street_number') > -1) {
        this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        this.location.address_level_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        this.location.address_level_2 =element['long_name'].toUpperCase();
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        this.location.address_state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        this.location.address_country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        this.location.address_zip = element['long_name'];
        continue;
      }
    }
  

     this.getLocation(latitude,longitude);
  }*/ 

  private getLocation(latitude,longitude,locationName){
    this.fcmService.analyticsLogEvent("screen_action",{
      page: "home",
      action: "go_to_location",
      location: locationName
    });
    this.locationService.getLocations(this.device.uuid).subscribe(
            (data:Array<any>)=>{
              
                  if(data.length>0){
                        
                        let loc  = null;
                        if(!locationName){
                          loc = this.getCloseLocation(data,latitude,longitude);
                        }else{
                          loc = data.find(l=>{
                            return l.Name===locationName;
                          });
                        }
                        console.log("loc",loc);
                        this.location.address_level_2 =loc.Name;
                        this.location.picture_home = loc.picture_home ? loc.picture_home : null;
                        loc.latitude = latitude;
                        loc.longitude = longitude;
                        this.storage.set("location",loc);
                        this.locationCategoriesService.getCategoriesId(loc.qpId).subscribe(async (locationCats:Array<any>)=>{

                          console.log("locationCats",locationCats);
                         
                          this.storage.get("categories").then(async (val) => {

                            if(this.location.picture_home && this.location.picture_home!=''){
                              let base:string = String( await this.getBase64ImageFromUrl(this.location.picture_home));
                                if(!base.startsWith("data:image/jpeg;base64,"))
                                  base =  "data:image/jpeg;base64,"+base;
      
                                this.storage.set(this.location.picture_home,base);
                                this.localImage[this.location.picture_home]=base;
                              }
                            //console.log(val);
                            if(!val){
                                await  this.ionLoader.showLoader();
                                this.categoryService.getCategorys().subscribe(
                                    async (cats:Array<any>)=>{
                                      
                                       
                                        cats = cats.filter((value)=>{
                                           for (var i = locationCats.length - 1; i >= 0; i--) {
                                             if(locationCats[i].active && locationCats[i].active=="0")
                                                continue;
                                              
                                             if(Number(locationCats[i].category)==value.qpId){
                                               value.cat_sort_id= locationCats[i].order;
                                               value.categoryUrl = locationCats[i].Category_URL;
                                               value.is_classifieds = locationCats[i].is_classifieds ?? '0';
                                               value.Share = locationCats[i].Share ?? '0';
                                               value.NoAction = locationCats[i].NoAction ?? '0';
                                               value.SortSubcategories = locationCats[i].SortSubcategories ?? '0';

                                                if(locationCats[i].hide_name && locationCats[i].hide_name=="1")
                                                  value.hide_name=true;
                                                else
                                                  value.hide_name=false;
                                                
                                              if(locationCats[i].local_icon){
                                                const locationIcon = locationCats[i].local_icon;
                                                const newLocationIcon = locationIcon.substring(0,locationIcon.lastIndexOf('.')) + ".webp";
                                                value.cat_icon=newLocationIcon;
                                              }
                                              return true;
                                            }
                                          }
                                          return false;
                                        });

                                        
                                        let localCategories = cats.filter((cat, index, array)=>{
                                          return !(cat.subcat_name);
                                        });
                                       localCategories.sort((c1,c2)=>{
                                          return c1.cat_sort_id - c2.cat_sort_id;
                                        });
                                        for (var i = localCategories.length - 1; i >= 0; i--) {
                                          let base:string = String( await this.getBase64ImageFromUrl(localCategories[i].cat_icon));
                                          
                                          if(!base.startsWith("data:image/jpeg;base64,"))
                                            base =  "data:image/jpeg;base64,"+base;

                                          this.storage.set(localCategories[i].cat_icon,base);
                                          this.localImage[localCategories[i].cat_icon]=base;
                                        }
                                        let subCat = cats.filter((cat, index, array)=>{
                                          return (cat.subcat_name);
                                        });
                                        this.categorys = localCategories;  
                                        subCat.sort((c1,c2)=>{
                                          return c1.cat_sort_id - c2.cat_sort_id;
                                        });                   
                                        this.loadSubCategoties(subCat);

                                       
                                       
                                        this.storage.set("subcategories",subCat);                          
                                        this.storage.set("categories",this.categorys);
                                        
                                        for (var i = this.categorys.length - 1; i >= 0; i--) {
                                          this.categorys[i].viewId="card"+i+""+new Date().getTime();
                                        }
                                       
                                        this.ionLoader.hideLoader();
                                        this.cdr.detectChanges();
                                });
                            }else{
                                if(this.categorys.length==0){
                                  this.categorys = val;
                                  let local="";
                                
                                  for (var i = this.categorys.length - 1; i >= 0; i--) {
                                    this.categorys[i].viewId="card"+i+""+new Date().getTime();
                                    local = await this.storage.get(this.categorys[i].cat_icon);
                                    this.localImage[this.categorys[i].cat_icon]=local;
                                  }
                                }  
                                             
                                this.cdr.detectChanges();
                            }

                          });
                        });

                  }else{
                    this.storage.set("location",null);
                  }
               
           
                }
            
    );
  }
  onSwipeUp(){
     console.log("onSwipeUp");
    if(this.selectedCard<(this.categorys.length-1)){
       this.setOption(this.selectedCard+1,this.categorys[this.selectedCard+1]);
    }
  }

  onSwipeDown(){
    console.log("onSwipeDown");
    if(this.selectedCard>0){
       this.setOption(this.selectedCard-1,this.categorys[this.selectedCard-1]);
    }
  }

  async ionViewWillEnter(){
  
    //this.pageTop.scrollToTop(0);

    await this.fcmService.analyticsLogEvent("screen_view",{
      page: "home"
    });

    await this.fcmService.analyticsSetCurrentScreen("Home");

    this.device = await this.deviceService.getDevice();
    if(!this.device){
      this.device = await Device.getInfo();
    }
    
    if(this.categorys.length > 0 && (!this.activatedRoute.snapshot.queryParamMap || 
      !this.activatedRoute.snapshot.queryParamMap.get('reload')))
      return;
    
    await this.loadPage();
    
  }


  async loadPage(){
    let locationStorage = await this.storage.get("location");

    let location = locationStorage ? locationStorage.Name : this.activatedRoute.snapshot.paramMap.get('location');
    
      this.mapsApiLoader.load().then(() => {
          this.geocoder = new google.maps.Geocoder();
          this.geolocation.getCurrentPosition().then((resp) => {
           // resp.coords.latitude
           // resp.coords.longitude
              if(!location){
                this.getLocation(resp.coords.latitude,resp.coords.longitude,null);
              }else{
               
                this.getLocation(resp.coords.latitude,resp.coords.longitude,location);
              }
          }).catch((error) => {
              if(!location){
                this.getLocation(0,0,"DELRAY BEACH");
              }else{
               
                this.getLocation(0,0,"DELRAY BEACH");
              }
          });
      });
  } 


  scrollCustomImplementation(element: HTMLElement,up) {
    console.log('***** this.platform.is("ios") { ', this.platform.is('ios'), ' }')
    console.log('***** this.platform.height() { ', this.platform.height(), ' }')

    let size = 64

    if(this.platform.is('ios')) {
      const height = this.platform.height()
      if(896 <= height) {
        size = 90
      }
    }

    console.log('***** size { ', size, ' }')

    let start = null;
    let target = element.getBoundingClientRect().top;

    let firstPos = element.parentElement.scrollTop - size;
    let pos = 0;

    (function () {
      var browser = ['ms', 'moz', 'webkit', 'o'];

      for (var x = 0, length = browser.length; x < length && !window.requestAnimationFrame; x++) {
        window.requestAnimationFrame = window[browser[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[browser[x] + 'CancelAnimationFrame'] || window[browser[x] + 'CancelRequestAnimationFrame'];
      }
    })();

    function showAnimation(timestamp) {
      if (!start) {
        start = timestamp || new Date().getTime();
      } //get id of animation


      var elapsed = timestamp - start;
      var progress = elapsed / 600; // animation duration 600ms
      //ease in function from https://github.com/component/ease/blob/master/index.js

      var outQuad = function(n) {
        return n * (2 - n);
      };

      var easeInPercentage = +outQuad(progress).toFixed(2); // if target is 0 (back to top), the position is: current pos + (current pos * percentage of duration)
      // if target > 0 (not back to top), the positon is current pos + (target pos * percentage of duration)
      let move=0;

        move = firstPos + target * easeInPercentage;


      pos = target === 0 ? firstPos - firstPos * easeInPercentage : move;
      element.parentElement.scrollTo(0, pos);
     // console.log(pos, target, firstPos, progress);
      let stop= false;
      if(!up)
        stop=pos >= firstPos + target;
      else
        stop=pos <= firstPos + target;

      if (target !== 0 && stop || target === 0 && pos <= 0) {
        cancelAnimationFrame(start);

        if (element) {
          element.setAttribute("tabindex", "-1");
          element.focus();
        }

        pos = 0;
      } else {
        window.requestAnimationFrame(showAnimation);
      }
    }

    window.requestAnimationFrame(showAnimation);
  }

   async  getBase64ImageFromUrl(imageUrl) {
     try{
      let res = await fetch(imageUrl);
      let blob = await res.blob();
      
    //  console.log(blob.size);

      let bytes = await new Response(blob).arrayBuffer();
      return this.arrayBufferToBase64(bytes);
    }catch(e){
      console.log(imageUrl+" "+e);
      return "";
    }
  }

  async loadSubCategoties(subCats:Array<any>){
      for (var i = subCats.length - 1; i >= 0; i--) {
       let base:string =  await this.getBase64ImageFromUrl(subCats[i].cat_icon);
       
        if(!base.startsWith("data:image/jpeg;base64,"))
          base =  "data:image/jpeg;base64,"+base;
       // console.log(subCats[i].cat_icon);
       await this.storage.set(subCats[i].cat_icon,base);
      }

     
  }


  getImage(url){
    return this.localImage[url];
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private getCloseLocation(data:Array<any>,lat,long){
    let distance=999999999;
    let location = null;

    for (var i = 0; i < data.length; ++i) {
      let dist = this.getDistanceFromLatLon(Number(data[i].Lat),Number(data[i].Long),lat,long);
      if(dist<distance){
        distance=dist;
        location=data[i]; 
      }
    }
    return location;
  }
  private getDistanceFromLatLon(lat1,lon1,lat2,lon2):number {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return (d * 0.62137);
  }

  private deg2rad(deg) {
    return deg * (0.01745329251994329576923690768489)
  }

}
