import Geocode from "react-geocode";
import { InfoWindow, Marker } from "@react-google-maps/api";
import React from "react";
import EventCard from "./MarkerBox";

const API_KEY = 'AIzaSyDmxEIHuUqwqwW7gQU0MZh6T8z10Ktgahc';
Geocode.setApiKey(API_KEY);

export default function EventMarker({ event }) {

  const [visible, setVisible] =React.useState(false);

  const [coordinates, setCoordinates] = React.useState({
    lat: 39.330420,
    lng: -76.618050
  });

  React.useEffect(() => {
    const fullAddress = event.location.address + " " + event.location.city + ", " + event.location.state + " " + event.location.zip;
    Geocode.fromAddress(fullAddress).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setCoordinates({ lat, lng });
    })
    .catch((error) => {
      console.error(error);
    });
  }, [event]);

  return ( 
    <Marker 
      position={coordinates}
      title={event.name}
      onClick={() => {
        setVisible(!visible);
      }}
    >
      {visible && 
      <InfoWindow position={coordinates}>
        <EventCard map={true} event={event} />
      </InfoWindow>
      }
    </Marker>
  );
}