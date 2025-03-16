import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  MarkerF,
  KmlLayer,
  Circle,
} from "@react-google-maps/api";

const libraries = ["places"];

const MapSection = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [mapCenter, setMapCenter] = useState({ lat: 12.9501, lng: 77.7152 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 12.9501, lng: 77.7152 });
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);

  const kmlFileUrl = "https://soumya780.github.io/kmz_file/District-Layer.kmz";

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
          mapRef.current?.panTo(userLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Failed to fetch your location.");
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

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
        mapRef.current?.panTo(newLocation);
      }
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-4 flex flex-col">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-lg font-bold">Tin Factory</h2>
          <p>3rd A Main Road, Doorvani Nagar, Bangalore - 560015</p>
        </div>
        <div>
          <h3 className="text-md font-semibold">Village Map Details</h3>
          <p>Survey Number: 49</p>
          <p>Village Name: Benniganahalli</p>
          <p>Hobli Name: Mahadevapura</p>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-semibold">Ownership Details</h3>
          <p>Owner Name: SK Bhat</p>
          <p>Extent: 1-27-2</p>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <button className="bg-blue-600 p-2 rounded">ASK AI</button>
          <button className="bg-gray-700 p-2 rounded">BOOKMARK</button>
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
          <Circle center={markerPosition} radius={500} options={{ fillColor: "#CDEBFF" }} />
          <KmlLayer url={kmlFileUrl} />
        </GoogleMap>

        {/* Search Bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2">
          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceSelected}>
            <input type="text" placeholder="Search" className="w-full p-2 rounded shadow" />
          </Autocomplete>
        </div>

        {/* Floating Buttons */}
        <div className="absolute bottom-4 left-4 flex space-x-2 bg-white p-2 rounded shadow">
          <button className="bg-gray-700 text-white p-2 rounded">Survey Details</button>
          <button className="bg-gray-700 text-white p-2 rounded">Village Map</button>
          <button className="bg-gray-700 text-white p-2 rounded">CDP</button>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
