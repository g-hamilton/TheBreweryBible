import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  private map: mapboxgl.Map;

  constructor() {
    // Assign the Mapbox public access token.
    // Note: declaring type any below is a workaround for a known Mapbox types bug.
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiZ2hhbXRiYiIsImEiOiJjazFqZjcxZzAwMHdtM2xwbmJ6eDl5bXlyIn0.bxlA9W7-WsE9fcDc9Fo39Q';
  }

  ngOnInit() {
    this.buildMap();
  }

  async buildMap() {
    console.log('Building map...');
    const position = new mapboxgl.LngLat(10, 10);
    this.map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/ghamtbb/ck1klg9s202yq1cn7ddnky9o4', // https://studio.mapbox.com/styles
      center: position,
      zoom: 10,
      scrollZoom: false
    });
    // On map load
    this.map.on('load', (event) => {
      this.map.resize();
    });
  }

}
