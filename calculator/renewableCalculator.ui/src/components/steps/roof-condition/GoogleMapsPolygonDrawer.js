import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PostcodeLocationInput from './PostcodeLocationInput';
import Compass from './Compass';

const GoogleMapsPolygonDrawer = forwardRef(({ onAreaChange, userLocation, apiKey }, ref) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [area, setArea] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(userLocation);

  // Expose clearPolygon method to parent component
  useImperativeHandle(ref, () => ({
    clearPolygon: () => {
      if (polygon) {
        polygon.setMap(null);
        setPolygon(null);
        setArea(0);
        onAreaChange(0);
      }
    }
  }));

  // Update map center when location changes
  useEffect(() => {
    if (map && currentLocation) {
      map.setCenter(currentLocation);
      map.setZoom(20);
    }
  }, [currentLocation, map]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: currentLocation || { lat: 51.5074, lng: -0.1278 }, // London default
        zoom: 20,
        mapTypeId: 'satellite',
        tilt: 0,
      });

      // Enable drawing manager
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: '#FF6B35',
          fillOpacity: 0.5,
          strokeColor: '#FF6B35',
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
      });

      drawingManager.setMap(newMap);

      // Handle polygon completion
      drawingManager.addListener('polygoncomplete', (newPolygon) => {
        // Remove previous polygon if exists
        if (polygon) {
          polygon.setMap(null);
        }

        setPolygon(newPolygon);
        calculateArea(newPolygon);

        // Add listener for polygon changes
        newPolygon.getPath().addListener('set_at', () => calculateArea(newPolygon));
        newPolygon.getPath().addListener('insert_at', () => calculateArea(newPolygon));
        newPolygon.getPath().addListener('remove_at', () => calculateArea(newPolygon));

        // Disable drawing after polygon is created
        drawingManager.setDrawingMode(null);
      });

      setMap(newMap);
    }
  }, [mapRef.current, map, currentLocation]);

  const calculateArea = (polygon) => {
    const path = polygon.getPath();
    const areaInSquareMeters = window.google.maps.geometry.spherical.computeArea(path);
    setArea(areaInSquareMeters);
    onAreaChange(areaInSquareMeters);
  };

  const clearPolygon = () => {
    if (polygon) {
      polygon.setMap(null);
      setPolygon(null);
      setArea(0);
      onAreaChange(0);
    }
  };

  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    // Clear existing polygon when location changes
    if (polygon) {
      clearPolygon();
    }
  };

  return (
    <div className="google-maps-container">
      <div className="map-location-controls">
        <h5>Search by postcode</h5>
        <PostcodeLocationInput onLocationChange={handleLocationChange} />
      </div>
      
      <div className="map-with-compass">
        <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
        <Compass />
      </div>
      
      <div className="map-controls">
        <button onClick={clearPolygon} className="btn btn-secondary" disabled={!polygon}>
          Clear Roof Area
        </button>
      </div>
    </div>
  );
});

GoogleMapsPolygonDrawer.displayName = 'GoogleMapsPolygonDrawer';

export default GoogleMapsPolygonDrawer; 