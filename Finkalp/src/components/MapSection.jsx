import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, MarkerF, KmlLayer, Circle } from "@react-google-maps/api";

const libraries = ["places"]; 

const MapSection = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 12.9501, lng: 77.7152 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 12.9501, lng: 77.7152 });
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const [showKMZ, setShowKMZ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);


  
  const kmlFileUrl = "https://drive.google.com/uc?export=download&id=1__NmjECI5TwSFrIvALNMK_LysGRlBTD_";
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          setMarkerPosition(userLocation);

          if (mapRef.current) {
            mapRef.current.setCenter(userLocation);
            mapRef.current.panTo(userLocation);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
          alert("Failed to fetch your location. Please try again.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarkerPosition(newLocation);
        setMapCenter(newLocation);

        if (mapRef.current) {
          mapRef.current.setCenter(newLocation);
          mapRef.current.panTo(newLocation);
        }
      }
    }
  };

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === "roadmap" ? "satellite" : "roadmap"));
  };

  const handleToggle = ()=>{
    setShowKMZ(!showKMZ)
    console.log(showKMZ); 
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <div className="mb-4 flex flex-col items-center">
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceSelected}>
            <input
              type="text"
              placeholder="Search for a city, landmark, or address..."
              className="p-2 border rounded w-96 shadow-md"
            />
          </Autocomplete>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96 w-full">
            <p className="text-lg font-semibold text-gray-700">Loading map...</p>
          </div>  
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "80vw", height: "70vh" }}
            center={mapCenter}
            zoom={14}
            mapTypeId={mapType}
            onLoad={(map) => (mapRef.current = map)}
          >
            {/* Marker and Circle around Current Location */}
            <MarkerF position={markerPosition} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
            <Circle center={markerPosition} radius={500} options={{ strokeColor: "#4A90E2", fillColor: "#CDEBFF" }} />

            {/* Conditionally Render KML Layer */}
            {showKMZ === true ? (
              <KmlLayer
                url={kmlFileUrl}
              />
            ) : (<GoogleMap
              mapContainerStyle={{ width: "80vw", height: "70vh" }}
              center={mapCenter}
              zoom={11}
              mapTypeId={mapType}
              onLoad={(map) => (mapRef.current = map)}
            >
              {/* Marker and Circle around Current Location */}
              <MarkerF position={markerPosition} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
              <Circle center={markerPosition} radius={500} options={{ strokeColor: "#4A90E2", fillColor: "#CDEBFF" }} />
  
            </GoogleMap>)}
          </GoogleMap>
        )}

        <div className="w-[80%] h-20 mt-4 flex flex-row items-center justify-around">
          <button
            onClick={getCurrentLocation}
            className="p-2 bg-blue-500 text-white rounded shadow-lg"
            aria-label="Find My Location"
          >
            📍 My Location
          </button>
          <button
            onClick={toggleMapType}
            className="p-2 bg-gray-700 text-white rounded shadow-lg"
            aria-label="Toggle Map Type"
          >
            🛰 {mapType === "roadmap" ? "Satellite View" : "Default View"}
          </button>
          <button
            onClick={handleToggle}
            className="p-2 bg-green-500 text-white rounded shadow-lg"
            aria-label="Toggle KMZ Layer"
          >
            🌍 {showKMZ ? "Hide KMZ" : "Show KMZ"}
          </button>
        </div>
      </LoadScript>
    </div>
  );
};

export default MapSection; 