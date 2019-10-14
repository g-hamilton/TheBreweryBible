export interface ListingPhoto {
  id: string; // This photo's ID
  name: string;
  img: string; // Base64 DataUrl string
  associatedItemID: string; // The item (listing / beer) that this photo is associated with
}
