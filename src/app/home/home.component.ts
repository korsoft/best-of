import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { LocationService } from '../location.service';
import { CategoryService } from '../category.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoaderService } from '../services/loader.service';
import { LocationCategoriesService } from '../services/location-categories.service';

import { Platform } from '@ionic/angular';

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
    zoom: 5
  };
  public folder: string;
  private localImage:Array<any>=[];
  selectedCard:number=0;
  public categorys:Array<any>=[];
  public selectedElement;
  constructor(private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private device: Device,
    public mapsApiLoader: MapsAPILoader,
    private wrapper: GoogleMapsAPIWrapper,
    private cdr:ChangeDetectorRef,
    private locationService:LocationService,
    private categoryService:CategoryService,
    private router: Router,
    private storage: Storage,
    private ionLoader: LoaderService,
    private locationCategoriesService:LocationCategoriesService,
    public platform: Platform) {
  	this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnInit() {

  }

  setOption(option,cat){
  	if(this.selectedCard!=option){
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
  	}else{
      switch (cat.action_type) {
        case "1":
          this.router.navigateByUrl('/website/Buzz');
          break;
        case "2":
          this.router.navigateByUrl('/website/Weather');
          break;
        default:
          this.router.navigateByUrl('/folder/'+cat.qpId+'/'+cat.cat_name);
          break;
      }

  	}
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
    this.locationService.getLocations().subscribe(
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
                        this.location.address_level_2 =loc.Name;
                        loc.latitude = latitude;
                        loc.longitude = longitude;
                        this.storage.set("location",loc);
                        this.locationCategoriesService.getCategoriesId(loc.qpId).subscribe(async (locationCats:Array<any>)=>{
                         
                          this.storage.get("categories").then(async (val) => {
                            //console.log(val);
                            if(!val){
                                await  this.ionLoader.showLoader();
                                this.categoryService.getCategorys().subscribe(
                                    async (cats:Array<any>)=>{
                                       
                                        cats = cats.filter((value)=>{
                                           for (var i = locationCats.length - 1; i >= 0; i--) {
                                             if(Number(locationCats[i].category)==value.qpId){
                                               value.cat_sort_id= locationCats[i].order;

                                                if(locationCats[i].hide_name && locationCats[i].hide_name=="1")
                                                  value.hide_name=true;
                                                else
                                                  value.hide_name=false;
                                                
                                               if(locationCats[i].local_icon){
                                                 value.cat_icon=locationCats[i].local_icon;
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

  ionViewWillEnter(){
   
    let location = this.activatedRoute.snapshot.paramMap.get('location');

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
            console.log('Error getting location', error);
 
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
