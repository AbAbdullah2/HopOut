import { Marker } from "@react-google-maps/api";
import React from "react";

export default function EventMarker({ events, lat, lng, activeMarker, setActiveMarker }) {
  const markerPosition = { lat, lng };

  const isOpen = activeMarker && activeMarker.lat === markerPosition.lat && activeMarker.lng === markerPosition.lng;

  return (
    <Marker
      position={markerPosition}
      onClick={() => {
        setActiveMarker(isOpen ? null : markerPosition);
      }}
    />
  );
}
