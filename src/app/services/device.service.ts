import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private httpClient: HttpClient,
  	 private storage: Storage) { }

  public createDevice(device){
  	this.storage.set("device",device);
  	return this.httpClient.post(`https://api.bestofventures.app/api/user/81447/activity/395`,{"answers":device});

  }

  public async getDevice(){
  	return await this.storage.get("device");
  }
}
