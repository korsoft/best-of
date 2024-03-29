import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { DeviceService } from '../services/device.service';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss'],
})
export class LocationSearchComponent implements OnInit {

 
  public locations:Array<any>=[];
  public filterLocations:Array<any>=[];
  public device:any;

  constructor(private router: Router,
  	private locationService:LocationService,
    private storage: Storage,
    private deviceService: DeviceService,
    private fcmService: FcmService) { }

  ngOnInit() {
    this.deviceService.getDevice().then((device)=>{
      this.locationService.getLocations(device.uuid).subscribe(
        (data:Array<any>)=>{
          data.sort((a,b)=>{
            return a.Display_Order - b.Display_Order;
          });
             this.locations = data;
             this.filterLocations= data;
        });
    });

  

    this.fcmService.analyticsLogEvent("screen_view",{
      page: "location_search"
    });
  	
    this.fcmService.analyticsSetCurrentScreen("Location Search");
  }


  async doRefresh(event) {
    console.log('Begin async operation');

    this.ngOnInit();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

   async filterList(evt) {
  
    const searchTerm = evt.srcElement.value;

      if (!searchTerm) {
        this.filterLocations= [];
        return;
      }

      this.filterLocations = this.locations.filter(currentloc => {
        if (currentloc.Name && searchTerm) {
          return (currentloc.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
   
  }

  async selectLocation(location){
    console.log("location",location);
    if(location.Lat && location.Lat!="" && location.Long && location.Long != ""){
      this.storage.clear().then((val) => {
        this.storage.set("location",location);
        this.router.navigateByUrl('/home/'+location.Name+'?reload=true');
      });
    }
  }

  public clearLocation(){
  	this.router.navigateByUrl('/home');
  }


}
