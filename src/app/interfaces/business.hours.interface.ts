export interface BusinessHours {
  monday: {lower: number, upper: number, closed: boolean};
  tuesday: {lower: number, upper: number, closed: boolean};
  wednesday: {lower: number, upper: number, closed: boolean};
  thursday: {lower: number, upper: number, closed: boolean};
  friday: {lower: number, upper: number, closed: boolean};
  saturday: {lower: number, upper: number, closed: boolean};
  sunday: {lower: number, upper: number, closed: boolean};
}
