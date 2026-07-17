import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaCalendarAlt, FaUser, FaBuilding } from "react-icons/fa";

// Tile Layer details
const MAP_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Map center of Karnataka
const KARNATAKA_CENTER = [14.5, 76.2];
const DEFAULT_ZOOM = 7.2;

// Custom Marker styling based on Severity
const getMarkerColorClass = (severity) => {
  switch (severity) {
    case "CRITICAL": return "bg-red-500";
    case "HIGH": return "bg-amber-500";
    case "MEDIUM": return "bg-blue-500";
    case "LOW":
    default: return "bg-slate-400";
  }
};

const createCustomMarker = (incident) => {
  const colorClass = getMarkerColorClass(incident.severity);
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div class="relative flex items-center justify-center h-5 w-5">
        <span class="animate-ping absolute inline-flex h-4 w-4 rounded-full ${colorClass} opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${colorClass} border border-white"></span>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// Custom Cluster Marker styling based on Incident count
const createClusterIcon = (districtName, count) => {
  let sizeClass = "h-11 w-11 text-xs border-2";
  let colorClass = "bg-blue-600/90 border-blue-500 text-white";

  if (count > 15) {
    sizeClass = "h-14 w-14 text-sm border-2 animate-pulse";
    colorClass = "bg-red-600/90 border-red-500 text-white";
  } else if (count > 6) {
    sizeClass = "h-12 w-12 text-xs border-2";
    colorClass = "bg-amber-600/90 border-amber-500 text-white";
  }

  return L.divIcon({
    className: "custom-cluster-icon",
    html: `
      <div class="flex flex-col items-center justify-center rounded-full font-mono font-bold shadow-2xl ${sizeClass} ${colorClass}">
        <span class="leading-none">${count}</span>
        <span class="text-[7px] uppercase tracking-tighter opacity-80 mt-0.5">${districtName.slice(0, 3)}</span>
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  });
};

// Map controller component to handle programmatic view shifting
const MapController = ({ selectedItem, setZoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, setZoomLevel]);

  useEffect(() => {
    if (selectedItem) {
      if (selectedItem.lat && selectedItem.lng) {
        // Zoom into individual incident marker
        map.setView([selectedItem.lat, selectedItem.lng], 10.5, { animate: true });
      } else if (selectedItem.latLng) {
        // Zoom into district center
        map.setView([selectedItem.latLng.lat, selectedItem.latLng.lng], 8.5, { animate: true });
      }
    }
  }, [selectedItem, map]);

  return null;
};

const InteractiveMap = ({ incidents, selectedItem, onSelectDistrict, onSelectMarker }) => {
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  // Group incidents by district for clustering at lower zoom levels
  const getDistrictClusters = () => {
    const clusters = {};
    incidents.forEach((inc) => {
      const name = inc.district;
      if (!clusters[name]) {
        clusters[name] = {
          name,
          count: 0,
          latLng: inc.districtCenter,
          incidents: []
        };
      }
      clusters[name].count++;
      clusters[name].incidents.push(inc);
    });
    return Object.values(clusters);
  };

  const districtClusters = getDistrictClusters();
  const showClusters = zoomLevel < 8.2;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative min-h-[500px]">
      <MapContainer
        center={KARNATAKA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        className="h-full w-full z-10"
        style={{ background: "#020617" }}
      >
        <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
        
        <MapController selectedItem={selectedItem} setZoomLevel={setZoomLevel} />

        {showClusters ? (
          // Render District Cluster Markers
          districtClusters.map((cluster) => (
            <Marker
              key={cluster.name}
              position={[cluster.latLng.lat, cluster.latLng.lng]}
              icon={createClusterIcon(cluster.name, cluster.count)}
              eventHandlers={{
                click: () => {
                  onSelectDistrict(cluster.name);
                }
              }}
            />
          ))
        ) : (
          // Render Individual Incident Pin Markers
          incidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={createCustomMarker(inc)}
              eventHandlers={{
                click: () => {
                  onSelectMarker(inc);
                }
              }}
            >
              <Popup className="dark-popup font-mono text-xs">
                <div className="space-y-2 p-1 max-w-[260px]">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5">
                    <span className="font-bold text-blue-400 text-[11px]">{inc.caseNo}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      inc.severity === "CRITICAL" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      inc.severity === "HIGH" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {inc.severity}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <FaBuilding className="text-slate-500 text-[9px]" />
                      <span>{inc.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-slate-500 text-[9px]" />
                      <span>Date: {inc.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaUser className="text-slate-500 text-[9px]" />
                      <span>Officer: {inc.assignedOfficer.name}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded border border-slate-900 mt-2">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Brief Facts</span>
                    <p className="text-[9px] leading-normal text-slate-400 font-sans line-clamp-3">
                      {inc.briefFacts}
                    </p>
                  </div>

                  <div className="text-[8px] text-slate-500 pt-1 text-right italic">
                    Status: <span className="text-slate-300 font-bold">{inc.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>

      {/* Embedded Map overlay showing Current View Status */}
      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 z-[1000] text-[9px] font-mono tracking-wider text-slate-400">
        VIEWPORT SCALE: <span className="text-blue-400 font-bold">{showClusters ? "DISTRICT OVERVIEW" : "STREET LEVEL MARKERS"}</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
