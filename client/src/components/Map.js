import React from 'react'
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Geocode from "react-geocode";
import EventMarker from './Marker';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;
Geocode.setApiKey(API_KEY);

function Map({events}) {

  const [currentLocation, setCurrentLocation] = React.useState({
    lat: 39.330420,
    lng: -76.618050
  });

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCurrentLocationParser);
    }
  }, []);

  function setCurrentLocationParser(position) {
    setCurrentLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }

  const [ libraries ] = React.useState(['places']);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [searchBox, setSearchBox] = React.useState(null);

  const loadSearchBox = (searchBox) => {setSearchBox(searchBox)};

  function onPlaceChanged() {
    try {
      setCurrentLocation({
        lat: searchBox.getPlace().geometry.location.lat(),
        lng: searchBox.getPlace().geometry.location.lng()
      });
    } catch (error) { }
  }

  const [locations, setLocations] = React.useState([]);

  function locationExists(arr, lat, lng) {
    return arr.some((location) => location.lat === lat && location.lng === lng);
  }  

  React.useEffect(() => {
    const geocodePromises = events.map((event) =>
      Geocode.fromAddress(
        event.location.address +
          " " +
          event.location.city +
          ", " +
          event.location.state +
          " " +
          event.location.zip
      )
    );
  
    Promise.all(geocodePromises).then((responses) => {
      const tempLocations = [];
  
      responses.forEach((response, index) => {
        const { lat, lng } = response.results[0].geometry.location;
        const event = events[index];
  
        if (!locationExists(tempLocations, lat, lng)) {
          tempLocations.push({ lat, lng, events: [event] });
        } else {
          const location = tempLocations.find(
            (location) => location.lat === lat && location.lng === lng
          );
          location.events.push(event);
        }
      });
  
      setLocations(tempLocations);
    });
  }, [events]);
  
  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerClassName='rounded-lg shadow-lg w-full h-screen'
        center={currentLocation}
        zoom={15}
        clickableIcons={false}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Autocomplete
          onPlaceChanged={
            onPlaceChanged
          }
          onLoad={loadSearchBox}
          className='text-center'
        >
          <input
            type="text"
            placeholder="Enter a location"
            className='box-border border border-solid rounded drop-shadow w-11/12 h-10 px-3 text-md overflow-ellipsis mt-4 font-semibold'
          />
        </Autocomplete>
        {locations.map((location) => {
          return (
            <EventMarker
              key={String(location.lat) + String(location.lng)}
              events={location.events}
              lat={location.lat}
              lng={location.lng}
            />
          );
        })}
      </GoogleMap>
    </div>
  ) : <></>
}

export default React.memo(Map)
