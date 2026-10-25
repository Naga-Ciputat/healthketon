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
    id: "HOSP-RSCM",
    cohortId: "RS_RSCM",
    name: "RSUPN Dr. Cipto Mangunkusumo",
    region: "Salemba, Jakarta Pusat",
    zone: "Jakarta Pusat",
    hospitalClass: "Tipe A (Rujukan Nasional)",
    specialization: "Pusat Rujukan Nasional: Bedah Kompleks, Transplantasi & Kardiovaskular",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Alkes Implan Stent", "Upcoding Sepsis Lab", "Unbundling Bedah Mayor"],
    lat: -6.1969,
    lng: 106.8471,
  },
  {
    id: "HOSP-HARAPANKITA",
    cohortId: "RS_HARAPANKITA",
    name: "RS Jantung Harapan Kita",
    region: "Slipi, Jakarta Barat",
    zone: "Jakarta Barat",
    hospitalClass: "Tipe A (Pusat Jantung)",
    specialization: "Pusat Jantung Nasional: Kateterisasi PCI, Stent DES & Bedah CABG",
    caseCount: 10,
    anomalyCount: 7,
    cleanCount: 3,
    focusModus: ["Inflated Stent DES", "Unbundling Kateterisasi", "Severity Kardiogenik"],
    lat: -6.1868,
    lng: 106.7993,
  },
  {
    id: "HOSP-DHARMAIS",
    cohortId: "RS_DHARMAIS",
    name: "RS Kanker Dharmais",
    region: "Palmerah, Jakarta Barat",
    zone: "Jakarta Barat",
    hospitalClass: "Tipe A (Pusat Kanker)",
    specialization: "Pusat Kanker Nasional: Protokol Kemoterapi Sitostatika & Onkologi",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Note Cloning Terapi", "Unbundling Chemoport", "Upcoding Kaheksia"],
    lat: -6.1878,
    lng: 106.7978,
  },
  {
    id: "HOSP-FATMAWATI",
    cohortId: "RS_FATMAWATI",
    name: "RSUP Fatmawati",
    region: "Cilandak, Jakarta Selatan",
    zone: "Jakarta Selatan",
    hospitalClass: "Tipe A (Ortopedi & Trauma)",
    specialization: "Pusat Trauma & Ortopedi: Implan Plat Fraktur Tulang & Rekonstruksi Sendi",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Implan Plat Ortopedi", "Unbundling Fluoroskopi C-Arm", "SOAP Fisioterapi"],
    lat: -6.2952,
    lng: 106.7937,
  },
  {
    id: "HOSP-SULIANTI",
    cohortId: "RS_SULIANTI",
    name: "RSPI Prof. Dr. Sulianti Saroso",
    region: "Sunter, Jakarta Utara",
    zone: "Jakarta Utara",
    hospitalClass: "Tipe A (Pusat Infeksi)",
    specialization: "Pusat Penyakit Infeksi: Ruang Isolasi Tekanan Negatif & Audit Sepsis A41.9",
    caseCount: 10,
    anomalyCount: 5,
    cleanCount: 5,
    focusModus: ["Upcoding Sepsis A41.9", "Kultur Darah Laboratorium", "Unbundling APD/Isolasi"],
    lat: -6.1309,
    lng: 106.8624,
  },
  {
    id: "HOSP-PERSAHABATAN",
    cohortId: "RS_PERSAHABATAN",
    name: "RSUP Persahabatan",
    region: "Rawamangun, Jakarta Timur",
    zone: "Jakarta Timur",
    hospitalClass: "Tipe A (Pusat Respirasi)",
    specialization: "Pusat Respirasi Nasional: Pemakaian Ventilator ICU >96 Jam & Bronkoskopi",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Upcoding Ventilator >96 Jam", "Unbundling Toraks WSD", "Duplikasi CPPT Paru"],
    lat: -6.2023,
    lng: 106.8856,
  },
  {
    id: "HOSP-SEJAHTERA",
    cohortId: "RS_SEJAHTERA",
    name: "RS Sejahtera Medika",
    region: "Matraman, Jakarta Pusat",
    zone: "Jakarta Pusat",
    hospitalClass: "Kelas A (Mitra BPJS)",
    specialization: "Pusat Bedah Mayor, Kardiologi & Alkes Implan Vaskular",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Inflated Stent", "Upcoding Sepsis", "Unbundling Tindakan"],
    lat: -6.2085,
    lng: 106.8450,
  },
  {
    id: "HOSP-MITRA",
    cohortId: "RS_MITRA",
    name: "RS Mitra Sehat",
    region: "BSD City, Tangerang Selatan",
    zone: "Tangerang Selatan",
    hospitalClass: "Kelas B (Rujukan Barat)",
    specialization: "Rawat Inap Neurologi & Severity Level Akut",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Severity Upcoding G-4-14", "Kaidah Koding", "Unbundling Pasca-Rawat"],
    lat: -6.3020,
    lng: 106.6740,
  },
  {
    id: "HOSP-SENTOSA",
    cohortId: "RS_SENTOSA",
    name: "RS Sentosa Kasih",
    region: "Margonda, Perbatasan Depok-Jaksel",
    zone: "Depok / Jaksel",
    hospitalClass: "Kelas C (Mitra Khusus)",
    specialization: "Deteksi Fraud Semantik & Duplikasi Catatan Medis SOAP Massal",
    caseCount: 10,
    anomalyCount: 6,
    cleanCount: 4,
    focusModus: ["Note Cloning SOAP", "Template CPPT Massal", "Kemiripan Semantik"],
    lat: -6.3680,
    lng: 106.8330,
  },
  {
    id: "HOSP-MULTI",
    cohortId: "MULTI_CENTER_BPJS",
    name: "Aglomerasi Jabodetabek (Multi-Faskes)",
    region: "Koridor Metropolitan DKI Jakarta & Sekitarnya",
    zone: "Aglomerasi Jabodetabek",
    hospitalClass: "Jaringan Terintegrasi KCU",
    specialization: "Golden Dataset 30 Kasus Terstandar Jabodetabek (Evaluasi Multi-Center)",
    caseCount: 30,
    anomalyCount: 18,
    cleanCount: 12,
    focusModus: ["Alkes Implan", "Severity Inflation", "Note Cloning", "Unbundling"],
    lat: -6.2200,
    lng: 106.8270,
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

  // Initialize Real Leaflet Map with Google Maps-like Colorful Tiles
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Center of Jakarta Metropolitan: [-6.215, 106.83], Zoom 11.5
      const map = L.map(mapContainerRef.current, {
        center: [-6.215, 106.83],
        zoom: 11,
        minZoom: 9,
        maxZoom: 17,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Zoom Control at top-left
      L.control
        .zoom({
          position: "topleft",
        })
        .addTo(map);

      // Clean Google Maps Layer with ALL non-hospital POIs disabled (No malls, museums, commercial landmarks)
      L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=m&apistyle=s.t:2|p.v:off&x={x}&y={y}&z={z}",
        {
          subdomains: ["0", "1", "2", "3"],
          maxZoom: 19,
          attribution: "&copy; Google Maps",
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

        // Clean 3D Isometric Hospital Building Pin (Grounded, flat base without floating shadow or dangling tabs)
        const markerHtml = `
          <div class="flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
            isSelected
              ? "scale-110 z-50"
              : "scale-100 hover:scale-105 z-20"
          }">
            <!-- Floating Label Pill with Hospital Name & Case Count -->
            <div class="${
              isSelected
                ? "bg-slate-900 text-white border-slate-900 font-bold shadow-md ring-2 ring-blue-500/50"
                : "bg-white/95 text-slate-800 border-slate-200 font-semibold shadow-xs hover:border-slate-300"
            } border px-2 py-0.5 rounded-[4px] text-[10.5px] tracking-tight whitespace-nowrap mb-0.5 flex items-center gap-1.5 transition-all">
              <span class="w-1.5 h-1.5 rounded-full ${
                isSelected ? "bg-blue-400 animate-pulse" : "bg-emerald-500"
              }"></span>
              <span>${lm.name}</span>
              <span class="${
                isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
              } px-1.5 py-0.2 rounded-[3px] text-[9.5px] font-bold tabular-nums">${lm.caseCount}</span>
            </div>

            <!-- 3D Isometric Hospital Skyscraper SVG (Flat grounded base, no shadow, no dangling protrusion) -->
            <div class="relative flex items-center justify-center">
              <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-200">
                <!-- Tower Main Body: Left Facade (Shadowed Architectural Wall) -->
                <polygon points="6,17 24,26 24,54 6,45" fill="${
                  isSelected ? "#1d4ed8" : "#334155"
                }" stroke="${isSelected ? "#1e40af" : "#1e293b"}" stroke-width="0.6"/>

                <!-- Architectural Glass Windows on Left Facade (4 floors) -->
                <polygon points="8,23 13,25.5 13,28 8,25.5" fill="${
                  isSelected ? "#93c5fd" : "#94a3b8"
                }"/>
                <polygon points="16,27 21,29.5 21,32 16,29.5" fill="${
                  isSelected ? "#93c5fd" : "#94a3b8"
                }"/>
                <polygon points="8,30 13,32.5 13,35 8,32.5" fill="${
                  isSelected ? "#93c5fd" : "#94a3b8"
                }"/>
                <polygon points="16,34 21,36.5 21,39 16,36.5" fill="${
                  isSelected ? "#93c5fd" : "#94a3b8"
                }"/>
                <polygon points="8,37 13,39.5 13,42 8,39.5" fill="${
                  isSelected ? "#93c5fd" : "#94a3b8"
                }"/>
                <polygon points="16,41 21,43.5 21,46 16,43.5" fill="${
                  isSelected ? "#93c5fd" : "#94a3b8"
                }"/>

                <!-- Tower Main Body: Right Facade (Sunlit Facade with Bright Glass Curtain) -->
                <polygon points="24,26 42,17 42,45 24,54" fill="${
                  isSelected ? "#3b82f6" : "#64748b"
                }" stroke="${isSelected ? "#2563eb" : "#475569"}" stroke-width="0.6"/>

                <!-- Architectural Glass Windows on Right Facade (4 floors) -->
                <polygon points="27,27.5 32,25 32,27.5 27,30" fill="${
                  isSelected ? "#dbeafe" : "#e2e8f0"
                }"/>
                <polygon points="35,23.5 40,21 40,23.5 35,26" fill="${
                  isSelected ? "#dbeafe" : "#e2e8f0"
                }"/>
                <polygon points="27,34.5 32,32 32,34.5 27,37" fill="${
                  isSelected ? "#dbeafe" : "#e2e8f0"
                }"/>
                <polygon points="35,30.5 40,28 40,30.5 35,33" fill="${
                  isSelected ? "#dbeafe" : "#e2e8f0"
                }"/>
                <polygon points="27,41.5 32,39 32,41.5 27,44" fill="${
                  isSelected ? "#dbeafe" : "#e2e8f0"
                }"/>
                <polygon points="35,37.5 40,35 40,37.5 35,40" fill="${
                  isSelected ? "#dbeafe" : "#e2e8f0"
                }"/>

                <!-- Ground Level Hospital Entrance Door (Cleanly integrated flush inside wall) -->
                <polygon points="26,46 32,43 32,49 26,52" fill="${
                  isSelected ? "#1e40af" : "#1e293b"
                }"/>
                <polygon points="27,47 31,45 31,48.5 27,51" fill="${
                  isSelected ? "#93c5fd" : "#cbd5e1"
                }"/>

                <!-- Rooftop Plane (Top-lit Isometric Diamond) -->
                <polygon points="24,8 42,17 24,26 6,17" fill="${
                  isSelected ? "#60a5fa" : "#94a3b8"
                }" stroke="${isSelected ? "#3b82f6" : "#64748b"}" stroke-width="0.5"/>

                <!-- Rooftop Elevator Penthouse Block -->
                <polygon points="24,2 29,4.5 24,7 19,4.5" fill="${
                  isSelected ? "#dbeafe" : "#cbd5e1"
                }"/>
                <polygon points="19,4.5 24,7 24,10.5 19,8" fill="${
                  isSelected ? "#1d4ed8" : "#334155"
                }"/>
                <polygon points="24,7 29,4.5 29,8 24,10.5" fill="${
                  isSelected ? "#2563eb" : "#475569"
                }"/>

                <!-- White Medical Helipad Platform & Red Cross -->
                <ellipse cx="24" cy="17" rx="7.5" ry="4" fill="#ffffff" stroke="${
                  isSelected ? "#2563eb" : "#cbd5e1"
                }" stroke-width="1"/>
                <path d="M23 14.5h2v5h-2z" fill="#ef4444"/>
                <path d="M21.5 16h5v2h-5z" fill="#ef4444"/>

                <!-- Crisp Ground Baseline (Flush & Neplok ke Permukaan) -->
                <polyline points="6,45 24,54 42,45" stroke="${
                  isSelected ? "#1e40af" : "#1e293b"
                }" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "hospital-landmark-marker",
          html: markerHtml,
          iconSize: [160, 82],
          iconAnchor: [80, 78],
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
        map.flyTo([-6.215, 106.83], 11, {
          duration: 0.8,
        });
      } else {
        const target = JABODETABEK_LANDMARKS.find(
          (lm) => lm.cohortId === selectedCohortId
        );
        if (target) {
          map.flyTo([target.lat, target.lng], 12.5, {
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
        <span className="text-slate-500 text-[11px]">Klik gedung landmark pada peta untuk memilih</span>
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
