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
  Compass,
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
  zone: string;
  hospitalClass: string;
  specialization: string;
  caseCount: number;
  anomalyCount: number;
  cleanCount: number;
  focusModus: string[];
  coordinates: { x: number; y: number }; // viewBox coordinate 0..960 x 0..520
}

const JABODETABEK_LANDMARKS: HospitalLandmark[] = [
  {
    id: "HOSP-01",
    cohortId: "RS_SEJAHTERA",
    name: "RS Sejahtera Medika",
    region: "Jakarta Pusat (DKI Jakarta)",
    zone: "DKI Jakarta",
    hospitalClass: "Kelas A",
    specialization: "Kasus Bedah Mayor, Kardiologi & Alkes Implan",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Inflated Stent", "Upcoding Sepsis", "Unbundling Tindakan"],
    coordinates: { x: 480, y: 195 },
  },
  {
    id: "HOSP-02",
    cohortId: "RS_MITRA",
    name: "RS Mitra Sehat",
    region: "Tangerang Selatan (Banten)",
    zone: "Tangerang & Tangsel",
    hospitalClass: "Kelas B",
    specialization: "Kasus Rawat Inap, Neurologi & Severity Level",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Severity Upcoding", "Kaidah Koding", "Unbundling Pasca-Rawat"],
    coordinates: { x: 310, y: 245 },
  },
  {
    id: "HOSP-04",
    cohortId: "RS_SENTOSA",
    name: "RS Sentosa Kasih",
    region: "Kota Depok (Jawa Barat)",
    zone: "Depok",
    hospitalClass: "Kelas C",
    specialization: "Deteksi Fraud Semantik & Duplikasi Catatan Medis",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Note Cloning SOAP", "Template CPPT Massal", "Vektor Semantik"],
    coordinates: { x: 480, y: 300 },
  },
  {
    id: "HOSP-MULTI",
    cohortId: "MULTI_CENTER_BPJS",
    name: "Aglomerasi Jabodetabek (Multi-Faskes)",
    region: "Seluruh Wilayah Jabodetabek",
    zone: "Kawasan Megapolitan Jabodetabek",
    hospitalClass: "Jaringan Terintegrasi KCU",
    specialization: "Golden Dataset 30 Kasus Faskes Wilayah Jabodetabek",
    caseCount: 30,
    anomalyCount: 18,
    cleanCount: 12,
    focusModus: ["Alkes Implan", "Severity Inflation", "Note Cloning", "Unbundling"],
    coordinates: { x: 480, y: 145 },
  },
];

export function HospitalLandmarkMap({
  selectedCohortId,
  onSelectCohort,
}: HospitalLandmarkMapProps) {
  const [hoveredLandmark, setHoveredLandmark] = useState<HospitalLandmark | null>(null);

  // Active Landmark based on selectedCohortId
  const activeLandmark =
    JABODETABEK_LANDMARKS.find((lm) => lm.cohortId === selectedCohortId) ||
    JABODETABEK_LANDMARKS[0];

  const centralHub = { x: 480, y: 195 }; // Jakarta Pusat Hub

  return (
    <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xs overflow-hidden flex flex-col">
      {/* Top Map Action & Fast Selector Bar */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[3px] bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-tight flex items-center gap-1.5">
              <span>Peta Aglomerasi Faskes Jabodetabek</span>
              <span className="text-[10px] text-slate-500 font-normal capitalize">
                (Pilih landmark rumah sakit untuk pengujian)
              </span>
            </h3>
          </div>
        </div>

        {/* Quick Landmark Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {JABODETABEK_LANDMARKS.map((lm) => {
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
      <div className="relative w-full bg-slate-50/60 overflow-hidden select-none border-b border-slate-100 min-h-[420px] lg:min-h-[460px] flex items-center justify-center">
        {/* Subtle Map Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(#94a3b8 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #f8fafc 0.75px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0, 11px 11px",
          }}
        />

        {/* Latitude & Longitude Coordinate Marks */}
        <div className="absolute top-2.5 left-3.5 text-[9.5px] font-mono text-slate-400 pointer-events-none tracking-wider">
          KORIDOR METROPOLITAN JABODETABEK · 6°12&apos;S 106°49&apos;E
        </div>
        <div className="absolute bottom-2.5 left-3.5 text-[9.5px] font-mono text-slate-400 pointer-events-none">
          WILAYAH KERJA KCU BPJS KESEHATAN KANTOR REGIONAL IV
        </div>

        {/* SVG Map of Jabodetabek with Stylized Regional Boundaries */}
        <svg
          viewBox="0 0 960 520"
          className="w-full h-auto max-h-[500px] relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Gray Region Fill */}
            <linearGradient id="regionFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
            </linearGradient>

            {/* Selected Zone Highlight Gradient */}
            <linearGradient id="selectedZoneFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.9" />
            </linearGradient>

            {/* Sea Shoreline Water Fill */}
            <linearGradient id="seaWater" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 0. LAUT JAWA / TELUK JAKARTA (Coastal Water Body) */}
          <path
            d="M 120 120 
               Q 260 135, 410 125 
               Q 480 115, 550 122 
               Q 680 130, 840 115 
               L 840 40 
               L 120 40 Z"
            fill="url(#seaWater)"
            stroke="#bae6fd"
            strokeWidth="1"
          />
          <text x="440" y="80" fill="#0284c7" fontSize="10" fontWeight="600" letterSpacing="2" opacity="0.6">
            TELUK JAKARTA / LAUT JAWA
          </text>

          {/* Kepulauan Seribu subtle offshore islands */}
          <circle cx="380" cy="65" r="3.5" fill="#93c5fd" />
          <circle cx="400" cy="55" r="4.5" fill="#93c5fd" />
          <circle cx="425" cy="68" r="3" fill="#93c5fd" />
          <text x="435" y="60" fill="#64748b" fontSize="8" fontFamily="monospace">
            Kep. Seribu
          </text>

          {/* 1. WILAYAH TANGERANG & TANGERANG SELATAN (BANTEN - Sisi Barat) */}
          <path
            d="M 180 130 
               L 390 135 
               L 410 210 
               L 410 275 
               L 360 310 
               L 260 300 
               L 180 230 Z"
            fill={activeLandmark.zone === "Tangerang & Tangsel" ? "url(#selectedZoneFill)" : "url(#regionFill)"}
            stroke={activeLandmark.zone === "Tangerang & Tangsel" ? "#3b82f6" : "#cbd5e1"}
            strokeWidth={activeLandmark.zone === "Tangerang & Tangsel" ? "1.8" : "1.2"}
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
          <text x="240" y="195" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1">
            KOTA TANGERANG
          </text>
          <text x="250" y="270" fill="#475569" fontSize="10" fontWeight="600">
            TANGERANG SELATAN
          </text>

          {/* 2. WILAYAH DKI JAKARTA (Pusat Metropolitan) */}
          <path
            d="M 390 135 
               L 550 122 
               L 560 210 
               L 545 260 
               L 410 260 
               L 410 210 Z"
            fill={activeLandmark.zone === "DKI Jakarta" ? "url(#selectedZoneFill)" : "url(#regionFill)"}
            stroke={activeLandmark.zone === "DKI Jakarta" ? "#2563eb" : "#94a3b8"}
            strokeWidth={activeLandmark.zone === "DKI Jakarta" ? "2" : "1.4"}
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
          {/* Jakarta Internal District boundary separators */}
          <line x1="390" y1="180" x2="555" y2="175" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="1" />
          <line x1="480" y1="130" x2="480" y2="260" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="1" />
          <text x="445" y="165" fill="#1e293b" fontSize="11" fontWeight="800" letterSpacing="1.5">
            DKI JAKARTA
          </text>
          <text x="425" y="240" fill="#64748b" fontSize="9" fontWeight="600">
            JAKARTA SELATAN
          </text>
          <text x="495" y="240" fill="#64748b" fontSize="9" fontWeight="600">
            JAKARTA TIMUR
          </text>

          {/* 3. WILAYAH KOTA & KABUPATEN BEKASI (Jawa Barat - Sisi Timur) */}
          <path
            d="M 550 122 
               L 780 120 
               L 770 240 
               L 720 290 
               L 550 280 
               L 560 210 Z"
            fill={activeLandmark.zone === "Bekasi" ? "url(#selectedZoneFill)" : "url(#regionFill)"}
            stroke={activeLandmark.zone === "Bekasi" ? "#3b82f6" : "#cbd5e1"}
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
          <text x="610" y="180" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1">
            KOTA BEKASI
          </text>
          <text x="635" y="250" fill="#94a3b8" fontSize="9.5" fontWeight="500">
            KAB. BEKASI (Cikarang)
          </text>

          {/* 4. WILAYAH KOTA DEPOK (Jawa Barat - Koridor Tengah) */}
          <path
            d="M 410 260 
               L 545 260 
               L 545 330 
               L 410 330 Z"
            fill={activeLandmark.zone === "Depok" ? "url(#selectedZoneFill)" : "url(#regionFill)"}
            stroke={activeLandmark.zone === "Depok" ? "#2563eb" : "#94a3b8"}
            strokeWidth={activeLandmark.zone === "Depok" ? "2" : "1.2"}
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
          <text x="445" y="295" fill="#1e293b" fontSize="11" fontWeight="700" letterSpacing="1">
            KOTA DEPOK
          </text>

          {/* 5. WILAYAH KOTA & KABUPATEN BOGOR (Jawa Barat - Sisi Selatan) */}
          <path
            d="M 360 310 
               L 410 330 
               L 545 330 
               L 720 290 
               L 710 440 
               L 580 470 
               L 430 465 
               L 360 400 Z"
            fill={activeLandmark.zone === "Bogor" ? "url(#selectedZoneFill)" : "url(#regionFill)"}
            stroke={activeLandmark.zone === "Bogor" ? "#3b82f6" : "#cbd5e1"}
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
          <text x="450" y="375" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1">
            KOTA BOGOR
          </text>
          <text x="440" y="445" fill="#94a3b8" fontSize="9.5" fontWeight="500">
            KABUPATEN BOGOR
          </text>

          {/* TRANSPORT & HEALTHCARE REFERRAL CONDUITS (Tollways connecting hospitals) */}
          <g opacity="0.45" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3">
            {/* Tol Jagorawi (Jakarta -> Depok -> Bogor) */}
            <line x1="480" y1="195" x2="480" y2="300" />
            <line x1="480" y1="300" x2="470" y2="390" />
            {/* Tol JORR / Merak (Jakarta -> Tangerang Selatan) */}
            <line x1="480" y1="195" x2="310" y2="245" />
            {/* Tol Jakarta-Cikampek (Jakarta -> Bekasi) */}
            <line x1="480" y1="195" x2="630" y2="215" />
          </g>

          {/* Standby Partner Hospitals in Bekasi & Bogor */}
          {/* RS Hermina Medika (Bekasi) */}
          <g opacity="0.65" className="cursor-pointer" onClick={() => onSelectCohort("MULTI_CENTER_BPJS")}>
            <circle cx="630" cy="215" r="5" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="630" cy="215" r="2" fill="#64748b" />
            <text x="640" y="218" fill="#475569" fontSize="8.5" fontWeight="600">
              RS Hermina (Bekasi)
            </text>
          </g>

          {/* RSUD Salak Medika (Bogor) */}
          <g opacity="0.65" className="cursor-pointer" onClick={() => onSelectCohort("MULTI_CENTER_BPJS")}>
            <circle cx="470" cy="390" r="5" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="470" cy="390" r="2" fill="#64748b" />
            <text x="480" y="393" fill="#475569" fontSize="8.5" fontWeight="600">
              RSUD Salak (Bogor)
            </text>
          </g>

          {/* Multi-Center Network Flight lines when Multi-Center is selected */}
          {selectedCohortId === "MULTI_CENTER_BPJS" && (
            <g className="opacity-90">
              <line
                x1={centralHub.x}
                y1={centralHub.y}
                x2="310"
                y2="245"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <line
                x1={centralHub.x}
                y1={centralHub.y}
                x2="480"
                y2="300"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <line
                x1={centralHub.x}
                y1={centralHub.y}
                x2="630"
                y2="215"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <line
                x1={centralHub.x}
                y1={centralHub.y}
                x2="470"
                y2="390"
                stroke="#2563eb"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              {/* Metropolitan Perimeter Coverage Ring */}
              <circle
                cx={centralHub.x}
                cy="270"
                r="185"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.2"
                strokeDasharray="6 6"
                opacity="0.35"
              />
            </g>
          )}

          {/* PRIMARY JABODETABEK LANDMARK PINS */}
          {JABODETABEK_LANDMARKS.map((lm) => {
            const isSelected = selectedCohortId === lm.cohortId;
            const isHovered = hoveredLandmark?.id === lm.id;
            const { x, y } = lm.coordinates;

            // Multi-Center has a distinct command badge at top of Jakarta
            if (lm.id === "HOSP-MULTI") {
              return null;
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
                      r="18"
                      fill="#3b82f6"
                      opacity="0.25"
                      className="animate-ping"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="24"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="1.2"
                      opacity="0.4"
                    />
                  </>
                )}

                {/* Base Landmark Ground Shadow */}
                <ellipse
                  cx={x}
                  cy={y + 11}
                  rx="6"
                  ry="2.5"
                  fill="#475569"
                  opacity="0.3"
                />

                {/* Landmark Pin Body */}
                <g transform={`translate(${x - 14}, ${y - 26})`}>
                  <path
                    d="M 14 0 C 6.5 0 0 6.5 0 14 C 0 23 14 34 14 34 C 14 34 28 23 28 14 C 28 6.5 21.5 0 14 0 Z"
                    fill={isSelected ? "#1d4ed8" : isHovered ? "#0284c7" : "#ffffff"}
                    stroke={isSelected ? "#1e40af" : "#64748b"}
                    strokeWidth="1.5"
                    filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))"
                  />

                  {/* Inner hospital icon cross */}
                  <circle
                    cx="14"
                    cy="13"
                    r="6.5"
                    fill={isSelected ? "#ffffff" : "#f8fafc"}
                  />
                  <path
                    d="M 14 9.5 L 14 16.5 M 10.5 13 L 17.5 13"
                    stroke={isSelected ? "#1d4ed8" : "#334155"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>

                {/* Landmark Floating Label Box */}
                <g transform={`translate(${x}, ${y - 32})`}>
                  <rect
                    x={x > 450 ? -150 : 10}
                    y="-13"
                    width="145"
                    height="22"
                    rx="3"
                    fill={isSelected ? "#0f172a" : "#ffffff"}
                    stroke={isSelected ? "#0f172a" : "#94a3b8"}
                    strokeWidth="1"
                    filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.1))"
                  />
                  <text
                    x={x > 450 ? -77 : 82}
                    y="2"
                    textAnchor="middle"
                    fill={isSelected ? "#ffffff" : "#0f172a"}
                    fontSize="9.5"
                    fontWeight="700"
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
