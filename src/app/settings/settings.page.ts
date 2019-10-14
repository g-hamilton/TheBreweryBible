import { Component, OnInit } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private toastService: ToastService) { }

  ngOnInit() {
  }

  async resetOnboarding() {
    try {
      await Storage.set({
        key: 'onboardingComplete',
        value: 'false'
      });
      await this.toastService.presentToast('Welcome tour reset successfully!', 3000, 'success');
    } catch (err) {
      await this.toastService.presentToast(`Oops! ${err}`, 0, 'danger');
    }
  }

  async resetStorage() {
    try {
      await Storage.set({
        key: 'listings',
        value: null
      });
      await this.toastService.presentToast('Stored data reset successfully!', 3000, 'success');
    } catch (err) {
      await this.toastService.presentToast(`Oops! ${err}`, 0, 'danger');
    }
  }

}
