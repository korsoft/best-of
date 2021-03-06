import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss'],
})
export class LocationSearchComponent implements OnInit {

 
  public locations:Array<any>=[];
  public filterLocations:Array<any>=[];

  constructor(private router: Router,
  	private locationService:LocationService,
    private storage: Storage) { }

  ngOnInit() {
  	this.locationService.getLocations().subscribe(
  		(data:Array<any>)=>{
           this.locations = data;
           this.filterLocations= data.filter((val,i)=> {
             return i < 5;
           });
  		});
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

  public selectLocation(location){
    this.storage.clear().then((val) => {
      this.router.navigateByUrl('/home/'+location.Name);
    });
     
  }

  public clearLocation(){
  	this.router.navigateByUrl('/home');
  }


}
