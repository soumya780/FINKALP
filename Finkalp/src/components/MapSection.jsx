import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, MarkerF , KmlLayer } from "@react-google-maps/api";

const libraries = ["places"];

const MapSection = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 12.9501, lng: 77.7152 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 12.9501, lng: 77.7152 });
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);

  // Function to get live location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // console.log(userLocation.lat );
          // console.log(userLocation.lng );
          
          setMapCenter(userLocation); // ✅ Update map center
          setMarkerPosition(userLocation); // ✅ Move marker to user location

          if (mapRef.current) {
            mapRef.current.setCenter(userLocation); // ✅ Force map to update center
            mapRef.current.panTo(userLocation); // ✅ Smooth transition
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation(); // Get user location on load
  }, []);

  // Handle place selection
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
        // console.log(newLocation);
        
        if (mapRef.current) {
          mapRef.current.setCenter(newLocation); // ✅ Ensure map moves
          mapRef.current.panTo(newLocation);
        }
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center relative">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        {/* Search Box */}
        <div className="mb-4">
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceSelected}>
            <input type="text" placeholder="Search a location..." className="p-2 border rounded w-96" />
          </Autocomplete>
        </div>

        {/* Google Map */}
        <div className="relative">
          <GoogleMap
            mapContainerStyle={{ width: "60vw", height: "60vh" }}
            center={mapCenter} // ✅ Updated properly
            zoom={14} // ✅ Higher zoom for better accuracy
            onLoad={(map) => (mapRef.current = map)}
          >
            <MarkerF position={markerPosition} />
          </GoogleMap>

          {/* My Location Button */}
          <div className="absolute top-10 right-5">
            <button
              onClick={getCurrentLocation}
              className="p-2 bg-blue-500 text-white rounded shadow-lg"
            >
              📍 My Location
            </button>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default MapSection;
