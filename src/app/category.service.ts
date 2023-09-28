import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  public getCategorys(){
    	//filters=techcrunch&apiKey=${city}`
	    return this.httpClient.get(`https://api.bestofventures.app/api/user/81447/activity/386`,{params: {filters:'{"where":[{"q_3591":1}]}'}});
  }

   public getCategorysById(ids:Array<any>){
    	//filters=techcrunch&apiKey=${city}`
      console.log("getCategorysById",ids);
	    return this.httpClient.get(`https://api.bestofventures.app/api/user/81447/activity/386`,
	    	{params: {filters:'{"where":[{"q_3591":1},{"in":['+ids.join()+'] }]}'}});
  }
}
