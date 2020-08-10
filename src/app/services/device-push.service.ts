import { Injectable } from '@angular/core';
import { HTTP }  from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class DevicePushService {

  constructor(private httpClient: HTTP) { }


  public create(uuid,token){

  	 return this.httpClient.post(`https://my.decizie.com/api/user/81447/activity/397`,{"answers":{"Device":uuid,"Token":token}},{
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF',
      });

  }

   public updateByDevice(uuid,token){

  	return this.httpClient.put(`https://my.decizie.com/api/user/81447/activity/397/column/3703/data/${uuid}`,{"answers":{"Token":token}},{
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF',
      });

  }
}
