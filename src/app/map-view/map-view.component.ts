import { Component, OnInit ,ViewChild} from '@angular/core';
import { Platform } from '@ionic/angular';
import { AgmMap } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit  {
  public height:number = 0;
  public lat:number = 0;
  public lng:number = 0;
  public business:any;

  public origin = { lat: 0, lng: 0 };
  public destination = { lat:0, lng: 0 };

  public directions:Array<any>=[];
  
  constructor(private geolocation: Geolocation,
    public platform: Platform,
    private ionLoader: LoaderService) {
    console.log(platform.height());
    this.height = platform.height() - 56;

  }

  ngOnInit() {
    
     this.business = window.history.state.business;
     this.destination.lat= parseFloat(this.business.latitude);
     this.destination.lng= parseFloat(this.business.longitude);
     this.geolocation.getCurrentPosition().then((resp) => {
        this.lat= resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.origin.lat = resp.coords.latitude;
        this.origin.lng = resp.coords.longitude;
        this.directions = [];
        this.directions.push({"origin":this.origin,"destination":this.destination});
       
  
        }).catch((error) => {
          console.log('Error getting location', error);
          
        });
  }



}
