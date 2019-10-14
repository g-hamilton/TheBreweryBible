import { GeolocationPosition } from '@capacitor/core';

export interface GeolocationCustomResponse {
  success: boolean;
  position?: GeolocationPosition;
  error?: {
    message: string;
    errorMessage: string;
  };
}
