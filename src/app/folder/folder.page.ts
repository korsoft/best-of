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
  public fullSubcategories:Array<any>=[];

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
        });
        this.fullSubcategories=this.subcategories;
      }
    });
  }

  setOption(option){
  

  }

  async filterList(evt) {
  
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.subcategories= this.fullSubcategories;
      return;
    }

    this.subcategories = this.fullSubcategories.filter(currentCat => {
      if (currentCat.subcat_name && searchTerm) {
        return (currentCat.subcat_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }
}
