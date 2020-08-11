import { Injectable, } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HTTP }  from '@ionic-native/http/ngx';
import { of, Observable, defer } from 'rxjs'; 
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LocationService  {


    constructor(private httpClient: HTTP,
    	private storage: Storage) { }


    public getLocation(city):Observable<any>{
    	//filters=techcrunch&apiKey=${city}`
	      alert(`https://my.decizie.com/api/user/81447/activity/378?params=`+JSON.stringify( {filters:'{"where":[{"q_3508":"'+city+'"}]}'}));
        let promise =this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/378?params=`+JSON.stringify( {filters:'{"where":[{"q_3508":"'+city+'"}]}'}),{},{
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF',
      })
        return defer(()=>{
          return promise.then(json => {
              return JSON.parse(json.data);
            })
        });
	}

    public getLocations():Observable<any>{
        //filters=techcrunch&apiKey=${city}`
       
        let promise =this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/378`,{},{
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF',
      })
        return defer(()=>{
          return promise.then(json => {
              return JSON.parse(json.data);
            })
        });
    }

	public getSessionLocation(){
        return this.storage.get("location");
	}
}
