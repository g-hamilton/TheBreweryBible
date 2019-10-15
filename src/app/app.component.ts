import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { Plugins, StatusBarStyle, BrowserOpenOptions } from '@capacitor/core';
const { SplashScreen } = Plugins;
const { Share } = Plugins;
const { StatusBar } = Plugins;
const { Browser } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private menuCtrl: MenuController
  ) {
    this.initialiseApp();
  }

  ngOnInit() {
    this.menuCtrl.swipeGesture(false); // Disable swipe to open the side menu
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

  getTheBook() {
    const options: BrowserOpenOptions = {
      url: 'https://www.thebrewerybible.com/shop',
      toolbarColor: '#000000'
    };
    Browser.open(options)
    .catch(err => console.error(err));
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
