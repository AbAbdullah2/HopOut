import { InfoWindow, Marker } from "@react-google-maps/api";
import React from "react";
import EventInfoBox from "./EventInfoBox.js";

export default function EventMarker({ events, lat, lng }) {

  const [open, setOpen] = React.useState(false);

  return ( 
    <Marker 
      position={{lat, lng}}
      onClick={() => {
        setOpen(!open);
      }}
    >
      {open && (
        <InfoWindow>
          <EventInfoBox events={events}/>
        </InfoWindow>
      )}
    </Marker>
  );
}