import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { Plugins, GeolocationOptions } from '@capacitor/core';
const { Storage } = Plugins;
const { Geolocation } = Plugins;

import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';
import { AnalyticsService } from '../services/analytics.service';

import { GeolocationCustomResponse } from '../interfaces/geolocation.custom.response.interface';


@Component({
  selector: 'app-personalise',
  templateUrl: './personalise.page.html',
  styleUrls: ['./personalise.page.scss'],
})
export class PersonalisePage implements OnInit {

  @ViewChild(IonSlides, {static: true}) slides: IonSlides;

  public objKeys = Object.keys;

  public features = {
    isStockist: {id: 'isStockist', name: 'At home', selected: false},
    isBrewer: {id: 'isBrewer', name: 'Breweries', selected: false},
    hasTaphouse: {id: 'hasTaphouse', name: 'Tap rooms', selected: false},
    isBrewPub: {id: 'isBrewPub', name: 'Brew-pubs', selected: false},
    isPub: {id: 'isPub', name: 'Pubs & bars', selected: false},
    isPopup: {id: 'isPopup', name: 'Popup bars', selected: false},
    hasFestivals: {id: 'hasFestivals', name: 'Festivals', selected: false},
    hasTours: {id: 'hasTours', name: 'Brewery tours', selected: false},
    hasTastings: {id: 'hasTastings', name: 'Beer tastings', selected: false},
    hasMeetTheBrewer: {id: 'hasMeetTheBrewer', name: 'Meet the brewer events', selected: false}
  };

  public beerStyles = {
    '00': {id: '00', name: 'Dark Beer', selected: false},
    '01': {id: '01', name: 'Flavoured Beer', selected: false},
    '02': {id: '02', name: 'Lager', selected: false},
    '03': {id: '03', name: 'Pale Beer', selected: false},
    '04': {id: '04', name: 'IPA', selected: false},
    '05': {id: '05', name: 'Sour/Wild Beer', selected: false},
    '06': {id: '06', name: 'Speciality Beer', selected: false},
    '07': {id: '07', name: 'Stout & Porter', selected: false},
    '08': {id: '08', name: 'Wheat Beer', selected: false}
  };

  public caskKeg = {
    '00': {id: '00', name: 'Cask', selected: false},
    '01': {id: '01', name: 'Keg', selected: false},
    '02': {id: '02', name: 'Both!', selected: false}
  };

  constructor(
    private sideMenu: MenuController,
    private router: Router,
    private dataService: DataService,
    private platform: Platform,
    private toastService: ToastService,
    private analyticsService: AnalyticsService
    ) {
  }

  ngOnInit() {
    console.log('onInit Personalise page');
    this.sideMenu.enable(false) // Disable the sidemenu
    .catch(err => console.error(err));
  }

  ionViewWillEnter() {
    this.analyticsService.viewPage('Personalise');
  }

  skip() {
    this.slides.slideNext()
    .catch(err => console.error(err));
  }

  async onSlideDidChange() {
    try {
      const ai = await this.slides.getActiveIndex();
      if (ai === 3) {
        this.slides.lockSwipeToNext(true);
      } else if (ai === 4) {
        this.slides.lockSwipeToPrev(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  toggleBeerStyle(key: string) {
    this.beerStyles[key].selected = !this.beerStyles[key].selected;
  }

  toggleExperience(key: string) {
    this.features[key].selected = !this.features[key].selected;
  }

  toggleCaskKeg(key: string) {
    this.caskKeg[key].selected = !this.caskKeg[key].selected;
  }

  saveExperience() {
    Storage.set({
      key: 'favouriteExperiences',
      value: JSON.stringify(this.features)
    })
    .then(() => console.log('Experience data saved to storage'))
    .catch(err => alert(err));
    this.slides.slideNext();
  }

  saveStyles() {
    Storage.set({
      key: 'favouriteBeerStyles',
      value: JSON.stringify(this.beerStyles)
    })
    .then(() => console.log('Beer style data saved to storage'))
    .catch(err => alert(err));
    this.slides.slideNext();
  }

  saveCaskKeg() {
    Storage.set({
      key: 'caskOrKeg',
      value: JSON.stringify(this.caskKeg)
    })
    .then(() => console.log('Cask or keg data saved to storage'))
    .catch(err => alert(err));
    this.slides.slideNext();
  }

  async internalGetCurrentPosition() {
    /*
    A custom method that uses Geolocation.watchPosition rather than Geolocation.getCurrentPosition
    because it's much faster on iOS. A watch is setup and immediately stopped and altitude & high
    accuracy are not required so impact on battery is negligable. Permission is auto requested by
    the method which resolves with either a position (coords & timestamp) or an error (error is
    produced if user denies permission).
    */
    const options: GeolocationOptions = {
      requireAltitude: false,
      enableHighAccuracy: false
    };
    return new Promise<GeolocationCustomResponse>(resolve => {
      const id = Geolocation.watchPosition(options, (position, err) => {
        Geolocation.clearWatch({id});
        if (err) {
          resolve({success: false, error: err});
        }
        resolve({success: true, position});
      });
    });
  }

  async goLocal() {
    if (this.platform.is('ios')) {
      // iOS specific custom method for speed. See notes on the internalGetCurrentPosition method.
      const res: GeolocationCustomResponse = await this.internalGetCurrentPosition();
      if (res.success) {
        // Location received successfully
        this.toastService.presentToast('Location received successfully', 3000, 'success');
        Storage.set({
          key: 'lastLocation',
          value: JSON.stringify(res.position)
        })
        .catch(err => console.error(err));
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext();
      } else {
        // Location not received.
        this.toastService.presentToast(res.error.errorMessage, 0, 'danger');
        if (res.error.errorMessage === 'The operation couldn’t be completed. (kCLErrorDomain error 1.)') {
          // User has denied permission.
          this.slides.lockSwipeToNext(false);
          this.slides.slideNext();
        }
      }
    } else {
      try {
        const res = await Geolocation.getCurrentPosition();
        if (res) {
          this.toastService.presentToast('Location received successfully', 3000, 'success');
          // Location received successfully
          Storage.set({
            key: 'lastLocation',
            value: JSON.stringify(res)
          })
          .catch(err => console.error(err));
          this.slides.lockSwipeToNext(false);
          this.slides.slideNext();
        }
      } catch (err) {
        if (err.message === 'location unavailable') {
          // tslint:disable-next-line: max-line-length
          this.toastService.presentToast('Unable to retrieve your location at this time. Please check your device settings and allow location services to use this feature.', 0, 'danger');
        } else {
          this.toastService.presentToast(err.message, 0, 'danger');
        }
        this.slides.lockSwipeToNext(false);
        this.slides.slideNext();
      }
    }
  }

  onboardingComplete() {
    try {
      this.analyticsService.completeOnboarding();
      Storage.set({
        key: 'onboardingComplete',
        value: 'true'
      });
      this.sideMenu.enable(true); // re-enable the sidemenu
      this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
    }
  }

}
