import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
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
  const isCritical = incident.severity === "CRITICAL";

  const palette = {
    CRITICAL: { dot: "#ef4444", glow: "rgba(239,68,68,0.22)", glowDark: "rgba(239,68,68,0.1)", shadow: "rgba(239,68,68,0.5)" },
    HIGH:     { dot: "#f59e0b", glow: "rgba(245,158,11,0.18)", glowDark: "rgba(245,158,11,0.08)", shadow: "rgba(245,158,11,0.4)" },
    MEDIUM:   { dot: "#3b82f6", glow: "rgba(59,130,246,0.18)", glowDark: "rgba(59,130,246,0.08)", shadow: "rgba(59,130,246,0.4)" },
    LOW:      { dot: "#64748b", glow: "rgba(100,116,139,0.12)", glowDark: "rgba(100,116,139,0.06)", shadow: "rgba(100,116,139,0.3)" },
  };

  const c = palette[incident.severity] || palette.LOW;

  // Outer glow ring — only animates for CRITICAL
  const glowRing = isCritical
    ? `<span class="critical-glow-ring" style="position:absolute;inset:-5px;border-radius:50%;background:radial-gradient(circle, ${c.glow} 0%, transparent 70%);"></span>`
    : `<span style="position:absolute;inset:-3px;border-radius:50%;background:radial-gradient(circle, ${c.glowDark} 0%, transparent 70%);"></span>`;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:20px;height:20px;">
        ${glowRing}
        <span style="
          position:relative;
          display:block;
          width:9px;height:9px;
          border-radius:50%;
          background:${c.dot};
          border:1.5px solid rgba(255,255,255,0.55);
          box-shadow:0 0 8px ${c.shadow}, 0 2px 6px rgba(0,0,0,0.5);
        "></span>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// Premium cluster icon — concentric ring + deep shadow design
const createClusterIcon = (districtName, count) => {
  const isCritical = count > 15;
  const isHigh = count > 6;

  let outerSize, innerSize, bg, borderColor, textColor, outerBg, innerShadow, pulseClass;

  if (isCritical) {
    outerSize = 56; innerSize = 38;
    bg = "rgba(120,25,25,0.92)";
    borderColor = "rgba(239,68,68,0.55)";
    textColor = "#fca5a5";
    outerBg = "rgba(239,68,68,0.14)";
    innerShadow = "0 4px 20px rgba(239,68,68,0.3), 0 2px 8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)";
    pulseClass = "situation-pulse";
  } else if (isHigh) {
    outerSize = 50; innerSize = 34;
    bg = "rgba(113,47,10,0.92)";
    borderColor = "rgba(245,158,11,0.5)";
    textColor = "#fcd34d";
    outerBg = "rgba(245,158,11,0.12)";
    innerShadow = "0 4px 18px rgba(245,158,11,0.25), 0 2px 8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)";
    pulseClass = "";
  } else {
    outerSize = 44; innerSize = 30;
    bg = "rgba(23,52,130,0.92)";
    borderColor = "rgba(59,130,246,0.45)";
    textColor = "#93c5fd";
    outerBg = "rgba(59,130,246,0.1)";
    innerShadow = "0 4px 16px rgba(59,130,246,0.2), 0 2px 8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)";
    pulseClass = "";
  }

  return L.divIcon({
    className: `custom-cluster-icon ${pulseClass}`,
    html: `
      <div style="
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        width:${outerSize}px;height:${outerSize}px;
        border-radius:50%;
        background:${outerBg};
      ">
        <div style="
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          width:${innerSize}px;height:${innerSize}px;
          border-radius:50%;
          background:${bg};
          border:1.5px solid ${borderColor};
          box-shadow:${innerShadow};
        ">
          <span style="font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:700;color:${textColor};line-height:1;letter-spacing:-0.02em;">${count}</span>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:6px;text-transform:uppercase;color:${textColor};opacity:0.6;letter-spacing:0.08em;margin-top:1.5px;">${districtName.slice(0, 3)}</span>
        </div>
      </div>
    `,
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2]
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

// Available High-Precision Map Tile Services
const MAP_LAYERS = {
  dark: {
    name: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
  },
  streets: {
    name: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

// Severity badge styles for popup
const getSeverityPopupStyle = (severity) => {
  switch (severity) {
    case "CRITICAL": return { bg: "rgba(127,29,29,0.6)", border: "rgba(239,68,68,0.35)", text: "#fca5a5" };
    case "HIGH":     return { bg: "rgba(120,53,15,0.6)", border: "rgba(245,158,11,0.35)", text: "#fcd34d" };
    case "MEDIUM":   return { bg: "rgba(30,58,138,0.5)", border: "rgba(59,130,246,0.3)", text: "#93c5fd" };
    default:         return { bg: "rgba(30,41,59,0.5)", border: "rgba(100,116,139,0.3)", text: "#94a3b8" };
  }
};

// Generates an inverted polygon mask covering the entire world except Karnataka
const createMaskGeoJSON = (karnatakaGeoJSON) => {
  const worldCoords = [
    [-180, -90],
    [-180, 90],
    [180, 90],
    [180, -90],
    [-180, -90]
  ];

  const feature = karnatakaGeoJSON.features?.[0];
  if (!feature || !feature.geometry) return null;

  const rings = [worldCoords];

  if (feature.geometry.type === "Polygon") {
    feature.geometry.coordinates.forEach(ring => {
      rings.push(ring);
    });
  } else if (feature.geometry.type === "MultiPolygon") {
    feature.geometry.coordinates.forEach(poly => {
      poly.forEach(ring => {
        rings.push(ring);
      });
    });
  }

  return {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: rings
      }
    }]
  };
};

const InteractiveMap = ({ incidents, selectedItem, onSelectDistrict, onSelectMarker }) => {
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [activeLayer, setActiveLayer] = useState("dark");

  // Boundaries state
  const [stateGeoJSON, setStateGeoJSON] = useState(null);
  const [districtsGeoJSON, setDistrictsGeoJSON] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);

  // Load GeoJSON files asynchronously
  useEffect(() => {
    Promise.all([
      fetch("/karnataka-state.geojson").then(res => {
        if (!res.ok) throw new Error("State boundary GeoJSON not found");
        return res.json();
      }),
      fetch("/karnataka-districts.geojson").then(res => {
        if (!res.ok) throw new Error("District boundary GeoJSON not found");
        return res.json();
      })
    ]).then(([stateData, districtsData]) => {
      setStateGeoJSON(stateData);
      setDistrictsGeoJSON(districtsData);
      
      // Delay marker fade-in slightly to stagger the load after boundary reveals
      setTimeout(() => {
        setShowMarkers(true);
      }, 400);
    }).catch(err => {
      console.error("Error loading boundaries:", err);
      setShowMarkers(true); // Fallback so markers show immediately
    });
  }, []);

  // Inverted mask definition
  const maskData = useMemo(() => {
    if (!stateGeoJSON) return null;
    return createMaskGeoJSON(stateGeoJSON);
  }, [stateGeoJSON]);

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
  const currentTile = MAP_LAYERS[activeLayer];

  // Compute quick stats for the floating situation overview
  const criticalCount = incidents.filter(i => i.severity === "CRITICAL").length;
  const activeCount = incidents.filter(i => i.status === "Under Investigation" || i.status === "Suspect Apprehended").length;
  const officersSet = new Set(incidents.map(i => i.assignedOfficer?.name).filter(Boolean));
  const officersCount = officersSet.size;

  // Custom Layer styles
  const maskStyle = {
    fillColor: "#020617",
    fillOpacity: 0.42,
    stroke: false
  };

  const glowStyle = {
    color: "#2563eb", // Royal blue
    weight: 3.5,
    opacity: 0.22,
    fill: false,
    lineCap: "round",
    lineJoin: "round"
  };

  const mainStyle = {
    color: "#06b6d4", // Cyan
    weight: 1.25,
    opacity: 0.8,
    fill: false,
    lineCap: "round",
    lineJoin: "round"
  };

  const districtStyle = {
    color: "rgba(255, 255, 255, 0.08)", // extremely subtle
    weight: 0.75,
    opacity: 0.55,
    fill: false,
    lineCap: "round",
    lineJoin: "round"
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800/35 bg-slate-950 relative min-h-[500px]" style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>

      {/* ── Floating Situation Overview Panel (Left) ── */}
      <div className="map-float-panel top-3 left-3" style={{ minWidth: 148 }}>
        <div style={{
          background: "rgba(6,13,26,0.88)",
          border: "1px solid rgba(51,65,85,0.25)",
          borderRadius: 10,
          padding: "10px 12px",
          minWidth: 148,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 10, paddingBottom: 8,
            borderBottom: "1px solid rgba(51,65,85,0.2)"
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6,
              borderRadius: "50%", background: "#3b82f6",
              animation: "ping-slow 2s ease-in-out infinite", flexShrink: 0
            }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 8, fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#475569"
            }}>Situation Overview</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Active Hotspots", value: districtClusters.length, color: "#ef4444" },
              { label: "Critical Incidents", value: criticalCount, color: "#f59e0b" },
              { label: "Active Cases", value: activeCount, color: "#3b82f6" },
              { label: "Officers Deployed", value: officersCount, color: "#10b981" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em"
                }}>{label}</span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 14, fontWeight: 700, color, lineHeight: 1
                }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map Layer Switcher Control (Top Right) ── */}
      <div className="map-float-panel top-3 right-3">
        <div style={{
          display: "flex", gap: 2,
          background: "rgba(6,13,26,0.88)",
          border: "1px solid rgba(51,65,85,0.25)",
          borderRadius: 8, padding: 3,
        }}>
          {Object.entries(MAP_LAYERS).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setActiveLayer(key)}
              style={{
                padding: "4px 9px",
                borderRadius: 6,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
                transition: "all 0.15s",
                background: activeLayer === key ? "#2563eb" : "transparent",
                color: activeLayer === key ? "#ffffff" : "#475569",
              }}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Leaflet Map ── */}
      <MapContainer
        center={KARNATAKA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        className="h-full w-full z-10"
        style={{ background: "#020617" }}
      >
        <TileLayer key={activeLayer} url={currentTile.url} attribution={currentTile.attribution} maxZoom={19} />
        
        <MapController selectedItem={selectedItem} setZoomLevel={setZoomLevel} />

        {/* 1. Outside world darken mask */}
        {maskData && (
          <GeoJSON data={maskData} style={maskStyle} interactive={false} />
        )}

        {/* 2. District subtle interior lines */}
        {districtsGeoJSON && (
          <GeoJSON data={districtsGeoJSON} style={districtStyle} interactive={false} />
        )}

        {/* 3. Karnataka State Outline (Glow & Sharp Stroke) */}
        {stateGeoJSON && (
          <>
            <GeoJSON data={stateGeoJSON} style={glowStyle} interactive={false} />
            <GeoJSON data={stateGeoJSON} style={mainStyle} interactive={false} />
          </>
        )}

        {/* 4. Hotspot markers / Clusters — Fade in after boundary loaded */}
        {showMarkers && (
          showClusters ? (
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
            incidents.map((inc) => {
              const sevStyle = getSeverityPopupStyle(inc.severity);
              return (
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
                    <div style={{ padding: "4px 2px", minWidth: 230, maxWidth: 260, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {/* Header */}
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        paddingBottom: 8, marginBottom: 10,
                        borderBottom: "1px solid rgba(51,65,85,0.25)"
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd" }}>{inc.caseNo}</span>
                        <span style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                          textTransform: "uppercase", padding: "2px 7px", borderRadius: 4,
                          background: sevStyle.bg, border: `1px solid ${sevStyle.border}`, color: sevStyle.text
                        }}>
                          {inc.severity}
                        </span>
                      </div>

                      {/* Details */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 8, color: "#475569", width: 14, flexShrink: 0 }}>📍</span>
                          <span style={{ fontSize: 10, color: "#cbd5e1" }}>{inc.unit}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 8, color: "#475569", width: 14, flexShrink: 0 }}>📅</span>
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>{inc.date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 8, color: "#475569", width: 14, flexShrink: 0 }}>👤</span>
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>{inc.assignedOfficer.name}</span>
                        </div>
                      </div>

                      {/* Brief Facts */}
                      <div style={{
                        background: "rgba(2,6,23,0.6)", borderRadius: 6,
                        border: "1px solid rgba(51,65,85,0.2)", padding: "7px 9px", marginBottom: 8
                      }}>
                        <span style={{
                          display: "block", fontSize: 8, fontWeight: 700,
                          color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4
                        }}>Brief Facts</span>
                        <p style={{ fontSize: 9, lineHeight: 1.55, color: "#64748b", fontFamily: "Inter, sans-serif",
                          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                        }}>
                          {inc.briefFacts}
                        </p>
                      </div>

                      {/* Status footer */}
                      <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 8, color: "#475569" }}>
                        Status: <span style={{ color: "#94a3b8", fontWeight: 700, marginLeft: 4 }}>{inc.status}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          )
        )}
      </MapContainer>

      {/* ── Floating Severity Legend (Bottom Right, above attribution) ── */}
      <div className="map-float-panel bottom-8 right-3">
        <div className="map-severity-legend">
          <div style={{ color: "#475569", marginBottom: 6, fontSize: 8, letterSpacing: "0.1em" }}>Severity Index</div>
          {[
            { label: "Critical", color: "#ef4444" },
            { label: "High",     color: "#f59e0b" },
            { label: "Medium",   color: "#3b82f6" },
            { label: "Low",      color: "#475569" },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: "#64748b", fontSize: 9 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Viewport Scale Badge (Bottom Left) ── */}
      <div className="map-float-panel bottom-8 left-3" style={{
        background: "rgba(6,13,26,0.82)",
        border: "1px solid rgba(51,65,85,0.2)",
        borderRadius: 6, padding: "4px 10px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9, letterSpacing: "0.08em", color: "#475569"
      }}>
        VIEW: <span style={{ color: "#60a5fa", fontWeight: 700 }}>{showClusters ? "DISTRICT CLUSTERS" : "STREET INCIDENTS"}</span>
      </div>

    </div>
  );
};

export default InteractiveMap;
