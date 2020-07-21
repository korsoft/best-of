import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BusinessPropertiesService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessPropertiesByBusiness(idBusiness){
     return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/393`,{params: {filters:'{"where":[{"q_3676":"'+idBusiness+'"}]}'}});
  }
}
