import { Component, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const { Keyboard } = Plugins;

import { Router, NavigationExtras } from '@angular/router';

import { ListingFiltersPage } from '../modals/listing-filters/listing-filters-page';
import { ListingSearchFiltersPage } from '../modals/listing-search-filters/listing-search-filters.page';

import { DataService } from '../services/data.service';
import { LoadingService } from '../services/loading.service';
import { AnalyticsService } from '../services/analytics.service';

import { AlgoliaListing } from '../interfaces/algolia.listing.interface';
import { ListingFilters } from '../interfaces/listing.filter.interface';
import { ToastService } from '../services/toast.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonContent, {static: true}) ionContent: IonContent;

  public listings: AlgoliaListing[];
  private listingFilters: ListingFilters;
  public paginationPage = -1;
  private countryCode: string;
  private regionId: string;
  private prefExperience: any;
  private prefBeerStyles: any;
  private prefCaskKeg: any;
  private lastLocation: any;
  private searchQuery: string;
  public searchActivated: boolean;
  public endOfSearchResults: boolean;
  private searchResultsSnapshot: AlgoliaListing[];
  private tempSearchFilters: ListingFilters;

  constructor(
    private dataService: DataService,
    private router: Router,
    private loadingService: LoadingService,
    private modalCtrl: ModalController,
    private analyticsService: AnalyticsService,
    private toastService: ToastService
    ) {
      this.initialiseListings();
  }

  ionViewWillEnter() {
    this.analyticsService.viewPage('Home');
  }

  async initialiseListings() {
    await this.loadingService.presentLoadingWithOptions('Loading...');
    this.listingFilters = this.dataService.getDefaultListingFilters();
    await this.checkPersonalisation();
    await this.updateListingFilters();
    await this.loadFilteredListings();
    this.loadingService.dismissLoading();
  }

  async checkPersonalisation() {
    const resCountry = await Storage.get({ key: 'country'});
    this.countryCode = resCountry.value;
    console.log('Retreived country code:', this.countryCode);
    const resRegion = await Storage.get({ key: 'region'});
    this.regionId = resRegion.value;
    console.log('Retreived region ID:', this.regionId);
    const resExperiences = await Storage.get({ key: 'favouriteExperiences'});
    this.prefExperience = JSON.parse(resExperiences.value);
    console.log('Retreived user preferences - Experiences:', this.prefExperience);
    const resBeerStyles = await Storage.get({ key: 'favouriteBeerStyles'});
    this.prefBeerStyles = JSON.parse(resBeerStyles.value);
    console.log('Retreived user preferences - Beer Styles:', this.prefBeerStyles);
    const resCaskKeg = await Storage.get({ key: 'caskOrKeg'});
    this.prefCaskKeg = JSON.parse(resCaskKeg.value);
    console.log('Retreived user preferences - Cask/Keg:', this.prefCaskKeg);
    const resLocation = await Storage.get({ key: 'lastLocation'});
    this.lastLocation = JSON.parse(resLocation.value);
    console.log('Retreived user last location:', this.lastLocation);
  }

  async updateListingFilters() {
    if (this.prefExperience) {
      // User has saved preferences from onboarding. Override defaults.
      for (const key of Object.keys(this.prefExperience)) {
        if (this.prefExperience[key].selected) {
          this.listingFilters.features[key].selected = true;
        } else {
          this.listingFilters.features[key].selected = false;
        }
      }
      /* TODO - Temp override to ensure we don't filter on tastings until we make tasting an inventory experience item */
      this.listingFilters.features.hasTastings.selected = false;
    }
    if (this.countryCode && this.regionId) {
      // User has saved country & region from onboarding. Override defaults.
      this.listingFilters.countryCode = this.countryCode;
      this.listingFilters.regionId = this.regionId;
    }
    console.log('Listing filters updated:', this.listingFilters);
  }

  storeFilters(data: ListingFilters) {
    Storage.set({
      key: 'favouriteExperiences',
      value: JSON.stringify(data.features)
    })
    .then(() => console.log('Favourite experiences saved successfully to storage'))
    .catch(err => console.error(err));
    Storage.set({
      key: 'country',
      value: data.countryCode
    })
    .then(() => console.log('Country saved successfully to storage'))
    .catch(err => console.error(err));
    Storage.set({
      key: 'region',
      value: data.regionId
    })
    .then(() => console.log('Region saved successfully to storage'))
    .catch(err => console.error(err));
  }

  async loadFilteredListings(event?: any) {
    /*
    Load a set of filtered listings into the component for view.
    Called by infinite scroll in the HTML template to fetch listings in batches using pagination.
    */
    this.paginationPage ++;
    const nextHits = await this.dataService.getFilteredListings(this.listingFilters, this.paginationPage);
    if (!nextHits) {
      this.toastService.presentToast('Unable to retrieve listings at this time. Please check your internet connection.', 0, 'danger');
      return;
    }
    if (nextHits.length < 20) {
      this.endOfSearchResults = true;
      console.log('End of results. Infinite scroll disabled.');
    }
    if (!this.listings) {
      this.listings = [];
    }
    this.listings = this.listings.concat(nextHits);
    if (event) {
      event.target.complete();
    }
  }

  viewListing(listingID: string) {
    this.router.navigate([`/listing/${listingID}`])
    .catch(err => console.error(err));
  }

  async viewFilters() {
    /*
    This method looks at whether or not a search is underway in order to launch the appropriate UI.
    In browse mode, the filters call for new, filtered results.
    In search mode, where the user has already received results from a search bar query, the filters
    call for filtering on the existng result set (they do not call for new results from the server).
    */
    if (this.searchActivated) {
      // Pop the modal to search within existing results.
      // tslint:disable-next-line: max-line-length
      const filters = this.tempSearchFilters ? this.dataService.deepObjClone(this.tempSearchFilters) : this.dataService.deepObjClone(this.listingFilters);
      const modalOpts: ModalOptions = {
        component: ListingSearchFiltersPage,
        componentProps: {
          filters
        }
      };
      try {
        const searchFiltersModal = await this.modalCtrl.create(modalOpts);
        searchFiltersModal.onWillDismiss()
        .then(res => {
          const data = res.data;
          if (data) {
            console.log('Search filters modal dismissed with data:', data);
            if (!this.dataService.deepObjCompare(this.listingFilters, data)) {
              console.log('Search filters have been modified.');
              this.filterWithinSearchResults(data);
              this.tempSearchFilters = data;
            }
          }
        });
        return await searchFiltersModal.present();
      } catch (err) {
        console.error(err);
      }
    } else {
      // Pop the modal to filter new results.
      const modalOpts: ModalOptions = {
        component: ListingFiltersPage,
        componentProps: {
          filters: this.dataService.deepObjClone(this.listingFilters)
        }
      };
      try {
        const filtersModal = await this.modalCtrl.create(modalOpts);
        filtersModal.onWillDismiss()
        .then(res => {
          const data = res.data;
          if (data) {
            console.log('Filters modal dismissed with data:', data);
            if (!this.dataService.deepObjCompare(this.listingFilters, data)) {
              console.log('Filters have been modified.');
              this.listingFilters = data;
              this.paginationPage = -1;
              this.listings = [];
              this.ionContent.scrollToTop();
              this.loadFilteredListings();
              this.storeFilters(data);
            }
          }
        });
        return await filtersModal.present();
      } catch (err) {
        console.error(err);
      }
    }
  }

  filterWithinSearchResults(filters: ListingFilters) {
    /*
    Filters the existing set of search results.
    Runs the filter on a snapshot of the search results & updates the listings, meaning new
    filters can be run again and again on any one search result snapshot.
    */
    if (this.searchResultsSnapshot && this.searchResultsSnapshot.length > 0) {
      const filtered = this.searchResultsSnapshot.filter(item => {
        for (const key of Object.keys(filters.features)) {
          if (item.businessFeatures[key]) {
            if (item.businessFeatures[key].selected && filters.features[key].selected) {
              return item;
            }
          }
        }
      });
      this.listings = filtered;
    } else {
      alert('No results to filter. Try a new search or change your browsing filters');
    }
  }

  onSeachbarChange() {
    this.paginationPage = -1;
  }

  async onSearch(ev: any) {
    Keyboard.hide() // Hide the keyboard as it's not done by the framework
    .catch(err => console.error(err));
    this.searchQuery = ev.target.value;
    if (this.searchQuery) {
      this.analyticsService.search(this.searchQuery);
      this.searchActivated = true;
      this.endOfSearchResults = false;
      this.paginationPage ++;
      const res = await this.dataService.search(this.paginationPage, this.searchQuery);
      this.ionContent.scrollToTop();
      this.listings = res;
      this.searchResultsSnapshot = res;
      if (res.length < 20) {
        this.endOfSearchResults = true;
        console.log('End of search results prior to infinite scroll being used.');
      }
    }
  }

  async loadSearchListings(event?: any) {
    /*
    Load a set of search result listings into the component for view.
    Called by infinite scroll in the HTML template to fetch listings in batches using pagination.
    */
    this.paginationPage ++;
    const nextHits = await this.dataService.search(this.paginationPage, this.searchQuery);
    if (event && nextHits.length < 20) {
      this.endOfSearchResults = true;
      console.log('End of search results. Infinite scroll will not be called again.');
    }
    if (!this.listings) {
      this.listings = [];
    }
    this.listings = this.listings.concat(nextHits);
    console.log('Event', event);
    event.target.complete();
  }

  onSearchCancel(event?: any) {
    if (this.searchActivated) {
      this.paginationPage = -1;
      this.listings = [];
      this.ionContent.scrollToTop();
      this.loadFilteredListings();
      this.searchActivated = false;
    }
  }

  viewMap() {
    const extras: NavigationExtras = {
      state: {
        listings: this.listings,
        filters: this.listingFilters
      }
    };
    this.router.navigate(['/map'], extras)
    .catch(err => console.error(err));
  }

}
