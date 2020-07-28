import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../location.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-website',
  templateUrl: './website.page.html',
  styleUrls: ['./website.page.scss'],
})
export class WebsitePage implements OnInit {
   public title:string;
   public url:string;


   constructor(private route: ActivatedRoute,
   	private locationService:LocationService,
   	private sanitizer:DomSanitizer) { }
 
  async ngOnInit() {
  	let location = await this.locationService.getSessionLocation();
  	this.url =location.URL;
    this.route.paramMap.subscribe(params => {
      this.title = params.get('id');
      
      	if(this.title=="Buzz"){
      		this.url =location.URL;

      	}else if(this.title=="Weather"){
            this.url=location.Weather_Link;
      	}

    });
  }

  public getUrl(){
  	return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

}
