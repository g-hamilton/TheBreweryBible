export interface BeerType {
  id: string; // The id of this beer type
  name: string; // The name of this beer type
  linkedBeers?: string[]; // An array of beer IDs matching this type
  LinkedProducers?: string[]; // An array of producer IDs making this beer type
  abv?: string; // Typical ABV for type in following format: "4.1 - 5.7"
  description?: string; // Description of the beer type
}
