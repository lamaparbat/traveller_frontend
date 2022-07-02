import React, {useState, useEffect} from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import { VscLocation } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toas, toast } from 'react-toastify';
import './App.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


const ProfileBtn = () => {
  // bootstrap modal function
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // current form type
  const [form_type, setFormType] = useState("login");
  
  // login data
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  // get the cache
  useEffect(() => {
    try {
      const cache = JSON.parse(localStorage.getItem("traveller"));
      if (cache === null || undefined)
        setFormType("signup")
        throw new Error("cache not found")
    } catch (error) {
      toast.error("Please login first")
      
    }
  }, [])
  
  //login
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:8000/traveller/login", { email: loginData.email, password: loginData.password });
      const { data, token } = res.data 
      
      // save data to browser cache
      localStorage.setItem("traveller", JSON.stringify({ data, token }));
    } catch (error) {
      toast.success("Login failed. Please enter correct email or password");
    }
  }
  
  //signup
  const signup = async () => {
    
  }
   
  return (
    <div className='my-2 d-flex flex-row-reverse'>
      <Button variant="primary" className='rounded-circle d-flex justify-content-center align-items-center pb-0' onClick={handleShow}>
        <h2>P</h2>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <h2>Parbat Lama</h2>
          <span>parbatlama70@gmail.com</span>
        </Modal.Body> 
        <Modal.Body>
          <h2>Sign In</h2>
          <input
            className='email form-control'
            placeholder='Enter email'
            onChange={(e) => setLoginData({ ...loginData, email:e.target.value}) }
          />
          <input
            className='password form-control mt-2'
            placeholder='Enter password'
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </Modal.Body> 
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            X
          </Button>
          {
            form_type === "login" && <Button variant="danger" onClick={handleClose}>
              <FiLogOut className='me-1' />  Logout
            </Button>
          }

          {
            form_type === "signup" && <Button variant="danger" onClick={login}> Login</Button>
          }
  <Button variant="danger" onClick={signup}> Signup</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
)
}


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
    desc:"",
    longitude: visualViewport.longitude,
    latitude: visualViewport.latitude,
    zoom:4
  })
  
  
  //track new location
  const trackNewLocation = (e) => {
    setNewLocationTraced(true)
    setTracedLocation({
      ...tracedLocation,
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat
    })
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
              marginTop: "-970px",
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
    </div>
  );
}

export default App;
