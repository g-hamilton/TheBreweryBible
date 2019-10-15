import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Beer } from '../interfaces/beer.interface';
import { BeerType } from '../interfaces/beer.type.interface';



@Component({
  selector: 'app-view-beer',
  templateUrl: './view-beer.component.html',
  styleUrls: ['./view-beer.component.scss'],
})
export class ViewBeerComponent implements OnInit {

  @Input() beer: Beer;
  @Input() beerTypes: BeerType[];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  getBeerTypeName(id: string) {
    const matchArr = this.beerTypes.filter(item => item.id === id);
    return matchArr[0].name;
  }

  close() {
    this.modalCtrl.dismiss()
    .catch(err => console.error(err));
  }

}
