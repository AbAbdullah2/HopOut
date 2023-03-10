import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const API_KEY = 'AIzaSyDmxEIHuUqwqwW7gQU0MZh6T8z10Ktgahc';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 39.330420,
  lng: -76.618050
};

function Map({events}) {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={center} />
      </GoogleMap>
  ) : <></>
}

export default React.memo(Map)
