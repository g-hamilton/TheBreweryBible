import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import * as mapboxgl from 'mapbox-gl';

import { Plugins, GeolocationOptions } from '@capacitor/core';
const { Geolocation } = Plugins;
const { Storage } = Plugins;
const { Keyboard } = Plugins;

import { ToastService } from '../services/toast.service';
import { AnalyticsService } from '../services/analytics.service';

import { AlgoliaListing } from '../interfaces/algolia.listing.interface';
import { GeolocationCustomResponse } from '../interfaces/geolocation.custom.response.interface';
import { FeatureCollection } from 'geojson';

/*
  Using Mapbox-GL Javascript SDK for mapping.
  https://docs.mapbox.com/mapbox-gl-js/api/

  Using Capacitor Geolocation for device geolocation.
  https://capacitor.ionicframework.com/docs/apis/geolocation
*/

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  private map: mapboxgl.Map;
  private userPosition: mapboxgl.LngLat;
  public listings: AlgoliaListing[];
  private mapDataSource: any;
  private listingGeoJson: FeatureCollection;

  constructor(
    private platform: Platform,
    private toastService: ToastService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    // One time import of any listing data passed via navigationExtras (must call from constructor to catch in time)
    this.importListingData();
    // Assign the Mapbox public access token.
    // Note: declaring type any below is a workaround for a known Mapbox types bug.
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiZ2hhbXRiYiIsImEiOiJjazFqZjcxZzAwMHdtM2xwbmJ6eDl5bXlyIn0.bxlA9W7-WsE9fcDc9Fo39Q';
  }

  async ngOnInit() {
    console.log('Hello ngOnInit MapPage');
    await this.importUserLocation();
    await this.buildMap();
  }

  ionViewWillEnter() {
    this.analyticsService.viewPage('Map');
  }

  async importUserLocation() {
    const res = await Storage.get({ key: 'lastLocation' });
    const lastLocation: GeolocationCustomResponse = JSON.parse(res.value);
    console.log('Imported user location:', lastLocation);
    if (lastLocation && lastLocation.position) {
      this.userPosition = new mapboxgl.LngLat(lastLocation.position.coords.longitude, lastLocation.position.coords.latitude);
    }
  }

  async buildMap() {
    console.log('Building map...');
    const position = this.userPosition ? this.userPosition : await this.getUserPositionOrDefault();
    this.map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/ghamtbb/ck1klg9s202yq1cn7ddnky9o4', // https://studio.mapbox.com/styles
      center: position,
      zoom: 10,
      scrollZoom: false
    });

    // On map load
    this.map.on('load', (event) => {

      // Immediately resize the map to fit the container (Ionic 4 requirement)
      this.map.resize();

      // Register a data source for 'listings' data on the map
      this.map.addSource('listings', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true, // If 'true', GL-JS will add the 'point_count' property to the source data.
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 180 // Radius of each cluster when clustering points (defaults to 50)
      });

      // Get source data
      this.mapDataSource = this.map.getSource('listings');

      // Set map source data
      this.mapDataSource.setData(this.listingGeoJson);

      // Create a layer to display clusters
      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 3
        //   * Yellow, 30px circles when point count is between 3 and 10
        //   * Pink, 40px circles when point count is greater than or equal to 10
        'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        3,
        '#f1f075',
        10,
        '#f28cb1'
        ],
        'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        3,
        30,
        10,
        40
        ]
        }
      });

      // Create a layer to display cluster counts
      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'listings',
        filter: ['has', 'point_count'],
        layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
      });

      // Create map layer to display unclustered marker data
      this.map.addLayer({
        id: 'listings',
        source: 'listings',
        interactive: true, // Must be set true for 'on click' listener
        filter: ['!', ['has', 'point_count']], // Display when unclustered
        type: 'symbol',
        layout: {
          'text-field': '{title}',
          'text-size': 22,
          'text-transform': 'uppercase',
          'icon-image': 'beer-15',
          'icon-size': 1.4,
          'text-offset': [0, 1.6]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      });

    });

    // When a click event occurs on a feature in the listings layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    this.map.on('click', 'listings', (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const listingID = e.features[0].properties.id;
      const image = e.features[0].properties.img;
      const title = e.features[0].properties.title;
      const city = e.features[0].properties.city;
      const county = e.features[0].properties.county;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Prepare the popup HTML elements
      const popupInnerContent = document.createElement('div');
      popupInnerContent.setAttribute('id', 'popup-inner-content');
      const popupImg = document.createElement('div');
      popupImg.setAttribute('id', 'popup-img');
      popupImg.setAttribute('style', `background-image: url('${image}');`);
      popupInnerContent.appendChild(popupImg);
      const popupBtn = document.createElement('button');
      popupBtn.setAttribute('id', 'popup-view-detail-button');
      popupBtn.textContent = 'View';
      // Add a click listener to the custom popup button
      popupBtn.addEventListener('click', () => {
        console.log('Popup button clicked. Listing ID:', listingID);
        this.router.navigate([`listing/${listingID}`]);
      });
      popupInnerContent.appendChild(popupBtn);

      // Pan to marker location
      this.map.panTo(coordinates);

      // Set the popup
      new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(popupInnerContent)
      .addTo(this.map);

    });
  }

  async getUserPositionOrDefault() {
    const res = await this.getUserPosition();
    if (res.success && res) {
      // Geolocation returned a position
      return new mapboxgl.LngLat(res.position.coords.longitude, res.position.coords.latitude);
    } else {
      // Geolocation not authorised or unable to return a position
      if (res.error.message === 'location unavailable') {
        // tslint:disable-next-line: max-line-length
        this.toastService.presentToast('Unable to retrieve your location at this time. Please check your device settings and allow location services to use this feature.', 0, 'danger');
      } else {
        this.toastService.presentToast(res.error.message, 0, 'danger');
      }
      return new mapboxgl.LngLat(-0.127758, 51.507351); // Return a default lngLat position
    }
  }

  async getUserPosition() {
    if (this.platform.is('ios')) {
      // iOS specific custom method for speed. See notes on the internalGetCurrentPosition method.
      return await this.internalGetCurrentPosition();
    } else {
      // Non iOS method to retrieve location.
      try {
        const res = await Geolocation.getCurrentPosition();
        return { success: true, position: res } as GeolocationCustomResponse;
      } catch (err) {
        return { success: false, error: err.message } as GeolocationCustomResponse;
      }
    }
  }

  async internalGetCurrentPosition() {
    /*
    A custom method that uses Geolocation.watchPosition rather than Geolocation.getCurrentPosition
    because it's much faster on iOS. A watch is setup and immediately stopped and altitude & high
    accuracy are not required so impact on battery is negligable. Permission is auto requested by
    the method which resolves with either a position (coords & timestamp) or an error (error is
    produced if user denies permission).
    */
    const options: GeolocationOptions = {
      requireAltitude: false,
      enableHighAccuracy: false
    };
    return new Promise<GeolocationCustomResponse>(resolve => {
      const id = Geolocation.watchPosition(options, (position, err) => {
        Geolocation.clearWatch({id});
        if (err) {
          resolve({success: false, error: err});
        }
        resolve({success: true, position});
      });
    });
  }

  importListingData() {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras) {
      this.listings = nav.extras.state.listings;
      console.log('Imported listings:', this.listings);
      if (this.listings) {
        // Convert fetched listings into listing geoJSON format for the map
        this.convertListingsToGeoJson();
      }
    }
  }

  convertListingsToGeoJson() {
    const featureCollection = {
      type: 'FeatureCollection',
      features: []
    } as FeatureCollection;
    this.listings.forEach(listing => {
      featureCollection.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [listing.addressGeocode.lng, listing.addressGeocode.lat] // Note: lng/lat NOT lat/lng
        },
        properties: {
          id: listing.objectID,
          img: listing.featurePhotoUrl,
          title: listing.name,
          city: listing.addressCity,
          county: listing.addressCounty
        }
      });
    });
    this.listingGeoJson = featureCollection;
    console.log('Converted listing GeoJSON Data:', this.listingGeoJson);
  }

  onSeachbarChange() {
    //
  }

  async onSearch(event) {
    /*
    Hide the keyboard and call to resize the map after the 550ms keyboard close transition
    to ensure the map fills the full view again.
    */
    await Keyboard.hide(); // Note: Resolves before the transition actually completes!
    setTimeout(() => {
      this.map.resize();
    }, 550);
  }

  onSearchCancel(event) {
    //
  }

  viewMapFilters() {
    alert('Click works!');
  }

}
