import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessByLocationAndCategory(idLocation,category){
  	 category='%\\"'+category+'\\"%';
     return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388`,{params: {filters:
     	'{"where":[{"q_3614":"'+idLocation+'"}],"whereLike":[{"q_3768":"'+category+'"}]}'}});
  }

  public searchBusinessByName(idLocation,text){
    text='%'+text+'%';
    return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"}],"whereLike":[{"q_3620":"'+text+'"}]}'}});
 }

  public searchBusinessBySummary(idLocation,text){
  text='%'+text+'%';
  return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388`,{params: {filters:
    '{"where":[{"q_3614":"'+idLocation+'"}],"whereLike":[{"q_3621":"'+text+'"}]}'}});
  }

  public searchBusinessByBody(idLocation,text){
    text='%'+text+'%';
    return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"}],"whereLike":[{"q_3622":"'+text+'"}]}'}});
  }

  public getBusinessById(id){
     return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/388/qp/${id}`);
  }
}
