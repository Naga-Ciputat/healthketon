import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format raw anomaly category constants into professional Indonesian terminology
 */
export function formatAnomalyCategory(category: string): string {
  switch (category) {
    case "INFLATED_ALKES":
      return "Penggelembungan Alkes";
    case "UPCODING":
      return "Upcoding Tarif";
    case "NOTE_CLONING":
      return "Duplikasi Catatan Medis";
    case "RULE_ANOMALY":
    case "RULE_ENGINE":
      return "Kaidah Koding INA-CBG";
    case "UNBUNDLING":
    case "UNBUNDLING_PROC":
      return "Pemecahan Prosedur (Unbundling)";
    default:
      return category.replace(/_/g, " ");
  }
}

/**
 * Format benchmark case ground truth labels into clean Indonesian descriptions
 */
export function formatBenchmarkLabel(label: string): string {
  switch (label) {
    case "UPCODING_SEPSIS":
      return "Upcoding Sepsis Berat";
    case "INFLATED_STENT":
      return "Penggelembungan Stent Jantung";
    case "NOTE_CLONING":
      return "Duplikasi Catatan Medis";
    case "UNBUNDLING_PROC":
      return "Pemecahan Prosedur (Unbundling)";
    case "CLEAN_CLAIM":
      return "Klaim Wajar (Sesuai Regulasi)";
    default:
      return label.replace(/_/g, " ");
  }
}

/**
 * Format confusion matrix classification results
 */
export function formatClassificationResult(status: string): string {
  switch (status) {
    case "TRUE_POSITIVE":
      return "Benar Positif (TP)";
    case "TRUE_NEGATIVE":
      return "Benar Negatif (TN)";
    case "FALSE_POSITIVE":
      return "Salah Deteksi (FP)";
    case "FALSE_NEGATIVE":
      return "Gagal Deteksi (FN)";
    default:
      return status.replace(/_/g, " ");
  }
}
