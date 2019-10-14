import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController) {
    console.log('Hello LoadingService');
  }

  async presentLoadingWithOptions(message: string) {
    if (!this.loading) {
      try {
        const options: LoadingOptions = {
          spinner: 'bubbles',
          duration: 0,
          message,
          translucent: true,
          cssClass: 'global__custom-loading'
        };
        this.loading = await this.loadingController.create(options);
        return await this.loading.present();
      } catch (err) {
        console.error(err);
      }
    }
  }

  async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss()
      .catch(err => console.error(err));
    }
  }

}
