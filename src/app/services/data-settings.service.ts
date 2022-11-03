import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataSettingsService {

  constructor(private httpClient: HttpClient) { }

  public  getDataSettings(){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/525?limit=1`);
  }
}
