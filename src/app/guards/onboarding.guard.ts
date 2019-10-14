import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate  {

  constructor(private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const onboardingComplete = await Storage.get({
      key: 'onboardingComplete'
    });

    if (onboardingComplete.value !== 'true') {
      this.router.navigateByUrl('/onboarding');
    }

    return true;
  }
}
