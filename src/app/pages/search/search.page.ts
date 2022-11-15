import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BusinessService } from 'src/app/services/business.service';
import { DeviceService } from 'src/app/services/device.service';
import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import { LoaderService } from 'src/app/services/loader.service';
import { FcmService } from 'src/app/services/fcm.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
const { Browser } = Plugins;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    private businessService : BusinessService,
    private deviceService: DeviceService,  
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,
    private callNumber: CallNumber,
     private socialSharing: SocialSharing,
     private ionLoader: LoaderService,
     private fcmService:FcmService,
     private settingsService: SettingsService,
     private speechRecognition: SpeechRecognition,
     private platform: Platform,
     private chRef: ChangeDetectorRef) { }

     private localImage:Array<any>=[];
  public businessList:Array<any> = [];
  public location={"name":"",latitude:0,longitude:0};
  public device:any;
  public categoriesList:Array<any> = [];
  public categoriesSearch:Array<any> = [];
  public subcategoriesList:Array<any> = [];
  public subcategoriesSearch:Array<any> = [];
  public sponsoredLabel:string = '';
  public searchTextValue:string = '';

  async ngOnInit() {

    let isAvailable:boolean = await this.speechRecognition.isRecognitionAvailable();
    console.log("SpeechRecognition is available",isAvailable);
    if(isAvailable){
      let hasPermissions:boolean = await this.speechRecognition.hasPermission();
      console.log("SpeechRecognition has permissions",hasPermissions);
      if(!hasPermissions){
        try {
          await this.speechRecognition.requestPermission();
        } catch(e){
          console.log(e);
        }
      }
    }

    this.sponsoredLabel = await this.settingsService.getValue(this.settingsService.SPONSORED_LABEL);
      console.log("sponsoredLabel",this.sponsoredLabel);
      this.categoriesList = await this.storage.get("categories");
      console.log("categoriesList",this.categoriesList);
      this.subcategoriesList = await this.storage.get("subcategories");
      console.log("subcategoriesList",this.subcategoriesList);

      let image = "";
      for (var i =  0; i < this.categoriesList.length; i++) {
        image = await this.storage.get(this.categoriesList[i].cat_icon);
        if(image){
          this.localImage[this.categoriesList[i].cat_icon] = image;
        }else{
          image = String( await this.getBase64ImageFromUrl(this.categoriesList[i].cat_icon));
                      
          if(!image.startsWith("data:image/jpeg;base64,"))
            image =  "data:image/jpeg;base64,"+image;

          this.storage.set(this.categoriesList[i].cat_icon,image);
          this.localImage[this.categoriesList[i].cat_icon]=image;
        }
      }
      for (var i =  0; i < this.subcategoriesList.length; i++) {
        image = await this.storage.get(this.subcategoriesList[i].cat_icon);
        if(image){
          this.localImage[this.subcategoriesList[i].cat_icon] = image;
        }else{
          image = String( await this.getBase64ImageFromUrl(this.subcategoriesList[i].cat_icon));
                      
          if(!image.startsWith("data:image/jpeg;base64,"))
            image =  "data:image/jpeg;base64,"+image;

          this.storage.set(this.subcategoriesList[i].cat_icon,image);
          this.localImage[this.subcategoriesList[i].cat_icon]=image;
        }
      }

  }

  async ionViewWillEnter(){
    await this.fcmService.analyticsLogEvent("screen_view",{
      page: "search_page"
    });

    await this.fcmService.analyticsSetCurrentScreen("Search");

    this.location = await this.storage.get("location");
    if(!this.location){
      this.presentToast("No data for this location");
      return;
    }
    this.device = await this.deviceService.getDevice();
  }

  async searchBySpeech(){

    let available = await this.speechRecognition.isRecognitionAvailable();

    let hasPermission = await this.speechRecognition.hasPermission();

    if(available && hasPermission){

      let loading = await this.ionLoader.showSpeechVoice();

      loading.onDidDismiss().then(async () => {
        console.log("onDidDismiss");
        if(this.platform.is('ios')){
          try {
            await this.speechRecognition.stopListening();
          } catch(error){
            console.log(error);
          }
        }
      });

      

      this.speechRecognition.startListening({showPartial: true, matches: 1}).subscribe(
        async (matches: string[]) => { 
          console.log("searches",matches);

          await this.stopSearchBySpeech(matches.join(' '));
        },
        async (onerror) => {
          console.log('error:', onerror);
          try {
            await this.ionLoader.hideSpeechVoice();
          } catch(error){
            console.log(error);
          }     
          try {
            await this.speechRecognition.stopListening();
          } catch(error){
            console.log(error);
          }
        }
      );
  
    }
  }
  async stopSearchBySpeech(text){

      console.log("stopSearchBySpeech",text);
    
      this.searchTextValue = text.trim();

    await this.ionLoader.hideSpeechVoice();
        
      await this.searchBusiness({
        "keyCode":13,
        "srcElement": {
          "value": this.searchTextValue
        }
      });

      
    
  }
  
  async searchBusiness(evt) {
  
    if(evt.keyCode !== 13)
      return;

      const searchTerm = evt.srcElement.value;

    if (!searchTerm || searchTerm.length<2) {
      return;
    }

    await this.fcmService.analyticsLogEvent("screen_action",{
      page: "search",
      action: "search_term",
      term: searchTerm
    });
    
    this.categoriesSearch = [];
    this.subcategoriesSearch = [];
    this.businessList= [];

    

    await this.ionLoader.showLoader();

    let result:Array<any> = [];
    this.storage.get("location").then((loc)=> {
      if(!loc){
        this.presentToast("No data for this location");
        this.ionLoader.hideLoader();
        return;
      }

      
      this.businessService.searchBusinessByName(loc.qpId,searchTerm.toUpperCase(),this.device.uuid).subscribe((business:Array<any>)=>{
        if(business && business.length>0)
          result = result.concat(business);
        this.businessService.searchBusinessBySummary(loc.qpId,searchTerm.toUpperCase(),this.device.uuid).subscribe((list:Array<any>)=>{
          if(list && list.length>0)
            result = result.concat(list);
          this.businessService.searchBusinessByBody(loc.qpId,searchTerm.toUpperCase(),this.device.uuid).subscribe((list2:Array<any>)=>{
            if(list2 && list2.length>0)
              result = result.concat(list2);
              this.businessService.searchBusinessByCategories(loc.qpId,searchTerm.toUpperCase(),this.device.uuid).subscribe((list3:Array<any>)=>{
                this.categoriesSearch = this.categoriesList.filter(cat => cat.cat_name.toLowerCase().includes(searchTerm.toLowerCase()));
                console.log("categoriesSearch",this.categoriesSearch);
                console.log(this.categoriesList);
                this.subcategoriesSearch = this.subcategoriesList.filter(sub => sub.subcat_name.toLowerCase().includes(searchTerm.toLowerCase()));
                console.log("subcategoriesSearch",this.subcategoriesSearch);
                if(list3 && list3.length>0)
                  result = result.concat(list3);
                  result.forEach((item)=>{
                      item.showMap=true;
                      if(item.latitude &&  item.longitude &&
                        item.latitude !="0" &&  item.longitude!="0"){
                          item.distance = this.getDistanceFromLatLon(item.latitude,item.longitude,
                                                        this.location.latitude, this.location.longitude  );
                      }else{
                        item.showMap=false;
                      }
                      if(item.call){
                        item.showCall=true;
                      }else{
                        item.showCall=false;
                      }
                      var exists = this.businessList.find((item2)=>item2.qpId==item.qpId);
                      if(!exists)
                        this.businessList.push(item);
                  });
                  if(this.businessList.length == 0)
                    this.presentToast("No data");
                  //console.log("business list",this.businessList);
                  this.chRef.detectChanges();
                  this.ionLoader.hideLoader();
              });
          });
        });
      });

    });
  


    
  }


  async goToBussines(cat){
    let locationObj = await this.storage.get('location');
    console.log("cat",cat);
    switch (cat.action_type) {
      case "1":
        this.router.navigateByUrl('/website/Buzz');
        break;
      case "2":
        this.router.navigateByUrl('/website/Weather');
        break;
      case "3":
        Browser.open({ url: cat.categoryUrl });
        break;
      default:
        this.router.navigateByUrl('/folder/'+locationObj.qpId+'/'+cat.qpId+'/'+encodeURIComponent(cat.subcat_name));
        break;
    }
    
  }

  async setOption(cat){

    let locationObj = await this.storage.get('location');

    console.log("category",cat);

    let is_classifieds = cat?.is_classifieds ?? '0';

      switch (cat.action_type) {
        case "1":
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_buzz"
          });
          this.router.navigateByUrl('/website/Buzz');
          break;
        case "2":
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_weather"
          });
          this.router.navigateByUrl('/website/Weather');
          break;
        case "3":
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_category_url",
            url: cat.categoryUrl
          });
          Browser.open({ url: cat.categoryUrl });
          break;
        default:
          await this.fcmService.analyticsLogEvent("screen_action",{
            page: "home",
            action: "go_to_category",
            category: cat.cat_name
          });
          this.router.navigateByUrl('/folder/'+locationObj.qpId+'/'+cat.qpId+'/'+cat.cat_name+'?is_classifieds='+is_classifieds);
          break;
      }

  	//}
  }


  goToBussinesDetail(bus){
    if(!bus.default_link)
      this.router.navigateByUrl('/businessDetail/'+bus.qpId+'?is_classifieds='+bus.is_classified);
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

  getImage(url){
    return this.localImage[url];
  }

  async  getBase64ImageFromUrl(imageUrl) {
    let res = await fetch(imageUrl);
    let blob = await res.blob();
    
  //  console.log(blob.size);

    let bytes = await new Response(blob).arrayBuffer();
    return this.arrayBufferToBase64(bytes);
  }

  private arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
