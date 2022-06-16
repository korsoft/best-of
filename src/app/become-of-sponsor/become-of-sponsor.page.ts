import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-become-of-sponsor',
  templateUrl: './become-of-sponsor.page.html',
  styleUrls: ['./become-of-sponsor.page.scss'],
})
export class BecomeOfSponsorPage implements OnInit {

  public title:string;
  public url:SafeResourceUrl;

  constructor(
    private sanitizer:DomSanitizer,
    private fcmService:FcmService
  ) { }

  ngOnInit() {
    this.title = 'Become a Sponsor';
    
  }

  async ionViewWillEnter(){
    await this.fcmService.analyticsLogEvent("screen_view",{
      page: "become_a_sponsor"
    });
    await this.fcmService.analyticsSetCurrentScreen("Become of Sponsor");
    this.url =this.sanitizer.bypassSecurityTrustResourceUrl('https://bestofventures.app/organization/76/dp/home/Classified_User_Registration');
    
  }

}
