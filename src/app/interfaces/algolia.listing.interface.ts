import { BusinessFeatures } from './business.features.interface';
import { Geocode } from './geocode.interface';

export interface AlgoliaListing {
  name: string; // My Brewery
  addressCity: string; // Exeter
  addressCounty: string; // Devon
  addressCountry: string; // GB
  addressGeocode: Geocode; // {lat: 000, lng: 000}
  businessFeatures: BusinessFeatures;
  objectID: string; // Copy of the listing ID for Algolia (Required Algolia property)
  email: string;
  uid: string; // Listing owner's UID
  featurePhotoUrl: string; // Hosted image url
}
