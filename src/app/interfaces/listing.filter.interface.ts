import { BusinessFeatures } from './business.features.interface';

export interface ListingFilters {
  features: BusinessFeatures;
  countryCode: string;
  regionId: string;
}
