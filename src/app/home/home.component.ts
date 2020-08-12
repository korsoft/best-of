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
  	
    
  }

  setOption(option,cat){
  	if(this.selectedCard!=option){
  	 this.selectedCard=option;  
     setTimeout (() => {
         document.getElementById(cat.viewId).scrollIntoView({behavior: "smooth"}); 
      });
     
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
    alert("location")
    this.locationService.getLocation(this.location.address_level_2).subscribe(
             (data:Array<any>)=>{
                alert(JSON.stringify(data));
                if(data){ 
                  if(data.length>0){
                    
                        let loc  = data[0];
                        loc.latitude = latitude;
                        loc.longitude = longitude;
                        this.storage.set("location",loc);

                  }else{
                    this.storage.set("location",null);
                  }
                   console.log("val antes storage");
                  this.storage.get("categories").then((val) => {
                                 console.log("val from storage");
                                                    console.log(val);
              if(!val){
                  this.categoryService.getCategorys().subscribe(
                       (cats:Array<any>)=>{
                        alert(cats);
                         this.ionLoader.hideLoader();
                          this.categorys = cats.filter((cat, index, array)=>{
                            return !(cat.subcat_name);  
                          });
                          this.categorys.sort((c1,c2)=>{
                            return c1.cat_sort_id - c2.cat_sort_id; 
                          });
                          let subCat = cats.filter((cat, index, array)=>{
                            return (cat.subcat_name);  
                          });
                          subCat.sort((c1,c2)=>{
                            return c1.cat_sort_id - c2.cat_sort_id; 
                          });
                          this.storage.set("categories",this.categorys);
                          this.storage.set("subcategories",subCat);
                          for (var i = this.categorys.length - 1; i >= 0; i--) {
                            this.categorys[i].viewId="card"+i+""+new Date().getTime();
                          }
                          this.cdr.detectChanges();
                  });
              }else{
                  this.categorys = val;
                  for (var i = this.categorys.length - 1; i >= 0; i--) {
                    this.categorys[i].viewId="card"+i+""+new Date().getTime();
                  }
                  this.ionLoader.hideLoader();
                  this.cdr.detectChanges();
              }

          });
                }else{
                  this.ionLoader.hideLoader();
                }
             },(error)=> {
               console.log(error);
               alert(error);
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
    this.ionLoader.showLoader();
    let location = this.activatedRoute.snapshot.paramMap.get('location');
    this.location.address_level_2="MÉRIDA";
    this.getLocation(0,0);
  }
}
