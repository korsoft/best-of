import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  public getCategorys(){
    	//filters=techcrunch&apiKey=${city}`
	    return this.httpClient.get(`https://decizie.com/api/user/81447/activity/386`,{params: {filters:'{"where":[{"q_3591":1}]}'}});
  }
}
