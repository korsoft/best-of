import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService {

  constructor(private httpClient: HttpClient,
  	 private storage: Storage) { }

  public createDevice(device){
  	this.storage.set("deviceSettings",device);
  	return this.httpClient.post(`https://api.bestofventures.app/api/user/1/activity/524`,{"answers":device});

  }

  public updateDevice(device){
    let qpId = device.qpId;
    let answers = {
      appVersion: device.appVersion,
      dataVersion: device.dataVersion
    }
  	this.storage.set("deviceSettings",device);
  	return this.httpClient.put(`https://api.bestofventures.app/api/user/1/activity/524/qp/${qpId}`,{"answers":answers});

  }

  public  getDeviceByUUID(uuid:string){
    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/524`,{params: {filters:'{"where":[{"q_4930":"'+uuid+'"}]}',limit:"1"}});
  }

  public async getDevice(){
  	return await this.storage.get("deviceSettings");
  }
}
