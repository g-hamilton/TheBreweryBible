import { EmojiCountry } from '../interfaces/country.interface';
import { BusinessFeatures } from '../interfaces/business.features.interface';
import { BusinessHours } from '../interfaces/business.hours.interface';
import { ListingPhoto } from '../interfaces/listing.photo.interface';
import { Geocode } from '../interfaces/geocode.interface';
import { Inventory } from '../interfaces/business.inventory.interface';

export interface Listing {
    id: string;
    name: string;
    addressLine1: string;
    addressCity: string;
    addressCounty: string;
    addressPostcode: string;
    addressCountry: EmojiCountry;
    addressGeocode: Geocode | null;
    featurePhoto: ListingPhoto;
    photos: ListingPhoto[];
    email: string; // The login email
    aboutText: string;
    missionStatement: string;
    dateEstablished: string;
    businessFeatures: BusinessFeatures;
    businessHours?: BusinessHours;
    uid?: string;
    dateCreated?: Date; // Assigned server side on first save
    dateUpdated?: Date; // Assigned server side on subsequent saves
    phone?: string;
    publicEmail?: string; // Public facing content email (may be different to login email)
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    hlPerYear?: number;
    totalBeersProduced?: number;
    inventory?: Inventory;
    distanceFromUser?: number; // Physical distance from the user (always in metres)
    durationFromUser?: number; // Length of estimated travel time (in seconds)
}
