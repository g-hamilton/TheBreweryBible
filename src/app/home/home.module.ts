import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ListingFiltersPage } from '../listing-filters/listing-filters-page';
import { ListingSearchFiltersPage } from '../listing-search-filters/listing-search-filters.page';
import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    DirectivesModule
  ],
  declarations: [
    HomePage,
    ListingFiltersPage,
    ListingSearchFiltersPage
  ],
  entryComponents: [
    ListingFiltersPage,
    ListingSearchFiltersPage
  ]
})
export class HomePageModule {}
