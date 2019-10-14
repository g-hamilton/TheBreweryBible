export interface Inventory {
  beers?: {
    linkedBeerID: string, // Link to the beer by it's ID
    drinkOnSite: boolean, // Can people drink this beer on site at this listing location?
    takeAway: boolean, // Can people buy and takeaway from this listing location?
    exclusive: boolean // Is this beer only available at the listing location?
  }[]; // An array of linked beers with supporting data
  experiences?: any[]; // An array of experiences
}
