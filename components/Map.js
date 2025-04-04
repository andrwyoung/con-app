"use client"; 

import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '../lib/supabase';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3Vuc2NhcnIiLCJhIjoiY205MHJ5Mno1MDFmMDJpcHg4MXIyY25lNSJ9.HGhkRRY7U6jAgdsPolBufQ';

const Map = ({ location, events }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/andrwyoung/cm933j195002s01r94jdh85yj',
        center: [-122.4194, 37.7749],
        zoom: 9,
      });

      // navigation controls
      map.addControl(new mapboxgl.NavigationControl());

      setMap(map);
    };

    if (!map) {
      initializeMap();
    }

    // Update map when location changes
    if (location) {
        console.log("Flying to location:", location);
      map?.flyTo({ center: [location.longitude, location.latitude], essential: true });
    }
  }, [location, map]);

  useEffect(() => {
    // Add event markers to the map
    if (map && events && events.length > 0) {
      events.forEach((event) => {
        new mapboxgl.Marker()
          .setLngLat([event.longitude, event.latitude])  // Use event coordinates
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${event.name}</h3><p>${event.description}</p>`)) // Show event details in the popup
          .addTo(map);
      });
    }
  }, [map, events]);

  return <div id="map" style={{ width: '100%', height: '1000px' }} />;
};

export default Map;
