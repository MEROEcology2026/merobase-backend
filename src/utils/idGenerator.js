/* ================= SAMPLE ID ================= */
// Format: B.A.01.005
export const generateSampleId = (sampleType, projectType, projectNumber, sampleNumber) => {
  if (!sampleType || !projectType || !projectNumber || !sampleNumber) return null;

  const type = sampleType === "Biological" ? "B" : "NB";
  const project = String(projectType).toUpperCase();
  const projNum = String(projectNumber).padStart(2, "0");
  const sampleNum = String(sampleNumber).padStart(3, "0");

  return `${type}.${project}.${projNum}.${sampleNum}`;
};