import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HTTP }  from '@ionic-native/http/ngx';
import { of, Observable, defer } from 'rxjs'; 
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private httpClient: HTTP,
  	 private storage: Storage) { }

  public createDevice(device) :Observable<any> {
  	this.storage.set("device",device);
    let promise =this.httpClient.post(`https://my.decizie.com/api/user/81447/activity/395`,{"answers":device},{
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF',
      })
    return defer(()=>{
      return promise.then(json => {
          return json;
        })
    });


  }

  public async getDevice(){
  	return await this.storage.get("device");
  }
}
