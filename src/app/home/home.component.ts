import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { LocationService } from '../location.service';
import { CategoryService } from '../category.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoaderService } from '../services/loader.service';

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

  selectedCard:number=0;
  public categorys:Array<any>=[];

  constructor(private activatedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    public mapsApiLoader: MapsAPILoader,
    private wrapper: GoogleMapsAPIWrapper,
    private cdr:ChangeDetectorRef,
    private locationService:LocationService,
    private categoryService:CategoryService,
    private router: Router,
    private storage: Storage,
    private ionLoader: LoaderService) { 
  	this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
    

  }

  ngOnInit() {
  	this.ionLoader.showLoader();
    let location = this.activatedRoute.snapshot.paramMap.get('location');
    
    	this.mapsApiLoader.load().then(() => {
          this.geocoder = new google.maps.Geocoder();
          this.geolocation.getCurrentPosition().then((resp) => {
           // resp.coords.latitude
           // resp.coords.longitude
              if(!location){
                this.findAddressByCoordinates(resp.coords.latitude,resp.coords.longitude);
              }else{
                this.location.address_level_2=location;
                this.getLocation(resp.coords.latitude,resp.coords.longitude);
              }
          }).catch((error) => {
            console.log('Error getting location', error);
            this.ionLoader.hideLoader();
          });
      });
    
  }

  setOption(option,cat){
  	if(this.selectedCard!=option){
  	 this.selectedCard=option;  
     setTimeout (() => {
         document.getElementById("card-"+option).scrollIntoView(); 
      }, 100);
     
     this.cdr.detectChanges();
  	}else{
      this.router.navigateByUrl('/folder/'+cat.qpId+'/'+cat.cat_name);
  	}
  }

  gotoSearch(){
      this.router.navigateByUrl('/search');
  }

  findAddressByCoordinates(latitude,longitude) {
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
    console.log("location for "+this.location.address_level_2);
    
     this.getLocation(latitude,longitude); 
  }

  private getLocation(latitude,longitude){
    this.locationService.getLocation(this.location.address_level_2).subscribe(
             (data:Array<any>)=>{
                if(data){ 
                  if(data.length>0){
                        let loc  = data[0];
                        loc.latitude = latitude;
                        loc.longitude = longitude;
                        this.storage.set("location",loc);

                  }else{
                    this.storage.set("location",null);
                  }
                  
                  this.storage.get("categories").then((val) => {
              console.log(val);
              if(!val){
                  this.categoryService.getCategorys().subscribe(
                       (cats:Array<any>)=>{
                         this.ionLoader.hideLoader();
                          this.categorys = cats.filter((cat, index, array)=>{
                            return !(cat.subcat_name);  
                          });
                          let subCat = cats.filter((cat, index, array)=>{
                            return (cat.subcat_name);  
                          });
                          this.storage.set("categories",this.categorys);
                          this.storage.set("subcategories",subCat);
                          this.cdr.detectChanges();
                  });
              }else{
                  this.categorys = val;
                  this.ionLoader.hideLoader();
                  this.cdr.detectChanges();
              }

          });
                }else{
                  this.ionLoader.hideLoader();
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
}
