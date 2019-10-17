import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { DirectivesModule } from '../directives/directives.module';
import { ListingFiltersPage } from '../modals/listing-filters/listing-filters-page';
import { ListingSearchFiltersPage } from '../modals/listing-search-filters/listing-search-filters.page';


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
    DirectivesModule,
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
