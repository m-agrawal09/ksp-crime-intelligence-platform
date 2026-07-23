import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { crimeService } from "../../services/crimeService";
import { recordService } from "../../services/recordService";

// ── Exact same tile layers as InteractiveMap.jsx ──────────────────────────
const MAP_LAYERS = {
  streets: {
    label: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN",
  },
};

const KARNATAKA_CENTER = [14.5, 76.2];
const PANEL_ZOOM = 6.5;

// ── Cluster icon (matching concentric rings layout from InteractiveMap) ─────
const createClusterIcon = (districtName, count) => {
  const isCritical = count > 15;
  const isHigh = count > 6;

  let outerSize, innerSize, bg, borderColor, textColor, outerBg, innerShadow, pulseClass;

  if (isCritical) {
    outerSize = 46; innerSize = 32;
    bg = "rgba(120,25,25,0.92)";
    borderColor = "rgba(239,68,68,0.55)";
    textColor = "#fca5a5";
    outerBg = "rgba(239,68,68,0.14)";
    innerShadow = "0 2px 10px rgba(239,68,68,0.3), 0 1px 4px rgba(0,0,0,0.7), inset 0 0.5px 0 rgba(255,255,255,0.06)";
    pulseClass = "situation-pulse";
  } else if (isHigh) {
    outerSize = 40; innerSize = 28;
    bg = "rgba(113,47,10,0.92)";
    borderColor = "rgba(245,158,11,0.5)";
    textColor = "#fcd34d";
    outerBg = "rgba(245,158,11,0.12)";
    innerShadow = "0 2px 8px rgba(245,158,11,0.25), 0 1px 4px rgba(0,0,0,0.7), inset 0 0.5px 0 rgba(255,255,255,0.05)";
    pulseClass = "";
  } else {
    outerSize = 34; innerSize = 24;
    bg = "rgba(23,52,130,0.92)";
    borderColor = "rgba(59,130,246,0.45)";
    textColor = "#93c5fd";
    outerBg = "rgba(59,130,246,0.1)";
    innerShadow = "0 2px 6px rgba(59,130,246,0.2), 0 1px 4px rgba(0,0,0,0.7), inset 0 0.5px 0 rgba(255,255,255,0.05)";
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
          border:1.25px solid ${borderColor};
          box-shadow:${innerShadow};
        ">
          <span style="font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;color:${textColor};line-height:1;letter-spacing:-0.02em;">${count}</span>
          <span style="font-family:'Space Grotesk',sans-serif;font-size:5px;text-transform:uppercase;color:${textColor};opacity:0.6;letter-spacing:0.08em;margin-top:1.5px;">${districtName.slice(0, 3)}</span>
        </div>
      </div>
    `,
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2]
  });
};

// ── Individual incident marker ─────────────────────────────────────────────
const createIncidentIcon = (severity) => {
  const isCritical = severity === "CRITICAL";

  const palette = {
    CRITICAL: { dot: "#ef4444", glow: "rgba(239,68,68,0.22)", glowDark: "rgba(239,68,68,0.1)", shadow: "rgba(239,68,68,0.5)" },
    HIGH:     { dot: "#f59e0b", glow: "rgba(245,158,11,0.18)", glowDark: "rgba(245,158,11,0.08)", shadow: "rgba(245,158,11,0.4)" },
    MEDIUM:   { dot: "#3b82f6", glow: "rgba(59,130,246,0.18)", glowDark: "rgba(59,130,246,0.08)", shadow: "rgba(59,130,246,0.4)" },
    LOW:      { dot: "#64748b", glow: "rgba(100,116,139,0.12)", glowDark: "rgba(100,116,139,0.06)", shadow: "rgba(100,116,139,0.3)" },
  };

  const c = palette[severity] || palette.LOW;
  const glowRing = isCritical
    ? `<span class="critical-glow-ring" style="position:absolute;inset:-5px;border-radius:50%;background:radial-gradient(circle, ${c.glow} 0%, transparent 70%);"></span>`
    : `<span style="position:absolute;inset:-3px;border-radius:50%;background:radial-gradient(circle, ${c.glowDark} 0%, transparent 70%);"></span>`;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:18px;height:18px;">
        ${glowRing}
        <span style="
          position:relative;
          display:block;
          width:7px;height:7px;
          border-radius:50%;
          background:${c.dot};
          border:1.25px solid rgba(255,255,255,0.6);
          box-shadow:0 0 6px ${c.shadow}, 0 1px 4px rgba(0,0,0,0.5);
        "></span>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
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

// ─────────────────────────────────────────────────────────────────────────────
const KarnatakaOverviewPanel = () => {
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const tileLayerRef    = useRef(null);
  const markersLayerRef = useRef(null);
  const zoomRef         = useRef(PANEL_ZOOM);

  const [tick, setTick]           = useState(0);
  const [activeLayer, setActiveLayer] = useState("streets");
  const [zoomLevel, setZoomLevel] = useState(PANEL_ZOOM);
  const [boundariesLoaded, setBoundariesLoaded] = useState(false);

  // Live sync with recordService
  useEffect(() => {
    const unsub = recordService.subscribe(() => setTick((t) => t + 1));
    return () => unsub();
  }, []);

  // Live incidents
  const incidents = useMemo(() => crimeService.getIncidents(), [tick]);

  // Stats
  const hotspots   = useMemo(() => crimeService.getHotspotDistricts(incidents), [incidents]);
  const activeCount = useMemo(
    () => incidents.filter((i) => i.status !== "Case Closed / Completed").length,
    [incidents]
  );
  const highCount = incidents.filter(
    (i) => i.severity === "CRITICAL" || i.severity === "HIGH"
  ).length;

  // ── Initialize Leaflet map once ──────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: KARNATAKA_CENTER,
      zoom:   PANEL_ZOOM,
      zoomControl:      true,
      scrollWheelZoom:  true,
      doubleClickZoom:  true,
      dragging:         true,
      touchZoom:        true,
      keyboard:         true,
      attributionControl: false,
    });

    // Style the default zoom control to match the dark theme
    map.zoomControl.setPosition("bottomright");

    // Initial tile layer
    const tile = L.tileLayer(MAP_LAYERS.streets.url, {
      attribution: MAP_LAYERS.streets.attribution,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tile;

    // Load boundaries asynchronously
    Promise.all([
      fetch("/karnataka-state.geojson").then(res => res.json()),
      fetch("/karnataka-districts.geojson").then(res => res.json())
    ]).then(([stateData, districtsData]) => {
      if (!mapRef.current) return;
      // 1. World mask (strongly fades all other states outside Karnataka)
      const maskGeo = createMaskGeoJSON(stateData);
      if (maskGeo) {
        L.geoJSON(maskGeo, {
          style: {
            fillColor: "#020617",
            fillOpacity: 0.84,
            stroke: false
          },
          interactive: false
        }).addTo(map);
      }

      // 2. Districts subtle lines
      L.geoJSON(districtsData, {
        style: {
          color: "rgba(255, 255, 255, 0.12)",
          weight: 0.8,
          opacity: 0.6,
          fill: false
        },
        interactive: false
      }).addTo(map);

      // 3. Karnataka State Fill Highlight (spotlight effect)
      L.geoJSON(stateData, {
        style: {
          fillColor: "#ffffff",
          fillOpacity: 0.22,
          stroke: false
        },
        interactive: false
      }).addTo(map);

      // 4. State boundary glow outer
      L.geoJSON(stateData, {
        style: {
          color: "#2563eb",
          weight: 12,
          opacity: 0.5,
          fill: false,
          lineCap: "round",
          lineJoin: "round"
        },
        interactive: false
      }).addTo(map);

      // State boundary glow mid
      L.geoJSON(stateData, {
        style: {
          color: "#3b82f6",
          weight: 6,
          opacity: 0.8,
          fill: false,
          lineCap: "round",
          lineJoin: "round"
        },
        interactive: false
      }).addTo(map);

      // 5. Thin bright neon blue boundary stroke across Karnataka state
      L.geoJSON(stateData, {
        style: {
          color: "#93c5fd",
          weight: 2.5,
          opacity: 1,
          fill: false,
          lineCap: "round",
          lineJoin: "round"
        },
        interactive: false
      }).addTo(map);

      // Stagger markers fade in after boundaries render
      setTimeout(() => {
        setBoundariesLoaded(true);
      }, 350);
    }).catch(err => {
      console.error("Error loading dashboard boundaries:", err);
      setBoundariesLoaded(true); // Fallback
    });

    // Markers layer
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Track zoom for cluster/marker switching
    map.on("zoomend", () => {
      zoomRef.current = map.getZoom();
      setZoomLevel(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current      = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // ── Swap tile layer when activeLayer changes ─────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(MAP_LAYERS[activeLayer].url, {
      attribution: MAP_LAYERS[activeLayer].attribution,
      maxZoom: 19,
    }).addTo(mapRef.current);
    tileLayerRef.current = newTile;
    // ensure markers stay on top
    if (markersLayerRef.current) markersLayerRef.current.bringToFront?.();
  }, [activeLayer]);

  // ── Re-render markers on incidents change or zoom change ─────────────────
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !boundariesLoaded) return;
    markersLayerRef.current.clearLayers();

    const showClusters = zoomLevel < 8.2;

    if (showClusters) {
      // District clusters
      const clusters = {};
      incidents.forEach((inc) => {
        const dName = inc.district || "Bengaluru City";
        const lat = Number(inc.lat) || inc.districtCenter?.lat || 12.9716;
        const lng = Number(inc.lng) || inc.districtCenter?.lng || 77.5946;
        if (!clusters[dName]) {
          clusters[dName] = {
            count: 0,
            lat: inc.districtCenter?.lat || lat,
            lng: inc.districtCenter?.lng || lng,
          };
        }
        clusters[dName].count++;
      });

      Object.entries(clusters).forEach(([district, data]) => {
        L.marker([data.lat, data.lng], { icon: createClusterIcon(district, data.count) })
          .bindTooltip(
            `<span style="font-family:'Space Grotesk',sans-serif;font-size:9px;letter-spacing:0.05em;text-transform:uppercase;">${district}: ${data.count} FIRs</span>`,
            { direction: "top", offset: [0, -10], opacity: 1 }
          )
          .addTo(markersLayerRef.current);
      });
    } else {
      // Individual incident pins
      incidents.forEach((inc) => {
        L.marker([inc.lat, inc.lng], { icon: createIncidentIcon(inc.severity) })
          .bindTooltip(
            `<span style="font-family:'Space Grotesk',sans-serif;font-size:9px;text-transform:uppercase;">${inc.caseNo} · ${inc.severity}</span>`,
            { direction: "top", offset: [0, -6], opacity: 1 }
          )
          .addTo(markersLayerRef.current);
      });
    }
  }, [incidents, zoomLevel, boundariesLoaded]);

  const IBMM = { fontFamily: "'Space Grotesk', sans-serif" };

  return (
    <div className="rounded-xl border border-blue-500/30 bg-slate-900/35 overflow-hidden animate-fade-in-up flex flex-col" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-800/15">
        <div>
          <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.18em]" style={IBMM}>
            Karnataka Live Map
          </h2>
          <p className="text-[9px] text-slate-600 mt-0.5 uppercase tracking-wider" style={IBMM}>
            {zoomLevel < 8.2 ? "District Clusters" : "Street-Level Incidents"} · Live
          </p>
        </div>

        {/* Legend dots */}
        <div className="flex flex-col gap-1">
          {[
            { label: "Critical/High", color: "#ef4444" },
            { label: "Medium",        color: "#3b82f6" },
            { label: "Low",           color: "#64748b" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[8px] text-slate-500 uppercase tracking-wider" style={IBMM}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map ── */}
      <div className="relative bg-[#020617]" style={{ height: "320px" }}>
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />

        {/* ── Layer Switcher (same as Crime Map) ── */}
        <div className="absolute top-2.5 right-2.5 z-[1000] flex bg-slate-900/90 backdrop-blur-sm border border-slate-800/60 rounded-[4px] p-0.5 shadow-xl">
          {Object.entries(MAP_LAYERS).map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setActiveLayer(key)}
              className={`px-2 py-1 rounded-[3px] text-[8px] font-bold transition-all uppercase tracking-wider ${
                activeLayer === key
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
              style={IBMM}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* ── Live badge ── */}
        <div className="absolute top-2.5 left-2.5 z-[1000] flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm border border-slate-800/50 rounded-sm px-2 py-1 pointer-events-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider" style={IBMM}>
            Live · {incidents.length} FIRs
          </span>
        </div>

        {/* ── Zoom level badge (bottom-left) ── */}
        <div className="absolute bottom-10 left-2.5 z-[1000] bg-slate-950/70 backdrop-blur-sm border border-slate-800/40 rounded-sm px-2 py-0.5 pointer-events-none">
          <span className="text-[8px] text-slate-500 uppercase tracking-wider" style={IBMM}>
            {zoomLevel < 8.2 ? "District Overview" : "Street Level"}
          </span>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="px-4 py-3 border-t border-slate-800/15 bg-slate-900/30 grid grid-cols-3 divide-x divide-slate-800/20">
        <div className="pr-3">
          <span className="text-[8px] text-slate-300 uppercase tracking-widest block" style={IBMM}>Active</span>
          <span className="text-amber-400 font-bold text-sm leading-tight tabular-nums" style={IBMM}>{activeCount}</span>
        </div>
        <div className="px-3">
          <span className="text-[8px] text-slate-300 uppercase tracking-widest block" style={IBMM}>High Risk</span>
          <span className="text-red-400 font-bold text-sm leading-tight tabular-nums" style={IBMM}>{highCount}</span>
        </div>
        <div className="pl-3">
          <span className="text-[8px] text-slate-300 uppercase tracking-widest block" style={IBMM}>Districts</span>
          <span className="text-blue-400 font-bold text-sm leading-tight tabular-nums" style={IBMM}>{hotspots.length}</span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 border-t border-slate-800/10 flex items-center justify-end">
        <Link
          to="/map"
          className="flex items-center gap-1.5 text-[9px] text-slate-500 hover:text-blue-400 transition-colors duration-150 uppercase tracking-widest font-bold"
          style={IBMM}
        >
          <FaExternalLinkAlt className="text-[8px]" />
          Full Crime Map
        </Link>
      </div>
    </div>
  );
};

export default KarnatakaOverviewPanel;
