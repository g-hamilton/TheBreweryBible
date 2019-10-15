import { Component, OnInit, Input } from '@angular/core';

import { ModalController, AlertController } from '@ionic/angular';

import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';

import { ListingFilters } from '../interfaces/listing.filter.interface';
import { EmojiCountry } from '../interfaces/country.interface';


@Component({
  selector: 'app-listing-filters',
  templateUrl: './listing-filters-page.html',
  styleUrls: ['./listing-filters-page.scss'],
})
export class ListingFiltersPage implements OnInit {

  @Input() filters: ListingFilters;

  public objKeys = Object.keys;
  public regions: any;
  private supportedCountries = ['GB']; // <-- Define countries currently supported in the app
  public countries = [] as EmojiCountry[];

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private alertCtrl: AlertController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    console.log('Hello ListingFiltersPage');
    console.log('Filters:', this.filters);
    this.importSupportedCountries();
    this.importCountryRegions();
  }

  importSupportedCountries() {
    // Import the full emoji country for each supported country code.
    this.supportedCountries.forEach(countryCode => {
      const country = this.dataService.getCountryByCode(countryCode);
      this.countries.push(country);
    });
  }

  importCountryRegions() {
    // Import the associated regions for the previously selected country on modal load.
    this.regions = this.dataService.getCountryRegions(this.filters.countryCode);
  }

  onCountrySelect() {
    // Update the regions when a country is selected.
    if (this.filters.countryCode) {
      this.regions = this.dataService.getCountryRegions(this.filters.countryCode);
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'This will reset all filters to the default settings.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancelled');
          }
        }, {
          text: 'Reset',
          handler: () => {
            // Reset filters to default values
            this.filters = this.dataService.getDefaultListingFilters();
            this.toastService.presentToast('Filters reset successfully', 3000, 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  cancel() {
    this.modalCtrl.dismiss()
    .catch(err => console.error(err));
  }

  reset() {
    // Pop a confirmation alert
    this.presentAlertConfirm();
  }

  applyFilters() {
    this.modalCtrl.dismiss(this.filters)
    .catch(err => console.error(err));
  }

}
