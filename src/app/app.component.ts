import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapOptions, circle, icon, latLng, marker, polygon, tileLayer } from 'leaflet';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeafletModule, FormsModule, NgIf],
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
          iconUrl: 'https://png.pngtree.com/element_our/sm/20180526/sm_5b09436fd0515.png',
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
}
