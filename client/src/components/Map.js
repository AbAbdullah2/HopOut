import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import EventMarker from './Marker';

const API_KEY = 'AIzaSyDmxEIHuUqwqwW7gQU0MZh6T8z10Ktgahc';

function Map({events}) {

  const [currentLocation, setCurrentLocation] = React.useState({
    lat: 39.330420,
    lng: -76.618050
  });

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCurrentLocationParser);
    }
  }, [events]);

  function setCurrentLocationParser(position) {
    setCurrentLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  });

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerClassName='rounded-lg shadow-lg w-full h-screen'
        center={currentLocation}
        zoom={15}
      >
        {events.map((event) => {
          return (
            <EventMarker
              key={event._id}
              event={event}
            />
          );
        })}
      </GoogleMap>
    </div>
  ) : <></>
}

export default React.memo(Map)
