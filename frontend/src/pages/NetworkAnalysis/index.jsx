import React, { useState, useEffect, useMemo } from "react";
import { 
  RiNodeTree, 
  RiRouteLine, 
  RiShieldUserLine, 
  RiTeamLine, 
  RiBuilding2Line,
  RiRefreshLine,
  RiDownload2Line,
  RiSparklingFill
} from "react-icons/ri";
import { networkService } from "../../services/networkService";
import { recordService } from "../../services/recordService";
import { crimeService } from "../../services/crimeService";
import NetworkFiltersToolbar from "../../components/network/NetworkFiltersToolbar";
import CrossJurisdictionFinder from "../../components/network/CrossJurisdictionFinder";
import NetworkGraphCanvas from "../../components/network/NetworkGraphCanvas";
import NodeDetailsDossier from "../../components/network/NodeDetailsDossier";

export default function NetworkAnalysis() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru City");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isSimulationActive, setIsSimulationActive] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const [activeNodeTypes, setActiveNodeTypes] = useState({
    SUSPECT: true,
    LOCATION: true,
    COMPLAINANT: true,
    SYNDICATE: true
  });

  // State to trigger re-renders on database sync
  const [dbVersion, setDbVersion] = useState(0);

  // Subscribe to real-time database changes from recordService
  useEffect(() => {
    const unsubscribe = recordService.subscribe(() => {
      setDbVersion((v) => v + 1);
    });
    return () => unsubscribe();
  }, []);

  const districts = useMemo(() => crimeService.getDistricts(), []);
  const categories = useMemo(() => crimeService.getCategories(), []);

  // Compute live graph data from database
  const { allNodes, allEdges, metrics, crossDistrictSuspects } = useMemo(() => {
    const data = networkService.getGraphData({
      district: selectedDistrict,
      category: selectedCategory,
      search: searchTerm
    });

    const crossSuspects = networkService.getCrossJurisdictionSuspects();

    return {
      allNodes: data.nodes,
      allEdges: data.edges,
      metrics: data.metrics,
      crossDistrictSuspects: crossSuspects
    };
  }, [selectedDistrict, selectedCategory, searchTerm, dbVersion]);

  // Filter nodes based on active entity layer toggles
  const filteredNodes = useMemo(() => {
    return allNodes.filter((n) => activeNodeTypes[n.type]);
  }, [allNodes, activeNodeTypes]);

  // Filter edges connected only to visible nodes
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    return allEdges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );
  }, [allEdges, filteredNodes]);

  // Selected node entity for the dossier drawer
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return allNodes.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId, allNodes]);

  const toggleNodeType = (typeKey) => {
    setActiveNodeTypes((prev) => ({
      ...prev,
      [typeKey]: !prev[typeKey]
    }));
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNodeId(null);
  };

  const handleSelectSuspect = (suspectId) => {
    setSelectedNodeId(suspectId);
    setZoomLevel(1.3);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b1329]/80 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <RiSparklingFill className="text-xs text-blue-400" />
              <span>CCTNS Criminal Intelligence & Link Matrix</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Live Database Connected
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <RiNodeTree className="text-blue-500 text-3xl" />
            <span>Criminological Link & Network Analysis</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Visualizing interconnected crime networks, co-accused rings, and cross-jurisdictional trails across Karnataka police stations to eliminate Excel data silos.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleResetView}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <RiRefreshLine className="text-sm" />
            <span>Reset Matrix</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Total Entities</span>
            <RiNodeTree className="text-blue-400 text-base" />
          </div>
          <p className="text-xl font-bold text-white font-mono">{metrics.totalNodes}</p>
          <span className="text-[10px] text-slate-500">In Active Scope</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Suspects</span>
            <RiShieldUserLine className="text-red-400 text-base" />
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{metrics.suspectsCount}</p>
          <span className="text-[10px] text-slate-500">Accused Entities</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Multi-District</span>
            <RiRouteLine className="text-amber-400 text-base" />
          </div>
          <p className="text-xl font-bold text-amber-400 font-mono">{metrics.crossDistrictSuspectsCount}</p>
          <span className="text-[10px] text-amber-500/80 font-medium">Cross-Jurisdiction</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Crime Rings</span>
            <RiTeamLine className="text-purple-400 text-base" />
          </div>
          <p className="text-xl font-bold text-purple-400 font-mono">{metrics.syndicatesCount}</p>
          <span className="text-[10px] text-slate-500">Active Syndicates</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Co-Accused Links</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <p className="text-xl font-bold text-white font-mono">{metrics.coAccusedLinksCount}</p>
          <span className="text-[10px] text-slate-500">Shared Offences</span>
        </div>

        <div className="bg-[#0b1329]/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Police Stations</span>
            <RiBuilding2Line className="text-blue-400 text-base" />
          </div>
          <p className="text-xl font-bold text-blue-400 font-mono">{metrics.stationsCount}</p>
          <span className="text-[10px] text-slate-500">Precinct Nodes</span>
        </div>
      </div>

      {/* Cross-Jurisdiction Connection Finder Banner */}
      <CrossJurisdictionFinder
        crossDistrictSuspects={crossDistrictSuspects}
        selectedSuspectId={selectedNodeId}
        onSelectSuspect={handleSelectSuspect}
      />

      {/* Filter & Physics Toolbar */}
      <NetworkFiltersToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeNodeTypes={activeNodeTypes}
        toggleNodeType={toggleNodeType}
        isSimulationActive={isSimulationActive}
        setIsSimulationActive={setIsSimulationActive}
        onResetView={handleResetView}
        districts={districts}
        categories={categories}
      />

      {/* Main Interactive Force-Directed Network Graph */}
      <div className="relative">
        <NetworkGraphCanvas
          nodes={filteredNodes}
          edges={filteredEdges}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          isSimulationActive={isSimulationActive}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          panOffset={panOffset}
          setPanOffset={setPanOffset}
        />

        {/* Selected Entity Dossier Flyout Panel */}
        <NodeDetailsDossier
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onFocusNode={handleSelectSuspect}
        />
      </div>
    </div>
  );
}
