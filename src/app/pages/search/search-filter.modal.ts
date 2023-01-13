import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import SearchFilter from "src/app/interfaces/SearchFilter";

@Component({
    templateUrl: './search-filter.modal.html',
    styleUrls: ['./search.page.scss'],
  })
export class SearchFilterModal {


    @Input() filters: SearchFilter;

    constructor(private modalController: ModalController){}
  
    dismiss() {
      //console.log(this.filters);
      // using the injected ModalController this page
      // can "dismiss" itself and optionally pass back data
      this.modalController.dismiss({
        'dismissed': true,
        'filters':this.filters
      });
    }
  }