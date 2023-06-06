import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

    constructor(private httpClient: HttpClient) { }

    public shareDeeplinkByBusiness(business:any){
        const body = {
            "data": { 
            "$og_title": business.Name, 
            "$og_description":business.summary, 
            "$og_image_url": business.body_image, 
            "$deeplink_path":`businessDetails/${business.qpId}`, 
            "$desktop_url":`https://bestoflocal.app.link/businessDetails/${business.qpId}`
          }, 
          "branch_key": "key_live_nk9OlBH0lhwOWtHMvqh60mnhqwo5Oofe" 
        };

        return this.httpClient.post<any>('https://api2.branch.io/v1/url',body);
    }

    public getDataFromDeeplink(url:string){
        
        const params = {
          url,
          branch_key: "key_live_nk9OlBH0lhwOWtHMvqh60mnhqwo5Oofe"
        }

        return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/396`,{params});
    }


}