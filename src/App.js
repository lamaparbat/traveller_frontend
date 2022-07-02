import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { VscLocation } from 'react-icons/vsc';
import ProfileBtn from '../src/Component/Modal.js';
import { ToastContainer, toast } from 'react-toastify';
import './App.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // viewport state
  const [visualViewport, setVisualViewPort] = useState({
    longitude: 85.300140,
    latitude: 27.700769,
    zoom: 10
  });

  // on tracing new location
  const [isNewLocationTraced, setNewLocationTraced] = useState(false);

  // traced location data
  const [tracedLocation, setTracedLocation] = useState({
    username: "",
    title: "",
    desc: "",
    longitude: visualViewport.longitude,
    latitude: visualViewport.latitude,
    zoom: 4
  })


  //track new location
  var throttle = false;
  const trackNewLocation = (e) => {
    // if the call is already in callstack queue then denied the request
    if (throttle)
      return;
    
    setTimeout(() => {   
      console.log("hacker")
      try {
        if (Object.keys(JSON.parse(localStorage.getItem("traveller"))).length > 0) {
          setNewLocationTraced(true)
          setTracedLocation({
            ...tracedLocation,
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat
          });
        }
      } catch (error) {
        toast.error("Please login to mark the location !!")
      }
      
      throttle = true;
    }, 3000)
  }


  // save pinned location
  const savePin = () => {
    console.log(tracedLocation)

    setNewLocationTraced(false)
  }

  return (
    <div className="App container-fluid">
      <ProfileBtn />
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
        >
          <VscLocation
            style={{
              fontSize: tracedLocation.zoom * 10,
              color: "red",
              marginTop: "-1640px",
              marginLeft: "430px"
            }} />
        </Marker>

        {
          isNewLocationTraced && <Popup
            longitude={tracedLocation.longitude}
            latitude={tracedLocation.latitude}
            anchor="left"
            style={{
              marginTop: "-930px",
              marginLeft: "20px"
            }}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewLocationTraced(false)}
          >
            <div className='form p-2 pt-4 d-flex flex-column bg-info rounded-1'>
              <input
                type="text"
                placeholder='Enter location title'
                className='form-control py-1 mt-4 my-2 shadow-none border-danger text-danger'
                onChange={(e) => setTracedLocation({ ...tracedLocation, title: e.target.value })}
              />
              <input
                type="text"
                placeholder='Enter location description'
                className='form-control py-1 mb-2 shadow-none border-danger text-danger'
                value={tracedLocation.desc}
                onChange={(e) => setTracedLocation({ ...tracedLocation, desc: e.target.value })}
              />
              <button className='btn btn-danger py-1 mb-2' onClick={savePin}>Save</button>
            </div>
          </Popup>
        }
      </Map>
      <ToastContainer />
    </div>
  );
}

export default App;
