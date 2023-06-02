import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import SearchFilter from '../interfaces/SearchFilter';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private httpClient: HttpClient) { }

  public getBusinessByLocationAndCategory(idLocation,category,uuid){
  	 return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
     	'{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_3617":"'+category+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public getBusinessByLocationAndCategory2(idLocation,category2,uuid){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_4256":"'+category2+'"}]}',tracking: "true",trackingdevice: uuid}});
 }

  public getBusinessByLocationAndCategory3(idLocation,category3,uuid){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_4920":"'+category3+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public getBusinessByLocationAndCategory4(idLocation,category4,uuid){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"},{"q_4921":"'+category4+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public searchBusinessByName(idLocation,text,uuid, filters: SearchFilter){
    text='%'+text+'%';
    let extraFilters = this.buildFilters(filters);
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}'+extraFilters+'],"whereLike":[{"q_3620":"'+text+'"}]}',tracking: "true",trackingdevice: uuid, limit:'100', order: (filters.recentBusiness ? 'desc' : 'asc')}});
 }

  public searchBusinessBySummary(idLocation,text,uuid, filters: SearchFilter){
  text='%'+text+'%';
  let extraFilters = this.buildFilters(filters);
  return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
    '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}'+extraFilters+'],"whereLike":[{"q_3621":"'+text+'"}]}',tracking: "true",trackingdevice: uuid, limit:'100', order: (filters.recentBusiness ? 'desc' : 'asc')}});
  }

  public searchBusinessByBody(idLocation,text,uuid, filters: SearchFilter){
    text='%'+text+'%';
    let extraFilters = this.buildFilters(filters);
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}'+extraFilters+'],"whereLike":[{"q_3622":"'+text+'"}]}',tracking: "true",trackingdevice: uuid, limit:'100', order: (filters.recentBusiness ? 'desc' : 'asc')}});
  }

  public searchBusinessByCategories(idLocation,text,uuid, filters: SearchFilter){
    text='%'+text+'%';
    let extraFilters = this.buildFilters(filters);
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388`,{params: {filters:
      '{"where":[{"q_3614":"'+idLocation+'"},{"q_3619":"1"}'+extraFilters+'],"whereLike":[{"q_4639":"'+text+'"}]}',tracking: "true",trackingdevice: uuid, limit:'100', order: (filters.recentBusiness ? 'desc' : 'asc')}});
  }

  public getBusinessById(id,uuid){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/388/qp/${id}`,{params:{tracking: "true",trackingdevice: uuid}});
  }

  public getAdById(id, uuid){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/528/qp/${id}`,{params:{tracking: "true",trackingdevice: uuid}});
  }

  public createUserSearchTerm(deviceId,searchTerm){
  	return this.httpClient.post(`https://api.bestofventures.app/api/user/81447/activity/536`,{"answers":{"UserSearchDevice":deviceId,"UserSearchString":searchTerm}});
  }

  public getUserSearchTermsByDeviceId(deviceId){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/81447/activity/536`,{params: {filters:
      '{"where":[{"q_5014":"'+deviceId+'"}]}',tracking: "true",trackingdevice: deviceId, limit:'10', order: 'desc'}});
  }

  private buildFilters(filters: SearchFilter): String {
    let filtersStr = '';
    if(filters.newBusiness === true){
      filtersStr += `,{"q_4955":"1"}`;
    }
    if(filters.memberBusiness === true){
      filtersStr += `,{"q_3783":"1"}`;
    }
    return filtersStr;

  }
  
}
