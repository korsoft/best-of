import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/app/services/device.service';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { BusinessService } from 'src/app/services/business.service';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Plugins } from '@capacitor/core';
import { FcmService } from 'src/app/services/fcm.service';
const { Browser } = Plugins;

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {

  public device:any;
  public bookmarks:Array<any>=[];
  public fullBusiness:Array<any>=[];
  public location={"name":"",latitude:0,longitude:0};

  constructor(
    private bookmarkService : BookmarkService, 
    private deviceService: DeviceService, 
    private businessService : BusinessService, 
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,
    private callNumber: CallNumber,
     private socialSharing: SocialSharing,
     private fcmService: FcmService) { }

    ngOnInit(){

    }

 async ionViewWillEnter(){
  await this.fcmService.analyticsLogEvent("screen_view",{
    page: "favorites_page"
  });
  await this.fcmService.analyticsSetCurrentScreen("Favorites");
  
    this.bookmarks = [];
    this.fullBusiness = [];
    this.location = await this.storage.get("location");
    if(!this.location){
      this.presentToast("No data for this location");
      return;
    }
    this.device = await this.deviceService.getDevice();
    this.bookmarkService.getBookMarks(this.device.uuid).subscribe((bookmarks:Array<any>)=>{
      console.log("bookmarks",bookmarks);
      if(bookmarks && bookmarks.length>0){
        bookmarks.forEach((item)=>{
          console.log("item",item);
          this.businessService.getBusinessById(item.Business,this.device.uuid).subscribe((bookmark:any)=>{
            if(bookmark){
              console.log("bookmark",bookmark);
              bookmark.showMap=true;
              if(bookmark.latitude &&  bookmark.longitude &&
                bookmark.latitude !="0" &&  bookmark.longitude!="0"){
                bookmark.distance = this.getDistanceFromLatLon(bookmark.latitude,bookmark.longitude,
                                                this.location.latitude, this.location.longitude  );
              }else{
                bookmark.showMap=false;
              }
              if(bookmark.call){
                bookmark.showCall=true;
              }else{
                bookmark.showCall=false;
              }
              this.bookmarks.push(bookmark);
              this.fullBusiness.push(bookmark);
            }
          });
        });
      } else {
        this.presentToast("No data for favorites");
      }
     
    });
  }

  goToBussinesDetail(bus){
    if(!bus.default_link)
      this.router.navigateByUrl('/businessDetail/'+bus.qpId);
    else{
      Browser.open({ url: bus.default_link })
    }
  }

  public call(bus){
    this.callNumber.callNumber(bus.call, true);
  }

  public share(bus){
    this.storage.get("location").then((loc)=>{ 
            this.socialSharing.share("Check out the Best Of app to find the best of everything in '"+loc.Name+"'' https://bit.ly/3eNGWkH",
           "Hey, check out the Best Of");
        });
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

  async filterList(evt) {
  
    const searchTerm = evt.srcElement.value;
    
    if (!searchTerm) {
      this.bookmarks= this.fullBusiness;
      return;
    }

    this.bookmarks = this.fullBusiness.filter(currentBus=> {
      if (currentBus.Name && searchTerm) {
        return (currentBus.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
    
  }
 
}
