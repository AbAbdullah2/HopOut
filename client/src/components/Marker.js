import { InfoWindow, Marker } from "@react-google-maps/api";
import React from "react";
import EventInfoBox from "./EventInfoBox.js";

export default function EventMarker({ events, lat, lng, activeInfoBox, setActiveInfoBox }) {

  return ( 
    <Marker 
      position={{lat, lng}}
      onClick={() => {
        if (activeInfoBox !== null) {
          activeInfoBox.instance.close();
          setActiveInfoBox(null);
        }
        setActiveInfoBox({id: String(lat) + String(lng), instance: null});
      }}
    >
      {activeInfoBox !== null ? (activeInfoBox.id === String(lat) + String(lng) && (
        <InfoWindow 
          onLoad={(thisInfoWindowInstance) => activeInfoBox.instance = thisInfoWindowInstance}
          onCloseClick={() => setActiveInfoBox(null)}
          position={{lat, lng}}
        >
          <EventInfoBox events={events}/>
        </InfoWindow>
      )) : null}
    </Marker>
  );
}