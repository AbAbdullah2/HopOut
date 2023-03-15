import Geocode from "react-geocode";
import { Marker } from "@react-google-maps/api";
import React from "react";

const API_KEY = 'AIzaSyDmxEIHuUqwqwW7gQU0MZh6T8z10Ktgahc';
Geocode.setApiKey(API_KEY);

export default function EventMarker({ event }) {

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
    />
  );
}