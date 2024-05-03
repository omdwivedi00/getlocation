import logo from './logo.svg';
import {useEffect , useState} from 'react'
import './App.css';
import Button from '@mui/material/Button';
import { saveAs } from 'file-saver'; 
import dateFormat, { masks } from "dateformat";

import Navbar from './component/Navbar';


function App() {
let [location, setlocation] = useState( {lat:'' , lon:''} )
const [position, setPosition] = useState({ latitude: null, longitude: null });
const [lodata, setlodata] = useState([])
const [counter, setCounter] = useState(0);


let getLocation=()=>{
  const successCallback = (position) => {
    

  };
  
  const errorCallback = (error) => {
    console.log(error);
    getLocation() 
  };
  
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


} 

  
let getcurrentLoction= ()=>{
  const now = new Date();

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: dateFormat(now),  
        speed : position.coords.speed,
        accuracy: position.coords.accuracy, 
        altitued : position.coords.altitude, 
        heading : position.coords.heading,
        timestapByApi: position.timestamp


      });

      console.log(position)
    });
  } else {
    console.log("Geolocation is not available in your browser.");

  }
}



useEffect(() => {
  setlodata([...lodata , position])
}, [position])

useEffect(() => {
  const interval = setInterval(() => {
    getcurrentLoction()
    setCounter(prevCounter => prevCounter + 1);
  }, 5000); // 10000 milliseconds = 10 seconds

  // Cleanup function to clear the interval when component unmounts or changes
  return () => clearInterval(interval);
}, []); 

const handleDownloadJson = () => {
  const jsonContent = JSON.stringify(lodata, null, 2); // Convert lodata to JSON string
  const blob = new Blob([jsonContent], { type: 'application/json' });
  saveAs(blob, 'positions.json'); // Trigger download of JSON file
}


  
  return (
    <div>
    <Navbar/> 
    <Button variant="contained" onClick={handleDownloadJson} 
     sx={{margin:'10px' , backgroundcolor:'success.main'}}
    
    >Download JSON</Button>
    {position.latitude && position.longitude ? (
      <div>
        <p>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </p>
        {/* Use map to render each location */}
        {lodata.map((data, index) => (
          <p key={index}>
            Latitude: {data.latitude}, Longitude: {data.longitude}, speed: {data.speed }
          </p>
        ))}
      </div>
    ) : (
      <p>Loading...</p>
    )}

  </div>
  );
}

export default App;
