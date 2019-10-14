import { ListingPhoto } from '../interfaces/listing.photo.interface';

export interface Beer {
  id: string; // The beer's ID
  producer: string; // The producer's listing ID
  name: string; // Name of the beer
  abv: number; // % alcohol
  type: string; // The string ID of the associated beer type
  description?: string; // Brief description of the beer
  image?: ListingPhoto; // An image of the beer
  dateCreated?: Date; // The date this beer was first created
  dateUpdated?: Date; // The date this beer was last updated
}
