import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import * as algoliasearch from 'algoliasearch';

import { Observable } from 'rxjs-compat';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/first';

import * as _ from 'lodash';

import * as countryFlagEmoji from 'country-flag-emoji'; // https://github.com/risan/country-flag-emoji

import { Listing } from '../interfaces/listing.interface';
import { BusinessFeatures } from '../interfaces/business.features.interface';
import { Beer } from '../interfaces/beer.interface';
import { BeerType } from '../interfaces/beer.type.interface';
import { AlgoliaListing } from '../interfaces/algolia.listing.interface';
import { EmojiCountry } from '../interfaces/country.interface';
import { ListingFilters } from '../interfaces/listing.filter.interface';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private searchClient: algoliasearch.Client;

  constructor(private db: AngularFireDatabase) {
    console.log('Hello DataProvider');
    this.searchClient = algoliasearch('RAZSKA6DJ7', '39e68d7bc997f1e8a1918da2121a5ad9', { protocol: 'https:' });
  }

  async getFilteredListings(filters: ListingFilters, page: number) {
    /*
    Queries Algolia.
    https://www.algolia.com/doc/api-reference/api-parameters/
    */
    try {
      console.log('Requesting page:', page);
      const searchIndex = this.searchClient.initIndex('prod_LISTINGS');
      const searchParams: algoliasearch.QueryParameters = {
        filters: this.buildAlgoliaFilters(filters),
        hitsPerPage: 20,
        page
      };
      const res = await searchIndex.search(searchParams);
      console.log('Algolia search hit results:', res.hits);
      return res.hits as AlgoliaListing[];
    } catch (err) {
      console.error(err);
    }
  }

  buildAlgoliaFilters(filters: ListingFilters) {
    /*
    Builds and returns a 'filters' query string using Algolia rules.
    https://www.algolia.com/doc/api-reference/api-parameters/filters/
    */
    const geoArray = [];
    // Geographical filters
    geoArray.push(`addressCountry:${filters.countryCode}`);
    geoArray.push(`addressRegion:${filters.regionId}`);
    const builtGeoString = geoArray.join(' AND ');
    // Feature filters
    const featureArray = [];
    for (const key of Object.keys(filters.features)) {
      if (filters.features[key].selected) {
        featureArray.push(`businessFeatures.${key}.selected=1`);
      }
    }
    // Build query string
    const builtFeatureString = featureArray.join(' OR ');
    const queryString = `${builtGeoString} AND ${builtFeatureString}`;
    console.log('Algolia query string constructed:', queryString);
    return queryString;
  }

  getAllListings() {
    /*
    Caution! Large data packet!
    Goes straight to Firebase.
    Returns an observable list of ALL public listings.
    */
    try {
      // Fetch an observable AngularFire database snapshot
      const afList$ = this.db.list<any>(`/listings`).snapshotChanges();
      // Map the AF list to an observable list of objects
      const listings$: Observable<Listing[]> = afList$.pipe(map(listings => {
        return listings.map(listing => ({
        ...listing.payload.val()
        }));
      }));
      // Return the observable list of objects
      return listings$;
    } catch (err) {
      console.error(err);
    }
  }

  async search(page: number, query: string) {
    /*
    Queries Algolia.
    https://www.algolia.com/doc/api-reference/api-parameters/
    Possibility to run a search query on multiple indices.
    */
    try {
      console.log(`Searching query: ${query} - Requesting page: ${page}`);
      const listingsIndex = this.searchClient.initIndex('prod_LISTINGS');
      const searchParams: algoliasearch.QueryParameters = {
        query,
        // filters: this.buildAlgoliaFilters(filters),
        hitsPerPage: 20,
        page
      };
      const res = await listingsIndex.search(searchParams);
      console.log('Algolia search hit results:', res.hits);
      return res.hits as AlgoliaListing[];
    } catch (err) {
      console.error(err);
    }
  }

  getListingByID(listingID: string): Observable<Listing> {
    // Returns a single listing & completes the observable so the caller can 'await' the unwrapped object.
    return this.db.object<Listing>(`listings/${listingID}`).valueChanges().first();
  }

  getBusinessFeatures(): Observable<BusinessFeatures> {
    // Returns a business features object & completes the observable so the caller can 'await' the unwrapped object.
    return this.db.object<BusinessFeatures>(`businessFeatures`).valueChanges().first();
  }

  getDefaultListingFilters() {
    // const features = await this.getBusinessFeatures().toPromise();
    const features = this.returnLocalBusinessFeatures();
    features.isBrewer.selected = true;
    return {
      features,
      countryCode: 'GB',
      regionId: 'md'
    } as ListingFilters;
  }

  getBeer(beerID: string): Observable<Beer> {
    return this.db.object<Beer>(`beers/${beerID}`).valueChanges();
  }

  getBeerTypes(): Observable<BeerType[]> {
    /*
    Returns an observable list of all beer types.
    */
    try {
      // Fetch an observable AngularFire database snapshot
      const afList$ = this.db.list<any>(`/beertypes`).snapshotChanges();
      // Map the AF list to an observable list of objects
      const types$: Observable<BeerType[]> = afList$.pipe(map(types => {
        return types.map(type => ({
        ...type.payload.val()
        }));
      }));
      // Return the observable list of objects
      return types$;
    } catch (err) {
      console.error(err);
    }
  }

  getCountryByCode(countryCode: string) {
    // Return an emoji country matching the defined country code.
    const country: EmojiCountry = countryFlagEmoji.get(countryCode);
    return country;
  }

  getCountryRegions(countryCode: string) {
    // Returns a locally defined (no http call) regions object for a specific country (by country code)
    const regions = this.returnLocalRegions();
    return regions[countryCode];
  }

  deepObjClone(obj) {
    // Returns a deep clone of an object using Lodash
    return _.cloneDeep(obj);
  }

  deepObjCompare(objA, objB) {
    // Deep comparison of objects using Lodash
    if (!_.isEqual(objA, objB)) {
      // Objects don't match.
      return false;
    }
    // Objects match.
    return true;
  }

  private returnLocalBusinessFeatures() {
    return {
      isBrewer: {id: 'isBrewer', selected: false},
      isMicroBrewer: {id: 'isMicroBrewer', selected: false},
      isBrewPub: {id: 'isBrewPub', selected: false},
      isPub: {id: 'isPub', selected: false},
      isPopup: {id: 'isPopup', selected: false},
      isStockist: {id: 'isStockist', selected: false},
      canDrink: {id: 'canDrink', selected: false},
      canShop: {id: 'canShop', selected: false},
      hasGarden: {id: 'hasGarden', selected: false},
      hasSports: {id: 'hasSports', selected: false},
      hasDisabledAccess: {id: 'hasDisabledAccess', selected: false},
      isCaskMasqueAccredited: {id: 'isCaskMasqueAccredited', selected: false},
      isFamilyFriendly: {id: 'isFamilyFriendly', selected: false},
      isPetFriendly: {id: 'isPetFriendly', selected: false},
      hasPoolTable: {id: 'hasPoolTable', selected: false},
      servesBreakfast: {id: 'servesBreakfast', selected: false},
      servesLunch: {id: 'servesLunch', selected: false},
      servesDinner: {id: 'servesDinner', selected: false},
      servesSnacks: {id: 'servesSnacks', selected: false},
      hasLiveMusic: {id: 'hasLiveMusic', selected: false},
      hasTours: {id: 'hasTours', selected: false},
      hasTastings: {id: 'hasTastings', selected: false},
      hasFestivals: {id: 'hasFestivals', selected: false},
      hasMeetTheBrewer: {id: 'hasMeetTheBrewer', selected: false},
      hasTapTakeover: {id: 'hasTapTakeover', selected: false},
      hasTaphouse: {id: 'hasTaphouse', selected: false},
      isBookingRequired: {id: 'isBookingRequired', selected: false},
      hasCask: {id: 'hasCask', selected: false},
      hasKeg: {id: 'hasKeg', selected: false},
      hasSIBAMembership: {id: 'hasSIBAMembership', selected: false},
      hasCAMRAMembership: {id: 'hasCAMRAMembership', selected: false}
    } as BusinessFeatures;
  }

  private returnLocalRegions() {
    return {
      GB: {
        swe: {id: 'sw', name: 'South West'},
        mid: {id: 'md', name: 'Midlands'},
        lon: {id: 'lon', name: 'London'},
        sea: {id: 'sea', name: 'South East'},
        sco: {id: 'sco', name: 'Scotland'},
        wal: {id: 'wal', name: 'Wales'},
        nwe: {id: 'nwe', name: 'North West'},
        nea: {id: 'nea', name: 'North East'},
        eas: {id: 'eas', name: 'East'}
      }
    };
  }
}
