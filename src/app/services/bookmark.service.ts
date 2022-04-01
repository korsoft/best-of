import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  constructor(private httpClient: HttpClient) { }

  public createBookmark(uuid,business){
  	
  	return this.httpClient.post(`https://api.bestofventures.app/api/user/1/activity/396`,{"answers":{"Device":uuid,"Business":business},tracking: "true",trackingdevice: uuid});

  }

  public deleteBookmark(id){
  
  	return this.httpClient.delete(`https://api.bestofventures.app/api/user/1/activity/396/qp/${id}`);

  }

  public getBookMarks(uuid){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/396`,{params: {filters:'{"where":[{"q_3700":"'+uuid+'"}]}'}});
  }

  public getBookMark(uuid,business){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/396`,{params: {filters:'{"where":[{"q_3700":"'+uuid+'"},{"q_3701":"'+business+'"}]}',tracking: "true",trackingdevice: uuid}});
  }
}
