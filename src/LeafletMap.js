import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const estaciones = [
  { name: "El Labrador", lat: -0.155488715, lng: -78.4862017 },
  { name: "Jipijapa", lat: -0.164250208, lng: -78.48351848 },
  { name: "Inaquito", lat: -0.176128084, lng: -78.48332669 },
  { name: "La Carolina", lat: -0.190137744, lng: -78.48584082 },
  { name: "La Pradera", lat: -0.193785121, lng: -78.49156314 },
  { name: "Universidad Central", lat: -0.198362048, lng: -78.50029599 },
  { name: "El Ejido", lat: -0.208858286, lng: -78.49858004 },
  { name: "La Alameda", lat: -0.215251174, lng: -78.50189827 },
  { name: "San Francisco", lat: -0.220586412, lng: -78.51557306 },
  { name: "Magdalena", lat: -0.238966673, lng: -78.52450384 },
  { name: "El Recreo", lat: -0.251638659, lng: -78.5213177 },
  { name: "Cardenal", lat: -0.257201022, lng: -78.53307995 },
  { name: "Solanda", lat: -0.265509315, lng: -78.53597212 },
  { name: "Moran Valverde", lat: -0.280825688, lng: -78.54891402 },
  { name: "Quitumbe", lat: -0.29504751, lng: -78.55605527 }
];

const LeafletMap = () => {
  const mapRef = useRef(null);
  const [isochronesLayer, setIsochronesLayer] = useState(null);
  const [timeRange, setTimeRange] = useState(15);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map('map').setView([-0.22, -78.52], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Add station markers as black circles
    estaciones.forEach(estacion => {
      const marker = L.circleMarker([estacion.lat, estacion.lng], {
        radius: 6,
        fillColor: 'black',
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 1
      })
        .addTo(mapRef.current)
        .bindPopup(estacion.name);

      // Store the marker in the station object for later use
      estacion.marker = marker;
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    const loadIsochrone = async (estacion, range) => {
      const fileName = `${estacion.name.replace(/ /g, '_')}_${range}min.json`;
      const url = `${process.env.PUBLIC_URL}/isochrones/${encodeURIComponent(fileName)}`;
      console.log(`Cargando isócrona desde: ${url}`);  // Debug message
      const response = await fetch(url, { cache: "no-store" });
      console.log(`Estado de la respuesta: ${response.status} para ${url}`);  // Debug message
      if (!response.ok) {
        console.error(`Error cargando ${url}: ${response.statusText}`);
        throw new Error(`Error cargando ${url}`);
      }
      const contentType = response.headers.get("content-type");
      console.log(`Tipo de contenido: ${contentType} para ${url}`);  // Debug message
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Se esperaba JSON pero se obtuvo: ${contentType}`);
        throw new Error(`Se esperaba JSON pero se obtuvo: ${contentType}`);
      }
      const text = await response.text();
      console.log(`Texto de la respuesta para ${url}: ${text}`);  // Debug message
      return JSON.parse(text);
    };

    const addIsochronesToMap = async (range) => {
      if (isochronesLayer) {
        mapRef.current.removeLayer(isochronesLayer);
      }

      const newLayer = L.layerGroup().addTo(mapRef.current);
      setIsochronesLayer(newLayer);

      for (const estacion of estaciones) {
        try {
          console.log(`Añadiendo isócrona para ${estacion.name} a ${range} minutos`);  // Debug message
          const isochrone = await loadIsochrone(estacion, range);
          L.geoJSON(isochrone, {
            style: {
              color: 'blue',
              weight: 2,
              opacity: 0.6,
              fillColor: '#30f',
              fillOpacity: 0.2
            }
          }).addTo(newLayer);

          // Bring the marker to the front
          estacion.marker.bringToFront();
        } catch (error) {
          console.error(`Error añadiendo isócrona para ${estacion.name} a ${range} minutos:`, error);
        }
      }
    };

    addIsochronesToMap(timeRange);
  }, [timeRange]);

  return (
    <div>
      <div id="controls" style={{ margin: '10px', textAlign: 'center' }}>
        <label htmlFor="timeSelect">Selecciona el tiempo en minutos: </label>
        <select id="timeSelect" value={timeRange} onChange={(e) => setTimeRange(parseInt(e.target.value, 10))}>
          <option value="5">5 minutos</option>
          <option value="10">10 minutos</option>
          <option value="15">15 minutos</option>
          <option value="20">20 minutos</option>
          <option value="25">25 minutos</option>
          <option value="30">30 minutos</option>
        </select>
      </div>
      <div id="map" style={{ height: '600px', width: '100%' }}></div>
    </div>
  );
};

export default LeafletMap;