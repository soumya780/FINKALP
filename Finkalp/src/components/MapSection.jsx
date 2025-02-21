import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, MarkerF, Circle, KmlLayer } from "@react-google-maps/api";

const libraries = ["places"];


//=sharing
const layersConfig = [
  { name: "State Borders", url: "https://www.google.com/maps/d/u/0/edit?mid=1YNIZZZo9TKjw1DgMmKgsMa6eHCCKcSs&usp", visible: false },
  { name: "Districts", url: "https://your-server.com/districts.kmz", visible: false },
  { name: "Taluks", url: "https://your-server.com/taluks.kmz", visible: false },
  { name: "Hoblis", url: "https://your-server.com/hoblis.kmz", visible: false },
];

const MapSection = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 12.9501, lng: 77.7152 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 12.9501, lng: 77.7152 });
  const [layers, setLayers] = useState(layersConfig);
  const mapRef = useRef(null);

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

          if (mapRef.current) {
            mapRef.current.setCenter(userLocation);
            mapRef.current.panTo(userLocation);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
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

  const toggleLayerVisibility = (layerName) => {
    const updatedLayers = layers.map((layer) =>
      layer.name === layerName ? { ...layer, visible: !layer.visible } : layer
    );
    setLayers(updatedLayers);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <div className="mb-4 flex flex-col items-center">
          <input
            type="text"
            placeholder="Search for a city, landmark, or address..."
            className="p-2 border rounded w-96 shadow-md"
          />
        </div>

        <GoogleMap
          mapContainerStyle={{ width: "80vw", height: "70vh" }}
          center={mapCenter}
          zoom={8}
          onLoad={(map) => (mapRef.current = map)}
        >
          {/* Marker and Circle */}
          <MarkerF position={markerPosition} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
          <Circle center={markerPosition} radius={500} options={{ strokeColor: "#4A90E2", fillColor: "#CDEBFF" }} />

          {/* Render KML Layers */}
          {layers.map(
            (layer, index) =>
              layer.visible && <KmlLayer key={index} url={layer.url} options={{ preserveViewport: true }} />
          )}
        </GoogleMap>

        {/* Checkboxes for Layer Control */}
        <div className="w-[80%] mt-4 p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold mb-2">Toggle Layers:</h2>
          {layers.map((layer) => (
            <label key={layer.name} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => toggleLayerVisibility(layer.name)}
                className="mr-2"
              />
              {layer.name}
            </label>
          ))}
        </div>
      </LoadScript>
    </div>
  );
};

export default MapSection;
