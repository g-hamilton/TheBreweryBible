import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { EmojiCountry } from '../interfaces/country.interface';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  @ViewChild(IonSlides, {static: true}) slides: IonSlides;

  public objKeys = Object.keys;
  public regions: any;
  private supportedCountries = ['GB']; // <-- Define countries currently supported in the app
  public countries = [] as EmojiCountry[];
  public selectedCountryCode: string;
  public selectedRegionId: string;

  constructor(
    private sideMenu: MenuController,
    private router: Router,
    private dataService: DataService
    ) { }

  ngOnInit() {
    try {
      this.sideMenu.enable(false); // Disable the sidemenu
      this.slides.lockSwipeToNext(true);
      this.importSupportedCountries();
    } catch (err) {
      console.error(err);
    }
  }

  importSupportedCountries() {
    // Import the full emoji country for each supported country code.
    this.supportedCountries.forEach(countryCode => {
      const country = this.dataService.getCountryByCode(countryCode);
      this.countries.push(country);
    });
  }

  onCountrySelect() {
    // Update the regions when a country is selected.
    if (this.selectedCountryCode) {
      this.regions = this.dataService.getCountryRegions(this.selectedCountryCode);
    }
  }

  saveRegion() {
    Storage.set({
      key: 'country',
      value: this.selectedCountryCode
    })
    .catch(err => console.error(err));
    Storage.set({
      key: 'region',
      value: this.selectedRegionId
    })
    .catch(err => console.error(err));
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
  }

  skip() {
    this.slides.slideTo(6);
  }

  next() {
    this.slides.slideNext();
  }

  exitOnboarding() {
    try {
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

  personaliseApp() {
    this.router.navigate(['/personalise']);
  }

}
