import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyD1mN098mPYDZo-_A4h4K4Zn3eNNK3W6QA',
  authDomain: 'the-brewery-bible-4e1a5.firebaseapp.com',
  databaseURL: 'https://the-brewery-bible-4e1a5.firebaseio.com',
  projectId: 'the-brewery-bible-4e1a5',
  storageBucket: 'the-brewery-bible-4e1a5.appspot.com',
  messagingSenderId: '567785459282',
  appId: '1:567785459282:web:1862e555987a1342'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ swipeBackEnabled: false }), // Disable swipe to go back globally
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
