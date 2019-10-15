import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Plugins, BrowserOpenOptions } from '@capacitor/core';
const { Browser } = Plugins;


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  team() {
    this.router.navigate(['team']);
  }

  legal() {
    const options: BrowserOpenOptions = {
      url: 'https://www.thebrewerybible.com/the-legal-stuff',
      toolbarColor: '#000000'
    };
    Browser.open(options)
    .catch(err => console.error(err));
  }

}
