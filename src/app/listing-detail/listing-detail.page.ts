import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';

import { DataService } from '../services/data.service';

import { ViewBeerComponent } from '../view-beer/view-beer.component';
import { ListingDetailMoreComponent } from '../listing-detail-more/listing-detail-more.component';

import { Listing } from '../interfaces/listing.interface';
import { BeerType } from '../interfaces/beer.type.interface';
import { Beer } from '../interfaces/beer.interface';
import { BusinessFeatures } from '../interfaces/business.features.interface';


@Component({
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.page.html',
  styleUrls: ['./listing-detail.page.scss'],
})
export class ListingDetailPage implements OnInit {

  private listingID: string;
  public listing: Listing;
  public objKeys = Object.keys;
  public beerTypes: BeerType[];
  public beerInventory: Beer[];
  public businessFeatures: BusinessFeatures;
  public expandAboutSection = false;
  public expandFeatureSection = false;
  public expandMissionSection = false;
  public expandHoursSection = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController
    ) {
    this.route.params.subscribe((params: {id: string}) => {
      console.log('Route params:', params);
      if (params && params.id) {
        // Listing ID retrieved via route params
        this.listingID = params.id;
        this.dataService.getListingByID(this.listingID).subscribe(listing => {
          this.listing = listing;
          console.log('Listing retrieved from server:', this.listing);
          this.importInventory();
        });
      } else {
        // Listing ID not known
      }
    });
  }

  ngOnInit() {
    this.importBeerTypes();
    this.importBusinessFeatures();
  }

  importInventory() {
    if (!this.beerInventory) {
      this.beerInventory = [];
    }
    if (this.listing.inventory && this.listing.inventory.beers) {
      this.listing.inventory.beers.forEach(item => {
        const beer$ = this.dataService.getBeer(item.linkedBeerID);
        const beerSub = beer$.subscribe((data: Beer) => {
          this.beerInventory.push(data);
          beerSub.unsubscribe();
        });
      });
      console.log('Beer inventory imported');
    }
  }

  importBeerTypes() {
    const typeSub = this.dataService.getBeerTypes().subscribe((data: BeerType[]) => {
      this.beerTypes = data;
      console.log('Beer types imported');
      typeSub.unsubscribe();
    });
  }

  importBusinessFeatures() {
    const featureSub = this.dataService.getBusinessFeatures().subscribe((data: BusinessFeatures) => {
      this.businessFeatures = data;
      console.log('Business features imported');
      featureSub.unsubscribe();
    });
  }

  filterFeatures() {
    const arr = this.objKeys(this.listing.businessFeatures).map(i => this.listing.businessFeatures[i]);
    const onlySelectedItems = arr.filter(i => {
      return i.selected;
    });
    const itemsToShow = onlySelectedItems.filter(i => {
      return i.id !== 'canDrink';
    });
    return itemsToShow;
  }

  toggleFeatureSection() {
    this.expandFeatureSection = !this.expandFeatureSection;
  }

  toggleAboutSection() {
    this.expandAboutSection = !this.expandAboutSection;
  }

  toggleMissionSection() {
    this.expandMissionSection = !this.expandMissionSection;
  }

  toggleHoursSection() {
    this.expandHoursSection = !this.expandHoursSection;
  }

  getIcon(feature: any) {
    const id: string = feature.id;
    switch (id) {
      case 'isBrewer': return 'beer';
      case 'isMicroBrewer': return 'beer';
      case 'canDrink': return 'pint';
      case 'canShop': return 'basket';
      case 'isCaskMasqueAccredited': return 'ribbon';
      case 'hasCAMRAMembership': return 'checkmark';
      case 'hasSIBAMembership': return 'checkmark';
      case 'hasCask': return 'pint';
      case 'hasKeg': return 'pint';
      case 'hasGarden': return 'flower';
      case 'hasSports': return 'football';
      case 'hasDisabledAccess': return 'checkmark';
      case 'isFamilyFriendly': return 'people';
      case 'isPetFriendly': return 'paw';
      case 'hasPoolTable': return 'keypad';
      case 'servesBreakfast': return 'restaurant';
      case 'servesLunch': return 'restaurant';
      case 'servesDinner': return 'restaurant';
      case 'servesSnacks': return 'restaurant';
      case 'hasLiveMusic': return 'musical-notes';
      case 'hasTours': return 'flag';
      case 'hasTaphouse': return 'beer';
      case 'isBookingRequired': return 'checkbox';
      case 'hasMeetTheBrewer': return 'contacts';
      case 'hasTastings': return 'thumbs-up';
      case 'hasTapTakeover': return 'key';
    }
    return 'star'; // Fallback
  }

  // --- TRANSFORM TIME FOR THE UI ---
  // Accepts a raw number input (from the ion range) and transforms it into a more meaningful time display.
  transformTimeForUI(input: number) {
    const corrected = input / 100;
    if (Number.isInteger(corrected)) {
      if (corrected < 10) {
        return '0' + corrected.toString() + ':00';
      }
      return corrected.toString() + ':00';
    }
    const split = corrected.toString().split('.');
    let firstPart = split[0];
    if (Number(firstPart) < 10) {
      firstPart = '0' + firstPart;
    }
    const decimalPart = split[1];
    if (decimalPart === '25') {
      return firstPart + ':' + '15';
    }
    if (decimalPart === '5') {
      return firstPart + ':' + '30';
    }
    if (decimalPart === '75') {
      return firstPart + ':' + '45';
    }
    return corrected;
  }

  getBeerTypeName(id: string) {
    const matchArr = this.beerTypes.filter(item => item.id === id);
    return matchArr[0].name;
  }

  async viewBeer(index: number) {
    try {
      const viewBeerModal = await this.modalCtrl.create({
        component: ViewBeerComponent,
        componentProps: {
          beer: this.beerInventory[index],
          beerTypes: this.beerTypes
        }
      });
      return await viewBeerModal.present();
    } catch (err) {
      console.error(err);
    }
  }

  async presentPopover(ev: any) {
    try {
      const popover = await this.popoverCtrl.create({
        component: ListingDetailMoreComponent,
        componentProps: {
          listing: this.listing
        },
        event: ev,
        animated: true
      });
      return await popover.present();
    } catch (err) {
      console.error(err);
    }
  }

}
