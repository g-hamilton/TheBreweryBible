import { Component, OnInit } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
const { Geolocation } = Plugins;
const { Storage } = Plugins;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor() {
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }

  async testSharing() {
    try {
      const shareRet = await Share.share({
        title: 'See cool stuff',
        text: 'Really awesome thing you need to see right meow',
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies'
      });
    } catch (err) {
      console.error('Cap sharing error:', err);
    }
  }

  async testLocation() {
    try {
      const options = {
        requireAltitude: false
      };
      const coordinates = await Geolocation.getCurrentPosition(options);
      console.log('Current', coordinates);
    } catch (err) {
      console.log('Cap geolocation error:', err);
    }
  }

  async resetOB() {
    Storage.set({
      key: 'onboardingComplete',
      value: 'false'
    });
  }
}
