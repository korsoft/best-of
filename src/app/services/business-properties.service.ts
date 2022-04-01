import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BusinessPropertiesService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessPropertiesByBusiness(idBusiness){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/393`,{params: {filters:'{"where":[{"q_3676":"'+idBusiness+'"}]}'}});
  }
}
