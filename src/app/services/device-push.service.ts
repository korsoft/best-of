import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DevicePushService {

  constructor(private httpClient: HttpClient) { }


  public create(uuid,token){

  	return this.httpClient.post(`https://api.bestofventures.app/api/user/81447/activity/397`,{"answers":{"Device":uuid,"Token":token}});

  }

   public updateByDevice(uuid,token){

  	return this.httpClient.put(`https://api.bestofventures.app/api/user/81447/activity/397/column/3703/data/${uuid}`,{"answers":{"Token":token}});

  }
}
