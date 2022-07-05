import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, Layer, Source } from 'react-map-gl';
import { VscLocation } from 'react-icons/vsc';
import ProfileBtn from '../src/Component/Modal.js';
import { ToastContainer, toast } from 'react-toastify';
import './App.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

function App() {
  //refresh on each push
  const [refresh, setRefresh] = useState(false);

  // pinnedData
  const [pinnedData, setPinnedData] = useState([]);

  // form popup state
  const [isFormVisible, setFormVisible] = useState(false);

  // viewport state
  const [viewport, setVisualViewPort] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 10
  });

  // on tracing new location
  const [isNewLocationTraced, setNewLocationTraced] = useState(false);

  // get all the pinned location data
  const fetchPinnedData = async () => {
    try {
      const res = await axios.create({
        baseURL: "http://localhost:8000",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("traveller")).token.access_token}`
        }
      }).get("/traveller/getPinnedData");

      setPinnedData(res.data)
    } catch (error) {
      try {
        if (error.response.data === "Token not found in server !!")
          localStorage.clear();
      } catch (error) {
        return;
      }
    }
  }

  useEffect(() => {
    fetchPinnedData()
  }, []);


  // traced location data
  const [tracedLocation, setTracedLocation] = useState({
    username: "",
    title: "",
    desc: "",
    lon: 85.5,
    lat: 27.6,
    zoom: 4
  });
  

  // save pinned location
  const savePin = async () => {
    try {
      // send data to the backend
      const res = await axios.create({
        baseURL: "http://localhost:8000",
        timeout: 1000,
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("traveller")).token.access_token}`
        }
      }).post("/traveller/pins", tracedLocation);

      toast.success("Location pinned successfully.");

      return setNewLocationTraced(false);
    } catch (error) {
      if (error.response.data === "Token not found in server !!")
        localStorage.clear();

      //refresh page
      return window.location.assign("");
    }
  }

  // update traced location on db lick map
  const updateTracedLocation = (location) => {
    console.log(location)
    try {
      setFormVisible(true);
      setTracedLocation({ ...tracedLocation, lat: location.lngLat.lat, lon: location.lngLat.lng, username: JSON.parse(localStorage.getItem("traveller")).data.name })
    } catch (error) {
      toast.error("Please login first !")
      return setFormVisible(false);
    }
  }
  
  var dataOne = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [86.08185436454727, 27.324242058595857],
        [85.93153797192207, 26.732301896483165]
      ]
    }
  };

  return (
    <div className="App container-fluid p-0 m-0">
      <ProfileBtn />
      <Map
        mapboxAccessToken="pk.eyJ1IjoicGFyYmF0MTIzIiwiYSI6ImNsNTVla3I4dzE4Z2czY3FpdHpiZmNvY24ifQ.QbrYyf84eP84fn_loVxEdw"
        initialViewState={{
          longitude: 85.300140,
          latitude: 27.700769,
          zoom: 11
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={location => updateTracedLocation(location)}
      >

        {
          pinnedData && pinnedData.map((data, index) => {
            return (
              <div key={index}>
                <Marker
                  longitude={data.lon}
                  latitude={data.lat}
                  draggable={false}
                >
                  <VscLocation
                    style={{
                      fontSize: tracedLocation.zoom * 10,
                      color: data.username === JSON.parse(localStorage.getItem("traveller")).data.name ? "red" : "green"
                    }} />
                </Marker>
                <Popup
                  longitude={data.lon}
                  latitude={data.lat}
                  anchor="bottom"
                  closeOnClick={false}
                  closeButton={false}
                  style={{
                    background: data.username === JSON.parse(localStorage.getItem("traveller")).data.name ? "red" : "green",
                    color: data.username === JSON.parse(localStorage.getItem("traveller")).data.name ? "red" : "green"
                  }}
                >
                  <h6 className='py-0'>{data.title}</h6>
                  <span>{data.desc}</span>
                </Popup>
              </div>
            )
          })
        }

        {/* default marker */}
        <Marker
          longitude={tracedLocation.lon}
          latitude={tracedLocation.lat}
          draggable={true}
          onDrag={location => setTracedLocation({ ...tracedLocation, lat: location.lngLat.lat, lon: location.lngLat.lng })}
        >
          <VscLocation
            style={{
              fontSize: tracedLocation.zoom * 10,
              color: "red"
            }}
            onDoubleClick={() => {
              setFormVisible(true)
            }}
          />
        </Marker>
        {
          isFormVisible && <Popup
            latitude={tracedLocation.lat}
            longitude={tracedLocation.lon}
            anchor="bottom"
            closeOnClick={false}
            closeButton={false}
          >
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
          </Popup>
        }
        <Source id="polylineLayer" type="geojson" data={dataOne}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "red",
              "line-width": 2
            }}
          />
          </Source>
      </Map>
      <ToastContainer position='top-center' />
    </div>
  );
}

export default App;
