import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService  {


    constructor(private httpClient: HttpClient) { }


    public getLocation(city){
    	//filters=techcrunch&apiKey=${city}`
	    return this.httpClient.get(`https://my.decizie.com/api/user/81447/activity/378`,{params: {filters:'{"where":[{"q_3508":"'+city+'"}]}'}});
	}
}
