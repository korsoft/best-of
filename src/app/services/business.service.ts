import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessByLocationAndCategory(idLocation,idCategory){
     return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388`,{params: {filters:'{"where":[{"q_3614":"'+idLocation+'"},{"q_3617":"'+idCategory+'"}]}'}});
  }

   public getBusinessById(id){
     return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388/qp/${id}`);
  }
}
