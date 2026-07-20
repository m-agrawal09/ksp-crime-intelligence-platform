import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { crimeService } from "../../services/crimeService";
import { recordService } from "../../services/recordService";

// ── Exact same tile layers as InteractiveMap.jsx ──────────────────────────
const MAP_LAYERS = {
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
  streets: {
    label: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

const KARNATAKA_CENTER = [14.5, 76.2];
const PANEL_ZOOM = 6.5;

// ── Cluster icon (same colour logic as InteractiveMap) ────────────────────
const createClusterIcon = (count) => {
  const isHigh = count > 15;
  const isMid  = count > 6;
  const size   = isHigh ? 36 : isMid ? 30 : 24;
  const color  = isHigh ? "#ef4444" : isMid ? "#f59e0b" : "#3b82f6";
  const border = isHigh ? "#dc2626" : isMid ? "#d97706" : "#2563eb";
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color}CC;border:2px solid ${border};
        display:flex;align-items:center;justify-content:center;
        font-family:'IBM Plex Mono',monospace;font-weight:700;
        font-size:${size > 30 ? 11 : 9}px;color:#fff;
        box-shadow:0 0 ${Math.round(size * 0.55)}px ${color}55;
        ${isHigh ? "animation:ping-slow 2s infinite;" : ""}
      ">${count}</div>
    `,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ── Individual incident marker ─────────────────────────────────────────────
const SEV_COLOR = {
  CRITICAL: "#ef4444",
  HIGH:     "#f59e0b",
  MEDIUM:   "#3b82f6",
  LOW:      "#64748b",
};

const createIncidentIcon = (severity) => {
  const color = SEV_COLOR[severity] || SEV_COLOR.MEDIUM;
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:16px;height:16px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:14px;height:14px;border-radius:50%;background:${color};opacity:0.22;"></span>
        <span style="position:relative;width:7px;height:7px;border-radius:50%;background:${color};border:1.5px solid rgba(255,255,255,0.8);box-shadow:0 0 6px ${color}99;"></span>
      </div>
    `,
    iconSize:   [16, 16],
    iconAnchor: [8, 8],
  });
};

// ─────────────────────────────────────────────────────────────────────────────
const KarnatakaOverviewPanel = () => {
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const tileLayerRef    = useRef(null);
  const markersLayerRef = useRef(null);
  const zoomRef         = useRef(PANEL_ZOOM);

  const [tick, setTick]           = useState(0);
  const [activeLayer, setActiveLayer] = useState("dark");
  const [zoomLevel, setZoomLevel] = useState(PANEL_ZOOM);

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
      // ── FULLY INTERACTIVE ──
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
    const tile = L.tileLayer(MAP_LAYERS.dark.url, {
      attribution: MAP_LAYERS.dark.attribution,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tile;

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
    if (!mapRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    const showClusters = zoomLevel < 8.2;

    if (showClusters) {
      // District clusters
      const clusters = {};
      incidents.forEach((inc) => {
        if (!clusters[inc.district]) {
          clusters[inc.district] = {
            count: 0,
            lat:   inc.districtCenter.lat,
            lng:   inc.districtCenter.lng,
          };
        }
        clusters[inc.district].count++;
      });

      Object.entries(clusters).forEach(([district, data]) => {
        L.marker([data.lat, data.lng], { icon: createClusterIcon(data.count) })
          .bindTooltip(
            `<span style="font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.05em;text-transform:uppercase;">${district}: ${data.count} FIRs</span>`,
            { direction: "top", offset: [0, -10], opacity: 1 }
          )
          .addTo(markersLayerRef.current);
      });
    } else {
      // Individual incident pins
      incidents.forEach((inc) => {
        L.marker([inc.lat, inc.lng], { icon: createIncidentIcon(inc.severity) })
          .bindTooltip(
            `<span style="font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;">${inc.caseNo} · ${inc.severity}</span>`,
            { direction: "top", offset: [0, -6], opacity: 1 }
          )
          .addTo(markersLayerRef.current);
      });
    }
  }, [incidents, zoomLevel]);

  const IBMM = { fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <div className="rounded-[4px] border border-slate-800/20 bg-slate-900/50 overflow-hidden animate-fade-in-up flex flex-col">

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
          <span className="text-[8px] text-slate-600 uppercase tracking-widest block" style={IBMM}>Active</span>
          <span className="text-amber-400 font-bold text-sm leading-tight tabular-nums" style={IBMM}>{activeCount}</span>
        </div>
        <div className="px-3">
          <span className="text-[8px] text-slate-600 uppercase tracking-widest block" style={IBMM}>High Risk</span>
          <span className="text-red-400 font-bold text-sm leading-tight tabular-nums" style={IBMM}>{highCount}</span>
        </div>
        <div className="pl-3">
          <span className="text-[8px] text-slate-600 uppercase tracking-widest block" style={IBMM}>Districts</span>
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
