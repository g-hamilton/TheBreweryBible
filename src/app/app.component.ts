import { Component } from '@angular/core';

import { Plugins, StatusBarStyle } from '@capacitor/core';
const { SplashScreen } = Plugins;
const { Share } = Plugins;
const { StatusBar } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor() {
    this.initialiseApp();
  }

  async initialiseApp() {
    try {
      // Go dark mode on the status bar (light text for dark bg)
      StatusBar.setStyle({
        style: StatusBarStyle.Dark
      });
      SplashScreen.hide();
    } catch (err) {
      console.error(err);
    }
  }

  async shareApp() {
    /*
    Brings up the device's native share dialogue.
    Shares via existng third party apps on the device.
    Uses custom messages & share url set here.
    */
    try {
      await Share.share({
        title: 'The Brewery Bible',
        text: 'Thought you might like this!',
        url: 'https://www.thebrewerybible.com/',
        dialogTitle: 'Share the app'
      });
    } catch (err) {
      console.error('Cap sharing error:', err);
    }
  }

}
