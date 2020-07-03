import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public subcategories:Array<any>=[];


  constructor(private activatedRoute: ActivatedRoute,
     private storage: Storage) { }

  ngOnInit() {  
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.storage.get("subcategories").then((val) => {
      if(!val){
         this.subcategories=[];
      }else{
        this.subcategories=val.filter((cat, index, array)=>{
          return (cat.cat_name===this.folder);  
        });;
      }
    });
  }

  setOption(option){
  

  }
}
