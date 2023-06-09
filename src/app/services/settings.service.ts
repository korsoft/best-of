import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  public SPONSORED_LABEL:string       = 'SPONSORED_LABEL';
  public BUSINESS_SHARE_TITLE:string  = 'BUSINESS_SHARE_TITLE';
  public CATEGORY_SHARE_TITLE:string  = 'CATEGORY_SHARE_TITLE';

  private KEY:string = 'global-settings';

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  public reloadGlobalSettings(){
    this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/522`).subscribe(async (settings:Array<any>)=>{
      console.log("reloadGlobalSettings",settings);
      this.storage.set(this.KEY,settings);
    });
  }

  public async getValue(key:string) {
    let settings = await this.storage.get(this.KEY);
    console.log("settings",settings);
    return settings != null ? (settings.find(s => s.Key === key)?.Value ?? '') : null;
  }

}
