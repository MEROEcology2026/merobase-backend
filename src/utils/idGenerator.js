/* ================= PART OF SAMPLE CODES ================= */
const PART_OF_SAMPLE_CODES = {
  "Whole body":   "WB",
  "Head":         "H",
  "Body":         "B",
  "Tail":         "T",
  "Gill":         "G",
  "Intestines":   "I",
  "Stomach":      "S",
  "Kidney":       "K",
  "Liver":        "L",
  "Filter Paper": "FP",
  "Heart":        "HRT",
  "Egg":          "E",
  "Bone":         "BNS",
  "Mucus":        "M",
  "Tissue":       "TST",
};

/* ================= SAMPLE ID ================= */
// Format: B.A.H.01.005
// Biology → B, Non-Biology → NB
// Project Type → A or B
// Part of Sample → code (H, WB, FP, etc.)
// Project Number → zero padded to 2 digits
// Sample Number → zero padded to 3 digits

export const generateSampleId = (sampleType, projectType, partOfSample, projectNumber, sampleNumber) => {
  if (!sampleType || !projectType || !partOfSample || !projectNumber || !sampleNumber) return null;

  const type = sampleType === "Biological" ? "B" : "NB";
  const project = String(projectType).toUpperCase();

  /* ✅ Accept either the label ("Head") or the code ("H") directly */
  const part = PART_OF_SAMPLE_CODES[partOfSample] || String(partOfSample).toUpperCase();

  const projNum = String(projectNumber).padStart(2, "0");
  const sampleNum = String(sampleNumber).padStart(3, "0");

  return `${type}.${project}.${part}.${projNum}.${sampleNum}`;
};