import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocationCategoriesService {

  constructor(private httpClient: HttpClient) { }

  public getCategoriesId(location){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/81447/activity/401`,{params: {filters:'{"where":[{"q_3720":"'+location+'"}]}'}});
  }
}
