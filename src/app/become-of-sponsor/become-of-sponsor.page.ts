import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-become-of-sponsor',
  templateUrl: './become-of-sponsor.page.html',
  styleUrls: ['./become-of-sponsor.page.scss'],
})
export class BecomeOfSponsorPage implements OnInit {

  public title:string;
  public url:SafeResourceUrl;

  constructor(
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit() {
    this.title = 'Become a Sponsor';
    
  }

  ionViewWillEnter(){
    this.url =this.sanitizer.bypassSecurityTrustResourceUrl('https://bestofventures.app/organization/76/dp/home/Classified_User_Registration');
    
  }

}
