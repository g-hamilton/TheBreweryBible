import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { ToastService } from '../services/toast.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private toastService: ToastService,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
  }

  async resetOnboarding() {
    try {
      await Storage.set({
        key: 'onboardingV1.2Complete',
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

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'This will reset all saved data & personalisation settings. <strong>It cannot be undone!</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancelled');
          }
        }, {
          text: 'Reset',
          cssClass: 'danger',
          handler: () => {
            // Reset
            this.resetStorage();
          }
        }
      ]
    });
    await alert.present();
  }

}
