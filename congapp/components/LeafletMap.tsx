"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { Park } from "@/lib/types";
import "leaflet/dist/leaflet.css";

function pin(label: string) {
  return L.divIcon({
    className: "access-pin",
    html: `<span class="access-pin-dot" aria-hidden="true">${label}</span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40],
  });
}

function FitToParks({ parks }: { parks: Park[] }) {
  const map = useMap();
  useEffect(() => {
    if (parks.length === 0) {
      map.setView([37.97, -121.35], 10);
      return;
    }
    const bounds = L.latLngBounds(parks.map((park) => [park.lat, park.lng]));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
  }, [map, parks]);
  return null;
}

export default function LeafletMap({ parks }: { parks: Park[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line">
      <MapContainer
        center={[37.97, -121.35]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-[32rem] w-full"
        aria-label="Map of matching parks in San Joaquin County"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToParks parks={parks} />
        {parks.map((park) => (
          <Marker key={park.id} position={[park.lat, park.lng]} icon={pin(park.town.slice(0, 1))} title={park.name}>
            <Popup>
              <strong>{park.name}</strong>
              <br />
              {park.town}
              <br />
              <Link href={`/parks/${park.slug}`}>View park details</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p className="border-t border-line bg-paper px-3 py-2 text-sm text-muted">
        Use the + and − buttons to zoom. Scrolling the page will not zoom the map. The list under the map has the same parks.
      </p>
    </div>
  );
}
