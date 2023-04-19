import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import SearchFilter from "src/app/interfaces/SearchFilter";

@Component({
    templateUrl: './search-filter.modal.html',
    styleUrls: ['./search.page.scss'],
  })
export class SearchFilterModal {


    @Input() lastSearchTerms:Array<any>;

    constructor(private modalController: ModalController){}

    public gotoTerm(term:string){
      console.log("term",term);
      
      this.dismiss(term);
    }
  
    dismiss(term: string = '') {
      //console.log(this.filters);
      // using the injected ModalController this page
      // can "dismiss" itself and optionally pass back data
      this.modalController.dismiss({
        'dismissed': true,
        'searchTextValue': term
      });
    }
  }