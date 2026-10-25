"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
  Navigation,
} from "lucide-react";
import { BenchmarkCohort, BENCHMARK_COHORTS } from "@/lib/benchmarkCohorts";
import { cn } from "@/lib/utils";

interface HospitalLandmarkMapProps {
  selectedCohortId: string;
  onSelectCohort: (cohortId: string) => void;
}

interface HospitalLandmark {
  id: string;
  cohortId: string;
  name: string;
  region: string;
  island: string;
  hospitalClass: string;
  specialization: string;
  caseCount: number;
  anomalyCount: number;
  cleanCount: number;
  focusModus: string[];
  coordinates: { x: number; y: number }; // viewBox coordinate 0..960 x 0..440
}

const HOSPITAL_LANDMARKS: HospitalLandmark[] = [
  {
    id: "HOSP-01",
    cohortId: "RS_SEJAHTERA",
    name: "RS Sejahtera Medika",
    region: "DKI Jakarta (Pusat)",
    island: "Jawa",
    hospitalClass: "Kelas A",
    specialization: "Kasus Bedah Mayor, Kardiologi & Alkes Implan",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Inflated Stent", "Upcoding Sepsis", "Unbundling Tindakan"],
    coordinates: { x: 312, y: 326 },
  },
  {
    id: "HOSP-02",
    cohortId: "RS_MITRA",
    name: "RS Mitra Sehat",
    region: "Surabaya, Jawa Timur",
    island: "Jawa",
    hospitalClass: "Kelas B",
    specialization: "Kasus Rawat Inap, Neurologi & Severity Level",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Severity Upcoding", "Kaidah Koding", "Unbundling Pasca-Rawat"],
    coordinates: { x: 446, y: 342 },
  },
  {
    id: "HOSP-04",
    cohortId: "RS_SENTOSA",
    name: "RS Sentosa Kasih",
    region: "Medan, Sumatera Utara",
    island: "Sumatera",
    hospitalClass: "Kelas C",
    specialization: "Deteksi Fraud Semantik & Duplikasi Catatan Medis",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Note Cloning SOAP", "Template CPPT Massal", "Vektor Semantik"],
    coordinates: { x: 154, y: 154 },
  },
  {
    id: "HOSP-MULTI",
    cohortId: "MULTI_CENTER_BPJS",
    name: "Multi-Center Nasional BPJS",
    region: "Seluruh Wilayah Faskes Mitra",
    island: "Nasional",
    hospitalClass: "Pusat Rujukan Nasional",
    specialization: "Golden Dataset 30 Kasus Terstandar Nasional",
    caseCount: 30,
    anomalyCount: 18,
    cleanCount: 12,
    focusModus: ["Alkes Implan", "Severity Inflation", "Note Cloning", "Unbundling"],
    coordinates: { x: 325, y: 292 },
  },
];

export function HospitalLandmarkMap({
  selectedCohortId,
  onSelectCohort,
}: HospitalLandmarkMapProps) {
  const [hoveredLandmark, setHoveredLandmark] = useState<HospitalLandmark | null>(null);

  // Active Landmark based on selectedCohortId
  const activeLandmark =
    HOSPITAL_LANDMARKS.find((lm) => lm.cohortId === selectedCohortId) ||
    HOSPITAL_LANDMARKS[0];

  // Jakarta Hub Coordinates for network flight lines
  const jakartaHub = { x: 312, y: 326 };

  return (
    <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xs overflow-hidden flex flex-col">
      {/* Top Map Action & Fast Selector Bar */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[3px] bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-tight flex items-center gap-1.5">
              <span>Peta Distribusi Faskes Terverifikasi</span>
              <span className="text-[10px] text-slate-500 font-normal capitalize">
                (Pilih landmark RS untuk pengujian)
              </span>
            </h3>
          </div>
        </div>

        {/* Quick Landmark Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {HOSPITAL_LANDMARKS.map((lm) => {
            const isSelected = selectedCohortId === lm.cohortId;
            return (
              <button
                key={lm.id}
                type="button"
                onClick={() => onSelectCohort(lm.cohortId)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-[4px] border transition-colors flex items-center gap-1.5 cursor-pointer",
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70"
                )}
              >
                <MapPin
                  className={cn(
                    "w-3 h-3 flex-shrink-0",
                    isSelected ? "text-blue-400" : "text-slate-400"
                  )}
                />
                <span>{lm.name}</span>
                <span
                  className={cn(
                    "text-[10px] tabular-nums px-1 rounded-[2px]",
                    isSelected ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {lm.caseCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Geospatial Vector Map Canvas */}
      <div className="relative w-full bg-slate-50/60 overflow-hidden select-none border-b border-slate-100 min-h-[380px] lg:min-h-[420px] flex items-center justify-center">
        {/* Subtle Map Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #f8fafc 0.75px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0, 12px 12px",
          }}
        />

        {/* Latitude & Longitude Coordinate Marks */}
        <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-400 pointer-events-none tracking-wider">
          LAT 06°10&apos;S · LONG 106°49&apos;E [WILAYAH JKN NASIONAL]
        </div>
        <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-400 pointer-events-none">
          EKOSISTEM KLAIM FKRTL KCU BPJS
        </div>

        {/* SVG Map of Indonesia with Stylized Island Masses */}
        <svg
          viewBox="0 0 960 440"
          className="w-full h-auto max-h-[460px] relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle Gradient for Island Silhouette */}
            <linearGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.8" />
            </linearGradient>

            {/* Selected Island Highlight Gradient */}
            <linearGradient id="islandHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Coordinate Axis Reference Lines */}
          <line
            x1="40"
            y1="220"
            x2="920"
            y2="220"
            stroke="#e2e8f0"
            strokeDasharray="4 6"
            strokeWidth="1"
          />
          <text x="50" y="214" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            0° Khatulistiwa (Equator)
          </text>

          {/* 1. PULAU SUMATERA */}
          <path
            d="M 120 100 
               L 165 110 
               L 190 145 
               L 225 180 
               L 255 235 
               L 270 275 
               L 250 285 
               L 215 250 
               L 175 195 
               L 135 150 
               L 105 115 Z"
            fill={activeLandmark.island === "Sumatera" ? "url(#islandHighlight)" : "url(#islandGrad)"}
            stroke={activeLandmark.island === "Sumatera" ? "#93c5fd" : "#94a3b8"}
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300 hover:fill-slate-300"
          />
          <text x="145" y="225" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
            SUMATERA
          </text>

          {/* 2. PULAU JAWA */}
          <path
            d="M 285 320 
               L 330 322 
               L 380 326 
               L 440 332 
               L 490 336 
               L 515 345 
               L 480 355 
               L 420 352 
               L 360 348 
               L 305 340 
               L 280 330 Z"
            fill={activeLandmark.island === "Jawa" ? "url(#islandHighlight)" : "url(#islandGrad)"}
            stroke={activeLandmark.island === "Jawa" ? "#93c5fd" : "#94a3b8"}
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300 hover:fill-slate-300"
          />
          <text x="365" y="365" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
            JAWA
          </text>

          {/* 3. PULAU KALIMANTAN */}
          <path
            d="M 350 145 
               L 420 135 
               L 475 160 
               L 485 210 
               L 455 255 
               L 395 265 
               L 355 240 
               L 340 185 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300 hover:fill-slate-300"
          />
          <text x="390" y="200" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
            KALIMANTAN
          </text>

          {/* 4. PULAU SULAWESI */}
          <path
            d="M 545 155 
               L 590 140 
               L 625 155 
               L 600 190 
               L 630 220 
               L 605 260 
               L 580 235 
               L 570 195 
               L 540 185 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300 hover:fill-slate-300"
          />
          <text x="565" y="230" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
            SULAWESI
          </text>

          {/* 5. BALI, NUSA TENGGARA */}
          <path
            d="M 525 348 L 545 348 L 540 354 L 525 354 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <path
            d="M 552 349 L 580 349 L 575 356 L 550 356 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <path
            d="M 590 350 L 640 352 L 635 360 L 585 358 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <text x="550" y="372" fill="#64748b" fontSize="9" fontWeight="500">
            BALI &amp; NT
          </text>

          {/* 6. KEPULAUAN MALUKU */}
          <path
            d="M 685 180 L 715 175 L 725 210 L 695 220 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <path
            d="M 680 235 L 710 240 L 705 270 L 675 265 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* 7. PAPUA */}
          <path
            d="M 770 195 
               L 810 185 
               L 890 205 
               L 885 285 
               L 830 280 
               L 800 245 
               L 765 220 Z"
            fill="url(#islandGrad)"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300 hover:fill-slate-300"
          />
          <text x="815" y="240" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="1">
            PAPUA
          </text>

          {/* Flight/Network Hub Lines from Jakarta Hub to Regional Hospitals */}
          {selectedCohortId === "MULTI_CENTER_BPJS" && (
            <g className="opacity-80">
              <line
                x1={jakartaHub.x}
                y1={jakartaHub.y}
                x2="154"
                y2="154"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <line
                x1={jakartaHub.x}
                y1={jakartaHub.y}
                x2="446"
                y2="342"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            </g>
          )}

          {/* Multi-Center Coverage Ring when Multi-Center is selected */}
          {selectedCohortId === "MULTI_CENTER_BPJS" && (
            <circle
              cx={jakartaHub.x}
              cy={jakartaHub.y}
              r="260"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="6 6"
              opacity="0.3"
            />
          )}

          {/* LANDMARK PINS */}
          {HOSPITAL_LANDMARKS.map((lm) => {
            const isSelected = selectedCohortId === lm.cohortId;
            const isHovered = hoveredLandmark?.id === lm.id;
            const { x, y } = lm.coordinates;

            // Multi-Center is represented as central national node
            if (lm.id === "HOSP-MULTI") {
              return null; // Rendered via separate button & network
            }

            return (
              <g
                key={lm.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectCohort(lm.cohortId)}
                onMouseEnter={() => setHoveredLandmark(lm)}
                onMouseLeave={() => setHoveredLandmark(null)}
              >
                {/* Active Radar Pulse Circles */}
                {isSelected && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="#3b82f6"
                      opacity="0.25"
                      className="animate-ping"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="22"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  </>
                )}

                {/* Base Landmark Dot / Anchor */}
                <circle
                  cx={x}
                  cy={y + 10}
                  r="4"
                  fill="#64748b"
                  opacity="0.5"
                />

                {/* Landmark Pin Body */}
                <g transform={`translate(${x - 14}, ${y - 24})`}>
                  {/* Pin shape */}
                  <path
                    d="M 14 0 C 6.5 0 0 6.5 0 14 C 0 23 14 34 14 34 C 14 34 28 23 28 14 C 28 6.5 21.5 0 14 0 Z"
                    fill={isSelected ? "#1d4ed8" : isHovered ? "#0284c7" : "#ffffff"}
                    stroke={isSelected ? "#1e40af" : "#94a3b8"}
                    strokeWidth="1.5"
                    filter="drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.15))"
                  />

                  {/* Inner hospital icon dot */}
                  <circle
                    cx="14"
                    cy="13"
                    r="6"
                    fill={isSelected ? "#ffffff" : "#f1f5f9"}
                  />
                  <path
                    d="M 14 10 L 14 16 M 11 13 L 17 13"
                    stroke={isSelected ? "#1d4ed8" : "#475569"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* Landmark Floating Label Box */}
                <g transform={`translate(${x}, ${y - 30})`}>
                  <rect
                    x={x > 400 ? -130 : -10}
                    y="-12"
                    width="140"
                    height="20"
                    rx="3"
                    fill={isSelected ? "#0f172a" : "#ffffff"}
                    stroke={isSelected ? "#0f172a" : "#cbd5e1"}
                    strokeWidth="1"
                    filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.08))"
                  />
                  <text
                    x={x > 400 ? -60 : 60}
                    y="2"
                    textAnchor="middle"
                    fill={isSelected ? "#ffffff" : "#1e293b"}
                    fontSize="9.5"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {lm.name} ({lm.caseCount}k)
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Active Landmark Inspector Overlay (Right side of Map) */}
        <div className="absolute bottom-3 right-3 max-w-sm w-full md:w-80 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-[4px] p-3.5 shadow-md space-y-2 z-20">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-[2px] uppercase">
                {activeLandmark.hospitalClass}
              </span>
              <h4 className="font-bold text-slate-900 text-xs mt-1">
                {activeLandmark.name}
              </h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{activeLandmark.region}</span>
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-base font-extrabold text-slate-900 tabular-nums">
                {activeLandmark.caseCount}
              </span>
              <span className="text-[10px] text-slate-500 block">Kasus Uji</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug border-t border-slate-100 pt-2">
            {activeLandmark.specialization}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {activeLandmark.focusModus.map((fm, idx) => (
              <span
                key={idx}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium"
              >
                {fm}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500 tabular-nums">
            <span className="text-emerald-700 font-semibold">
              {activeLandmark.anomalyCount} Kasus Anomali
            </span>
            <span>·</span>
            <span className="text-slate-600">
              {activeLandmark.cleanCount} Kasus Wajar
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-[2px] font-medium border border-emerald-200 ml-auto">
              Aktif Terpilih
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
