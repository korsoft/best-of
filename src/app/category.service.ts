import { Injectable } from '@angular/core';
import { HTTP }  from '@ionic-native/http/ngx';
import { of, Observable, defer } from 'rxjs'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HTTP) { }

  public getCategorys():Observable<any>{
    	//filters=techcrunch&apiKey=${city}`
	  //  return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/386`,{params: {filters:'{"where":[{"q_3591":1}]}'}});
	     alert(`https://my.decizie.com/api/user/81447/activity/386?filters=`+'{"where":[{"q_3591":1}]}');
        let promise =this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/386?filters=`+'{"where":[{"q_3591":1}]}',{},{
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': 'pIqZvpXE50vizxFoHosy2gbJgcB2IDKuQY8hgoaF'
      })
        return defer(()=>{
          return promise.then(json => {
              return JSON.parse(json.data);
            })
        });
  }
}
