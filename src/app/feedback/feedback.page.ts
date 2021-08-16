import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  public title:string;
  public url:string;

  constructor(
    private storage: Storage,
    private geolocation: Geolocation,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit() {
    this.title = 'Feedback';
    this.geolocation.getCurrentPosition().then((resp) => {
          this.storage.get("location").then((loc)=>{ 
            this.url ='https://my.decizie.com/organization/76/dp/home/feedback_input?'+
              'params=[{"label":"AppLocations","value":"'+loc.qpId+'","name":"query"},{"label":"gps","value":"'+resp.coords.latitude+','+resp.coords.longitude+'","name":"query"}]';
        });
    });
  }

  public getUrl(){
  	return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
