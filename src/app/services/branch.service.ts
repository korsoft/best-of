import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

    constructor(private httpClient: HttpClient) { }

    public shareDeeplinkByBusiness(title:string, business:any){
        const body = {
            "data": { 
            "$og_title": title, 
            "$og_image_url": business.body_image,
            "$twitter_title": title,
            "$twitter_image_url": business.body_image, 
            "$deeplink_path":`businessDetail/${business.qpId}`, 
            "$desktop_url":`https://bestoflocal.app.link/businessDetail/${business.qpId}`,
          }, 
          "branch_key": "key_live_nk9OlBH0lhwOWtHMvqh60mnhqwo5Oofe",
          "duration":604800
        };

        return this.httpClient.post<any>('https://api2.branch.io/v1/url',body);
    }

    public shareDeeplinkBySubCategory(title:string, location:any, subcategory:any, is_classifieds:any){
      const body = {
        "data": { 
        "$og_title": title, 
        "$og_image_url": subcategory.cat_icon, 
        "$twitter_title": title,
        "$twitter_image_url": subcategory.cat_icon, 
        "$deeplink_path":`folder/${location.qpId}/${subcategory.qpId}/${encodeURIComponent(subcategory.subcat_name)}?is_classifieds=${is_classifieds}`, 
        "$desktop_url":`https://bestoflocal.app.link/folder/${location.qpId}/${subcategory.qpId}/${encodeURIComponent(subcategory.subcat_name)}?is_classifieds=${is_classifieds}`
      }, 
      "branch_key": "key_live_nk9OlBH0lhwOWtHMvqh60mnhqwo5Oofe",
      "duration":604800
    };

    return this.httpClient.post<any>('https://api2.branch.io/v1/url',body);
    }

    public shareDeeplinkByCategory(title:string, location:any, category:any, is_classifieds:any){
      const body = {
        "data": { 
        "$og_title": title, 
        "$og_image_url": category.cat_icon, 
        "$twitter_title": title,
        "$twitter_image_url": category.cat_icon, 
        "$deeplink_path":`folder/${location.qpId}/${category.qpId}/${encodeURIComponent(category.cat_name)}?is_classifieds=${is_classifieds}`, 
        "$desktop_url":`https://bestoflocal.app.link/folder/${location.qpId}/${category.qpId}/${encodeURIComponent(category.cat_name)}?is_classifieds=${is_classifieds}`
      }, 
      "branch_key": "key_live_nk9OlBH0lhwOWtHMvqh60mnhqwo5Oofe",
      "duration":604800 
    };

    return this.httpClient.post<any>('https://api2.branch.io/v1/url',body);
    }

    public getDataFromDeeplink(url:string){
        
        const params = {
          url,
          branch_key: "key_live_nk9OlBH0lhwOWtHMvqh60mnhqwo5Oofe"
        }

        return this.httpClient.get(`https://api2.branch.io/v1/url`,{params});
    }


}