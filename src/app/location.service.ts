import { Injectable, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocationService  {


    constructor(private httpClient: HttpClient,
    	private storage: Storage) { }


    public getLocation(city){
    	//filters=techcrunch&apiKey=${city}`
	    return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/378`,{params: {filters:'{"where":[{"q_3508":"'+city+'"},{"q_3790":"1"}]}'}});
	}

    public getLocations(uuid){
        //filters=techcrunch&apiKey=${city}`
        return this.httpClient.get(`https://api.bestofventures.app/api/user/1/activity/378`,{params: {filters:'{"where":[{"q_3790":"1"}]}',tracking: "true",trackingdevice: uuid}});
    }

	public getSessionLocation(){
        return this.storage.get("location");
	}
}
