import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  MarkerF,
  KmlLayer,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";

const libraries = ["places"];

const MapSection = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 12.9501, lng: 77.7152 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 12.9501, lng: 77.7152 });
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const [showKMZ, setShowKMZ] = useState(false);
  const [showGeoJSON, setShowGeoJSON] = useState(false);
  const [infoWindow, setInfoWindow] = useState({ position: null, content: "" });
  const [layerData, setLayerData] = useState([]);
  
  const mapRef = useRef(null);
  const kmlFileUrl = "https://soumya780.github.io/kmz_file/District-Layer.kmz";
  const geoJsonUrl = "https://soumya780.github.io/kmz_file/District-Layer.geojson";

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
      if (place.geometry) {
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

  const toggleMapType = () => {
    setMapType(mapType === "roadmap" ? "satellite" : "roadmap");
  };

  const handleToggleKMZ = () => {
    setShowKMZ(!showKMZ);
  };

  const toggleGeoJSONLayer = () => {
    setShowGeoJSON(!showGeoJSON);
    if (mapRef.current) {
      if (!showGeoJSON) {
        mapRef.current.data.loadGeoJson(geoJsonUrl, {}, (features) => {
          const featureNames = features.map((f) => f.getProperty("name"));
          setLayerData(featureNames);
        });
      } else {
        mapRef.current.data.forEach((feature) => {
          mapRef.current.data.remove(feature);
        });
        setLayerData([]);
      }
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    map.data.setStyle({
      fillColor: "blue",
      strokeColor: "black",
      strokeWeight: 2,
    });

    map.data.addListener("click", (event) => {
      setInfoWindow({
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
        content: event.feature.getProperty("name") || "No Information Available",
      });
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left: Map Section */}
      <div className="w-3/4 h-full relative">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={12}
            mapTypeId={mapType}
            onLoad={onMapLoad}
          >
            <MarkerF position={markerPosition} />
            <Circle center={markerPosition} radius={500} options={{ fillColor: "#CDEBFF" }} />

            {showKMZ && <KmlLayer url={kmlFileUrl} />}

            {infoWindow.position && (
              <InfoWindow
                position={infoWindow.position}
                onCloseClick={() => setInfoWindow({ position: null, content: "" })}
              >
                <div>
                  <p>{infoWindow.content}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        {/* Buttons Overlay on Map */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white p-2 rounded shadow-lg">
          <button onClick={getCurrentLocation} className="bg-blue-500 text-white p-2 rounded">
            📍 My Location
          </button>
          <button onClick={toggleMapType} className="bg-gray-700 text-white p-2 rounded">
            🛰 {mapType === "roadmap" ? "Satellite View" : "Default View"}
          </button>
          <button onClick={handleToggleKMZ} className={`p-2 ${showKMZ ? "bg-red-500" : "bg-green-500"} text-white rounded`}>
            🌍 {showKMZ ? "Hide KMZ" : "Show KMZ"}
          </button>
          <button onClick={toggleGeoJSONLayer} className={`p-2 ${showGeoJSON ? "bg-red-500" : "bg-green-500"} text-white rounded`}>
            🗺 {showGeoJSON ? "Hide GeoJSON" : "Show GeoJSON"}
          </button>
        </div>
      </div>

      {/* Right: Layer Information */}
      <div className="w-1/4 h-full bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">🗺 Map Layers</h2>
        <p className="mb-2"><strong>📍 Selected District:</strong></p>
        <p className="text-blue-700 font-semibold">{infoWindow.content || "Click on a region"}</p>

        {showGeoJSON && (
          <>
            <h3 className="mt-4 text-lg font-semibold">🗂 GeoJSON Layers</h3>
            {layerData.length > 0 ? (
              <ul className="list-disc pl-5">
                {layerData.map((name, index) => (
                  <li key={index} className="text-gray-700">{name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No layer data loaded.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapSection;
