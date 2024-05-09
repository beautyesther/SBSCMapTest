import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapOptions, circle, icon, latLng, marker, polygon, tileLayer } from 'leaflet';
import {FormsModule} from "@angular/forms";
import {DecimalPipe, NgIf} from "@angular/common";
import * as turf from '@turf/turf';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeafletModule, FormsModule, NgIf, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  options: MapOptions | any
  layers: any[] = [];
  selectedCoordinates: any[] = []
  markers: any[] = [];
  manualLatitude: string = '';
  manualLongitude: string = '';

  constructor() {
  }

  ngOnInit() {
    this.options = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 18,
    };
  }

  ngAfterViewInit(): void {
    this.getUserLocation()
  }


  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((r) => this.showPosition(r), this.showError);
    } else {
      console.log('Error accessing geolocation')
    }
  }

  showPosition(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log('QWERTYUIOP', this.options)

    this.options.center = latLng(latitude,longitude)

    const userLocationMarker = marker(
      [latitude, longitude],
      {
        icon: icon({
          iconUrl: 'https://example.com/user-location-icon.png',
          iconSize: [38, 38]
        })
      }
    );
    this.layers.push(userLocationMarker);

    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  }

  showError(error: any) {
    switch (error.code) {
      case error.PERMISSION_DENIED: {
        console.log("User denied the request for Geolocation.");
        break;
      }
      case error.POSITION_UNAVAILABLE: {
        console.log("Location information is unavailable.");
        break;
      }
    }
  }

  onMapClick(event: any) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    this.selectedCoordinates.push({ lat, lng });

    console.log(`Clicked at latitude: ${lat}, longitude: ${lng}`);

    const markerIcon = marker(
      [lat, lng],
      {
        icon: icon({
          iconUrl: 'https://example.com/user-location-icon.png',
          iconSize: [38, 38]
        })
      }
    );
    this.layers.push(markerIcon);

    if (this.options && this.options.layers) {
      this.options.layers.push(markerIcon);
    }
  }

  addCoordinate() {
    const lat = parseFloat(this.manualLatitude);
    const lng = parseFloat(this.manualLongitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      this.selectedCoordinates.push({ lat, lng });
      this.manualLatitude = '';
      this.manualLongitude = '';
    }
  }

  clearCoordinates() {
    this.selectedCoordinates = [];
    this.layers = [];
  }

  calculateArea() {
    if (this.selectedCoordinates.length < 3) {
      return 0;
    }

    const coords = this.selectedCoordinates.map(coord => [coord.lng, coord.lat]);
    coords.push(coords[0]);

    const areaOfCoordinate = turf.polygon([coords]);
    const area = turf.area(areaOfCoordinate);
    return area;
  }
}
