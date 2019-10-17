import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { ListingFilters } from '../../interfaces/listing.filter.interface';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-listing-search-filters',
  templateUrl: './listing-search-filters.page.html',
  styleUrls: ['./listing-search-filters.page.scss'],
})
export class ListingSearchFiltersPage implements OnInit {

  @Input() filters: ListingFilters;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private alertCtrl: AlertController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    console.log('Filters:', this.filters);
  }

  cancel() {
    this.modalCtrl.dismiss()
    .catch(err => console.error(err));
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

  reset() {
    // Pop a confirmation alert
    this.presentAlertConfirm();
  }

  applyFilters() {
    this.modalCtrl.dismiss(this.filters)
    .catch(err => console.error(err));
  }

}
