import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListingDetailPage } from './listing-detail.page';

// Modal & popover component imports
import { ViewBeerComponent } from '../view-beer/view-beer.component';
import { ListingDetailMoreComponent } from '../modals/listing-detail-more/listing-detail-more.component';

const routes: Routes = [
  {
    path: '',
    component: ListingDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListingDetailPage, ViewBeerComponent, ListingDetailMoreComponent],
  entryComponents: [ViewBeerComponent, ListingDetailMoreComponent]
})
export class ListingDetailPageModule {}
