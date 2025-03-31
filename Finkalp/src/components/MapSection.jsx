import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  MarkerF,
  Circle,
} from "@react-google-maps/api";
import { FiAlignJustify } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaBalanceScale } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";
import { GoHorizontalRule } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import Layer from "../assets/layers.gif"
import axios from "axios"

const libraries = ["places"];

const MapSection = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });



  const [mapCenter, setMapCenter] = useState({ lat: 12.9501, lng: 77.7152 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 12.9501, lng: 77.7152 });
  const [autocomplete, setAutocomplete] = useState(null);
  const [showGeoJson, setShowGeoJson] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [sideBardata,setSidebarData] = useState([]);
  const mapRef = useRef(null);
  const backendUrl = "http://localhost:8080"

  
  const geoJsonUrls = [
    "https://soumya780.github.io/kmz_file/map.geojson",
    "https://soumya780.github.io/kmz_file/AswathNagar.geojson",
    "https://soumya780.github.io/kmz_file/19085.geojson"
  ];

  const layers = [
    { name: "Survey Details", details: "Details about survey plots and land records." },
    { name: "Village Map", details: "Displays the layout of the village and important landmarks." },
    { name: "CDP", details: "Comprehensive Development Plan with zoning and infrastructure details." },
    { name: "Boundaries", details: "Shows land boundaries and jurisdiction." }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          setMarkerPosition(userLocation);

          setTimeout(() => {
            setMapZoom(14);
            mapRef.current?.panTo(userLocation);
          }, 500);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to fetch your location.");
        }
      );
    }
  };

 const getSidebarData = async ()=>{
  const response = await axios.get(`${backendUrl}/location-info`)
    if(response.status === 200){
      console.log(response);
      
      setSidebarData(response.data);
    }
 }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(()=>{
    getSidebarData()
  },[])

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place?.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newLocation);
        setMapCenter(newLocation);
        setMapZoom(14);
        mapRef.current?.panTo(newLocation);
      }
    }
  };

  const setMapZoom = (zoomLevel) => {
    if (mapRef.current) {
      mapRef.current.setZoom(zoomLevel);
    }
  };

  const [geoJsonLayers, setGeoJsonLayers] = useState([]);

  const toggleGeoJsonLayer = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;
  
    if (showGeoJson) {
      // Remove all features from the map
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });
      setShowGeoJson(false);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
  
      geoJsonUrls.forEach((url, index) => {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            // **Filter out Point features ONLY for the second GeoJSON file**
            if (index === 1 ) { // Assuming second URL
              data.features = data.features.filter((feature) => feature.geometry.type !== "Point");
            }
  
            map.data.addGeoJson(data);
  
            map.data.setStyle({
              fillColor: "#1ba3ce",
              strokeColor: "#000000",
              strokeWeight: 1,
            });
  
            data.features.forEach((feature) => {
              const geometry = feature.geometry;
              if (geometry.type === "Point") {
                bounds.extend(new window.google.maps.LatLng(geometry.coordinates[1], geometry.coordinates[0]));
              } else if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
                geometry.coordinates.forEach((polygon) => {
                  polygon.forEach((coordinate) => {
                    bounds.extend(new window.google.maps.LatLng(coordinate[1], coordinate[0]));
                  });
                });
              }
            });
  
            map.fitBounds(bounds);
          })
          .catch((error) => console.error("Error loading GeoJSON:", error));
      });
  
      setShowGeoJson(true);
    }
  };
  
  

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex h-screen">
      <div className="w-[4.5%] bg-black text-white p-4 flex flex-col items-center justify-between">
        <a href="">
          <FiAlignJustify className="text-3xl" />
        </a>

        <div className="relative -top-28 text-white p-4 flex flex-col items-center gap-5">
          <a href="">
            <FaHome className="text-3xl" />
          </a>
          <a href="">
            <FaBalanceScale className="text-3xl" />
          </a>
          <a href="">
            <IoDocumentText className="text-3xl" />
          </a>
          <a href="">
            <GoHorizontalRule className="text-4xl" />
          </a>
          <a href="">
            <IoSettingsSharp className="text-3xl" />
          </a>
        </div>

        <div>
          <a href="">
            <CgProfile className="text-3xl" />
          </a>
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-[24%]  bg-sky-950 text-slate-200 p-8 gap-5 flex flex-col">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-lg font-bold">{sideBardata[1].address}</h2>
          {/* <p>3rd A Main Road, Doorvani Nagar, Bangalore - 560015</p> */}
        </div>
        <hr className="opacity-[0.7]" />
        <div>
          <h3 className="text-md font-semibold">Village Map Details</h3>
          <p>Survey Number: {sideBardata[1].surveyNumber}</p>
          <p>Village Name: {sideBardata[1].villageName}</p>
          <p>Hobli Name: {sideBardata[1].hobliName}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold">Ownership Details</h3>
          <p>Owner Name: {sideBardata[1].ownerName}</p>
          <p>Extent: 1-27-2</p>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <button className=" text-lg p-2 rounded inline-flex items-center gap-4 justify-center border border-spacing-1 bg-sky-900">
            ASK AI <BsStars className="text-xl text-sky-500" />
          </button>
          <button className="text-lg p-2 rounded inline-flex items-center gap-2 justify-center border border-spacing-1 bg-sky-900">
            BOOKMARK <FaBookmark className="text-xl text-sky-500" />
          </button>
        </div>
      </div>


      {/* Map Section */}
      <div className="w-3/4 h-full relative">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter}
          zoom={12}
          onLoad={(map) => (mapRef.current = map)}
        >
          <MarkerF position={markerPosition} />
          {/* <Circle center={markerPosition} radius={100} options={{ fillColor: "#CDEBFF" }} /> */}
        </GoogleMap>

        {/* Search Bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2">
          {isLoaded && (
            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceSelected}>
              <input type="text" placeholder="Search" className="w-full p-2 rounded shadow" />
            </Autocomplete>
          )}
        </div>

        {/* Layer Menu */}
        <div className="absolute bottom-4 left-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-gray-700 text-white p-2 py-4 px-3 rounded shadow w-20   h-15">
            <img src={Layer} alt="" />
          </button>
          {/* {isMenuOpen && ( */}
          <div className={`absolute left-24 bottom-0 w-64 p-1 rounded shadow-md 
            transition-transform duration-400 ease-in ${isMenuOpen ? "translate-x-3" : "translate-x-0 opacity-0"}
      `}>
            {/* <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Layer Details</h3>
                  <button onClick={() => setIsMenuOpen(false)} className="text-red-500">✖</button>
                </div> */}
            <div className="flex p-2 top-3 bg-gray-700 space-x-3 w-[150%] transition translate-x-[300] duratio  n-100 ">
              {layers.map((layer) => (
                <button key={layer.name}
                  className={`p-2 text-center rounded transition-colors duration-200 ${selectedLayer === layer.name ? "bg-blue-500 text-white" : "bg-gray-100"
                    }`} onClick={() => {
                      setSelectedLayer(layer.name);
                      if (layer.name === "Survey Details") { toggleGeoJsonLayer(); }
                    }}>{layer.name}</button>
              ))}
            </div>
            {/* {selectedLayer && <div className="mt-3 p-2 bg-gray-100 rounded"><p className="text-sm text-gray-700">{layers.find(l => l.name === selectedLayer)?.details}</p></div>} */}
          </div>
         
        </div>



      </div>
    </div>
  );
};

export default MapSection;
