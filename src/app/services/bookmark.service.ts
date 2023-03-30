import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  constructor(private httpClient: HttpClient) { }

  public createBookmark(uuid,business){
  	
  	return this.httpClient.post(`https://api.bestofventures.app/api/user/1/activity/396`,{"answers":{"FirebaseUID":uuid,"Business":business},tracking: "true",trackingdevice: uuid});

  }

  public deleteBookmark(id){
  
  	return this.httpClient.delete(`https://api.bestofventures.app/api/user/1/activity/396/qp/${id}`);

  }

  public getBookMarks(uuid){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/396`,{params: {filters:'{"where":[{"q_4807":"'+uuid+'"}]}'}});
  }

  public getBookMark(uuid,business){
     return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/396`,{params: {filters:'{"where":[{"q_4807":"'+uuid+'"},{"q_3701":"'+business+'"}]}',tracking: "true",trackingdevice: uuid}});
  }

  public getBookMarkSharedByDeviceAndFromFirebaseUID(uuid,fromFirebaseUID):Observable<any>{
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/535`,{params: {filters:'{"where":[{"q_5005":"'+uuid+'"},{"q_5008":"'+fromFirebaseUID+'"}]}'}});
  }

  public getBookMarkSharedByDevice(uuid):Observable<any>{
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/535`,{params: {filters:'{"where":[{"q_5005":"'+uuid+'"}]}'}});
  }

  public getBookMarkSharedByFirebaseUIDAndFromFirebaseUID(firebaseUID,fromFirebaseUID):Observable<any>{
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/535`,{params: {filters:'{"where":[{"q_5006":"'+firebaseUID+'"},{"q_5008":"'+fromFirebaseUID+'"}]}'}});
  }

  public getBookMarkSharedByFirebaseUI(firebaseUID):Observable<any>{
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/535`,{params: {filters:'{"where":[{"q_5006":"'+firebaseUID+'"}]}'}});
  }

  public createBookmarkShared(device, firebaseUID, FromFirebaseUID, FromEmail):Observable<any>{
    return this.httpClient.post(`https://api.bestofventures.app/api/user/1/activity/535`,{"answers":{"Device":device,"FirebaseUID":firebaseUID,"FromFirebaseUID":FromFirebaseUID,"FromEmail":FromEmail}});
  }

  public updateBookmarkShared(qpId, firebaseUID):Observable<any>{
    return this.httpClient.put(`https://api.bestofventures.app/api/user/1/activity/535/qp/${qpId}`,{"answers":{"FirebaseUID":firebaseUID}});
  }
}
