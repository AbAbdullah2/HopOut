import React from 'react'
import { GoogleMap, useJsApiLoader, Autocomplete} from '@react-google-maps/api';
import EventMarker from './Marker';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

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
          className=' box-border border border-solid border-transparent rounded drop-shadow w-1/5 h-10 px-3 text-md overflow-ellipsis mt-2'
        />
      </Autocomplete>

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
