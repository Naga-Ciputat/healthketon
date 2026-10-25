"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Building2,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  Navigation,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";
import { BenchmarkCohort, BENCHMARK_COHORTS } from "@/lib/benchmarkCohorts";
import { cn } from "@/lib/utils";

interface HospitalLandmarkMapProps {
  selectedCohortId: string;
  onSelectCohort: (cohortId: string) => void;
}

interface JabodetabekLandmark {
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
  lat: number;
  lng: number;
}

const JABODETABEK_LANDMARKS: JabodetabekLandmark[] = [
  {
    id: "HOSP-01",
    cohortId: "RS_SEJAHTERA",
    name: "RS Sejahtera Medika",
    region: "Salemba, Jakarta Pusat (DKI Jakarta)",
    zone: "DKI Jakarta",
    hospitalClass: "Kelas A",
    specialization: "Kasus Bedah Mayor, Kardiologi & Alkes Implan",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Inflated Stent", "Upcoding Sepsis", "Unbundling Tindakan"],
    lat: -6.1950,
    lng: 106.8480,
  },
  {
    id: "HOSP-02",
    cohortId: "RS_MITRA",
    name: "RS Mitra Sehat",
    region: "BSD City, Tangerang Selatan (Banten)",
    zone: "Tangerang Selatan",
    hospitalClass: "Kelas B",
    specialization: "Kasus Rawat Inap, Neurologi & Severity Level",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Severity Upcoding", "Kaidah Koding", "Unbundling Pasca-Rawat"],
    lat: -6.3020,
    lng: 106.6740,
  },
  {
    id: "HOSP-04",
    cohortId: "RS_SENTOSA",
    name: "RS Sentosa Kasih",
    region: "Margonda, Kota Depok (Jawa Barat)",
    zone: "Kota Depok",
    hospitalClass: "Kelas C",
    specialization: "Deteksi Fraud Semantik & Duplikasi Catatan Medis",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Note Cloning SOAP", "Template CPPT Massal", "Vektor Semantik"],
    lat: -6.3980,
    lng: 106.8280,
  },
  {
    id: "HOSP-06",
    cohortId: "MULTI_CENTER_BPJS",
    name: "RS Hermina Medika (Bekasi)",
    region: "Ahmad Yani, Kota Bekasi (Jawa Barat)",
    zone: "Kota Bekasi",
    hospitalClass: "Kelas B",
    specialization: "Mitra Koridor Jawa Barat - Kaidah Koding INA-CBG",
    caseCount: 10,
    anomalyCount: 5,
    cleanCount: 5,
    focusModus: ["Kaidah Koding", "Unbundling Paket", "Alkes Bedah"],
    lat: -6.2380,
    lng: 106.9920,
  },
  {
    id: "HOSP-05",
    cohortId: "MULTI_CENTER_BPJS",
    name: "RSUD Salak Medika (Bogor)",
    region: "Pajajaran, Kota Bogor (Jawa Barat)",
    zone: "Kota Bogor",
    hospitalClass: "Kelas B",
    specialization: "Mitra Koridor Selatan - Audit Resep & Rekam Medis",
    caseCount: 10,
    anomalyCount: 4,
    cleanCount: 6,
    focusModus: ["Audit Obat Kronis", "Klaim Rawat Inap", "Severity II"],
    lat: -6.5890,
    lng: 106.7970,
  },
  {
    id: "HOSP-MULTI",
    cohortId: "MULTI_CENTER_BPJS",
    name: "Aglomerasi Jabodetabek (Multi-Faskes)",
    region: "Seluruh Koridor Metropolitan Jabodetabek",
    zone: "Aglomerasi Jabodetabek",
    hospitalClass: "Jaringan Terintegrasi KCU",
    specialization: "Golden Dataset 30 Kasus Terstandar Jabodetabek",
    caseCount: 30,
    anomalyCount: 18,
    cleanCount: 12,
    focusModus: ["Alkes Implan", "Severity Inflation", "Note Cloning", "Unbundling"],
    lat: -6.2400,
    lng: 106.8300,
  },
];

export function HospitalLandmarkMap({
  selectedCohortId,
  onSelectCohort,
}: HospitalLandmarkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [isMapReady, setIsMapReady] = useState(false);

  // Active Landmark based on selectedCohortId
  const activeLandmark =
    JABODETABEK_LANDMARKS.find((lm) => lm.cohortId === selectedCohortId) ||
    JABODETABEK_LANDMARKS[0];

  // Initialize Real Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Center of Jabodetabek: [-6.26, 106.82], Zoom 10.5
      const map = L.map(mapContainerRef.current, {
        center: [-6.26, 106.82],
        zoom: 10,
        minZoom: 9,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Zoom Control at top-left
      L.control
        .zoom({
          position: "topleft",
        })
        .addTo(map);

      // Attribution control at bottom-left
      L.control
        .attribution({
          position: "bottomleft",
          prefix: "Peta Jabodetabek &copy; Esri &copy; OpenStreetMap",
        })
        .addTo(map);

      // Clean, modern Esri World Light Gray Canvas (No API key required, zero watermark)
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
        }
      ).addTo(map);

      // Reference Labels layer for Jabodetabek districts and roads (No API key required)
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Pan when selection changes or map becomes ready
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    let isMounted = true;

    async function renderMarkers() {
      const L = await import("leaflet");
      if (!isMounted || !mapInstanceRef.current) return;

      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m: any) => map.removeLayer(m));
      markersRef.current = {};

      // Filter displayable hospital landmarks
      const displayableHospitals = JABODETABEK_LANDMARKS.filter(
        (lm) => lm.id !== "HOSP-MULTI"
      );

      displayableHospitals.forEach((lm) => {
        const isSelected = selectedCohortId === lm.cohortId;

        // Modern Custom HTML Marker Pin
        const markerHtml = `
          <div class="flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
            isSelected ? "scale-110 z-50" : "scale-100 z-20 hover:scale-105"
          }">
            <!-- Floating Label Pill -->
            <div class="${
              isSelected
                ? "bg-slate-900 text-white border-slate-900 font-semibold shadow-md ring-2 ring-blue-500/30"
                : "bg-white/95 text-slate-800 border-slate-200 font-medium shadow-xs hover:border-slate-300"
            } border px-2 py-0.5 rounded-[3px] text-[10px] tracking-tight whitespace-nowrap mb-1 flex items-center gap-1">
              <span>${lm.name}</span>
              <span class="${
                isSelected ? "bg-slate-800 text-blue-300" : "bg-slate-100 text-slate-500"
              } px-1 rounded-[2px] text-[9px] tabular-nums">${lm.caseCount}k</span>
            </div>

            <!-- Pin Head -->
            <div class="relative flex items-center justify-center">
              ${
                isSelected
                  ? `<div class="absolute -inset-1 rounded-[4px] bg-blue-500/25 animate-ping"></div>`
                  : ""
              }
              <div class="w-7 h-7 rounded-[4px] ${
                isSelected
                  ? "bg-blue-600 border-2 border-white text-white shadow-md"
                  : "bg-white border border-slate-300 text-slate-700 shadow-2xs group-hover:border-blue-500 group-hover:text-blue-600"
              } flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                  <path d="M2 20h20"></path>
                  <path d="M14 12v.01"></path>
                  <path d="M10 12v.01"></path>
                  <path d="M14 16v.01"></path>
                  <path d="M10 16v.01"></path>
                </svg>
              </div>
            </div>

            <!-- Triangle Pin Tip -->
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
              isSelected ? "border-t-blue-600" : "border-t-slate-300"
            } -mt-0.5"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "hospital-landmark-marker",
          html: markerHtml,
          iconSize: [160, 60],
          iconAnchor: [80, 56],
        });

        const marker = L.marker([lm.lat, lm.lng], {
          icon: customIcon,
          title: lm.name,
        }).addTo(map);

        marker.on("click", () => {
          onSelectCohort(lm.cohortId);
        });

        markersRef.current[lm.id] = marker;
      });

      // Fly to active selection or fit Jabodetabek bounds
      if (selectedCohortId === "MULTI_CENTER_BPJS") {
        map.flyTo([-6.26, 106.82], 10, {
          duration: 0.8,
        });
      } else {
        const target = JABODETABEK_LANDMARKS.find(
          (lm) => lm.cohortId === selectedCohortId
        );
        if (target) {
          map.flyTo([target.lat, target.lng], 12, {
            duration: 0.8,
          });
        }
      }
    }

    renderMarkers();

    return () => {
      isMounted = false;
    };
  }, [isMapReady, selectedCohortId, onSelectCohort]);

  return (
    <div className="bg-white border border-slate-200 rounded-[4px] shadow-2xs overflow-hidden relative w-full h-[520px] lg:h-[580px]">
      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Subtle Map Indicator Badge (Top Right of Map) */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-[4px] px-3 py-1.5 text-xs text-slate-700 shadow-xs z-[1000] flex items-center gap-2 pointer-events-none">
        <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span className="font-semibold text-slate-900">Peta Faskes Wilayah Jabodetabek</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500 text-[11px]">Klik landmark pada peta untuk memilih</span>
      </div>

        {/* Floating Active Landmark Inspector Overlay (Right side of Map) */}
        <div className="absolute bottom-4 right-4 max-w-sm w-full md:w-80 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-[4px] p-3.5 shadow-md space-y-2 z-[1000] pointer-events-auto">
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
  );
}
