import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Shop } from '../types';

interface MapProps {
  shop?: Shop;
  currentLocation?: [number, number];
}

export function Map({ shop, currentLocation }: MapProps) {
  return (
    <MapContainer
      center={shop?.location.coordinates || currentLocation || [0, 0]}
      zoom={18}
      className="h-[60vh] w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {shop && (
        <Marker position={shop.location.coordinates}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{shop.name}</h3>
              <p className="text-sm text-gray-600">Floor {shop.location.floor}</p>
            </div>
          </Popup>
        </Marker>
      )}
      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}