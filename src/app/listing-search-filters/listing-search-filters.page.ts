import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ListingFilters } from '../interfaces/listing.filter.interface';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-listing-search-filters',
  templateUrl: './listing-search-filters.page.html',
  styleUrls: ['./listing-search-filters.page.scss'],
})
export class ListingSearchFiltersPage implements OnInit {

  @Input() filters: ListingFilters;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    console.log('Filters:', this.filters);
  }

  cancel() {
    this.modalCtrl.dismiss()
    .catch(err => console.error(err));
  }

  reset() {
    // Reset filters to default values
    this.filters = this.dataService.getDefaultListingFilters();
  }

  applyFilters() {
    this.modalCtrl.dismiss(this.filters)
    .catch(err => console.error(err));
  }

}
