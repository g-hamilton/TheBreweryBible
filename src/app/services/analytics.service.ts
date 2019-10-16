import { Injectable } from '@angular/core';

import * as mixpanel from 'mixpanel-browser'; // https://www.npmjs.com/package/mixpanel-browser

/*
  Analytics provided by Mixpanel
  Using the Mixpanel Browser client side JS library
*/

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  init() {
    mixpanel.init('405dc69c3a60c398be64b64be6c791f9');
    console.log('Initialising Mixpanel analytics');
  }

  aliasUser(uid: string) {
    // Alias the user ID so Mixpanel associates the user's auth ID (Firebase auto assigned)
    // with their original cookie based Mixpanel distinctID (Mixpanel auto assigned).
    mixpanel.alias(uid);
  }

  identifyUser(uid: string) {
    mixpanel.identify(uid);
  }

  registerUser(method: string, accountType: 'user' | 'business') {
    mixpanel.track('Registered', {
      method,
      accountType
    });
  }

  signIn(uid: string, method: string, email: string) {
    mixpanel.track('Signed In', {
      uid,
      method,
      email
    });
  }

  signOut() {
    mixpanel.track('Signed Out');
  }

  viewPage(page: 'Home' | 'Onboarding' | 'Personalise' | 'Map') {
    mixpanel.track('Viewed Page', {
      page
    });
  }

  search(query: string) {
    mixpanel.track('Searched', {
      query
    });
  }

  quitOnboarding() {
    mixpanel.track('Quit Onboarding');
  }

  completeOnboarding() {
    mixpanel.track('Completed Onboarding');
  }

}
