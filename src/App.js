import React, {useState} from 'react';
import Map, {Marker} from 'react-map-gl';
import { VscLocation } from 'react-icons/vsc';
import './App.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  // viewport state
  const [visualViewport, setVisualViewPort] = useState({
    longitude: 85.300140,
    latitude: 27.700769,
    zoom: 10
  });
  
  // traced location data
  const [tracedLocation, setTracedLocation] = useState({
    longitude: 0,
    latitude: 0,
    zoom:4
  })
  
  //track new location
  const trackNewLocation = (e) => {
    console.log(e)
    setTracedLocation({
      longitude: e.lngLat.lng,
      latitude:e.lngLat.lat
    })
  }
  
  return (
    <div className="App container-fluid">
      <Map
        mapboxAccessToken="pk.eyJ1IjoicGFyYmF0MTIzIiwiYSI6ImNsNTM4eXQ0ZTBodXczY3F4bXkyeHp4dmMifQ.bslOh187v-x19_cgKfa23Q"
        initialViewState={visualViewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={trackNewLocation}
      >
        <Marker
          longitude={tracedLocation.longitude}
          latitude={tracedLocation.latitude}
          draggable={true}
          offset={false}
        >
          <VscLocation style={{ fontSize: tracedLocation.zoom * 10, color: "red", marginTop:"-1620px", marginLeft:"505px"}} />
        </Marker>
      </Map>
    </div>
  );
}

export default App;
