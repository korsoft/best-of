import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessByLocationAndCategory(idLocation,category,uuid){
  	 //category='%\\"'+category+'\\"%';
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
     	'{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_3617":"'+category+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public getBusinessByLocationAndCategory2(idLocation,category2,uuid){
    //category='%\\"'+category+'\\"%';
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_4256":"'+category2+'"}]}',tracking: "true",trackingdevice: uuid}});
 }

  public getBusinessByLocationAndCategory3(idLocation,category3,uuid){
    //category='%\\"'+category+'\\"%';
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_4920":"'+category3+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public getBusinessByLocationAndCategory4(idLocation,category4,uuid){
    //category='%\\"'+category+'\\"%';
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_4921":"'+category4+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public searchBusinessByName(idLocation,text,uuid){
    text='%'+text+'%';
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}],"whereLike":[{"q_3620":"'+text+'"}]}',tracking: "true",trackingdevice: uuid}});
 }

  public searchBusinessBySummary(idLocation,text,uuid){
  text='%'+text+'%';
  return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
    '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}],"whereLike":[{"q_3621":"'+text+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public searchBusinessByBody(idLocation,text,uuid){
    text='%'+text+'%';
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}],"whereLike":[{"q_3622":"'+text+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public searchBusinessByCategories(idLocation,text,uuid){
    text='%'+text+'%';
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}],"whereLike":[{"q_4639":"'+text+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public getBusinessById(id,uuid){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388/qp/${id}`,{params:{tracking: "true",trackingdevice: uuid}});
  }

  public getAdById(id, uuid){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/528/qp/${id}`,{params:{tracking: "true",trackingdevice: uuid}});
  }

  
}
