import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';
const { Device } = Plugins;

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
  	let device = await this.storage.get("device");
    if( !device ){
      let device = await Device.getInfo();
      await this.storage.set("device",device);
    }
    return device;
  }
}
