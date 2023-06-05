import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalController } from "@ionic/angular";
import BusinessMedia, { BusinessMediaType } from "../interfaces/BusinessMedia";

@Component({
    templateUrl: './business-media.modal.html',
    styleUrls: ['./business-detail.component.scss'],
  })
export class BusinessMediaModal implements OnInit  {


    @Input() media: BusinessMedia;

    public showVideo: boolean = false;
    public showImage: boolean = false;
    public url : string | SafeUrl;

    constructor(private modalController: ModalController, private sanitizer: DomSanitizer ){}

    ngOnInit() {
        this.showVideo = false;
        this.showImage = false;
        this.url = this.media.url;
        console.log(this.media);
        if(this.media.type == BusinessMediaType.image){
            this.showImage = true;
        } else {
            this.showVideo = true;
            let urlStr = this.media.url;
           
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(urlStr);
        }
    }
  
    dismiss() {
      //console.log(this.filters);
      // using the injected ModalController this page
      // can "dismiss" itself and optionally pass back data
      this.modalController.dismiss({
        'dismissed': true
      });
    }
  }