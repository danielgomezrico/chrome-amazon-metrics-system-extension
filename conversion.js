const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

export function inchesToCm(inches) {
  return parseFloat((inches * CM_PER_INCH).toFixed(5));
}

export function feetToM(feet) {
  return parseFloat((feet * CM_PER_FOOT / 100).toFixed(5));
}

export function formatMetric(totalCm) {
  if (totalCm >= 100) {
    return `${(totalCm / 100).toFixed(2)} m`;
  }
  return `${totalCm.toFixed(2)} cm`;
}

export function convertInches(inches) {
  const cm = inches * CM_PER_INCH;
  return formatMetric(cm);
}

export function convertFeet(feet) {
  const cm = feet * CM_PER_FOOT;
  return formatMetric(cm);
}

export function convertFeetInches(feet, inches) {
  const totalCm = feet * CM_PER_FOOT + inches * CM_PER_INCH;
  return formatMetric(totalCm);
}

export function convertDimensions2D(w, h) {
  const wCm = w * CM_PER_INCH;
  const hCm = h * CM_PER_INCH;
  const maxCm = Math.max(wCm, hCm);
  if (maxCm >= 100) {
    return `${(wCm / 100).toFixed(2)} x ${(hCm / 100).toFixed(2)} m`;
  }
  return `${wCm.toFixed(2)} x ${hCm.toFixed(2)} cm`;
}

export function convertDimensions3D(l, w, h) {
  const lCm = l * CM_PER_INCH;
  const wCm = w * CM_PER_INCH;
  const hCm = h * CM_PER_INCH;
  const maxCm = Math.max(lCm, wCm, hCm);
  if (maxCm >= 100) {
    return `${(lCm / 100).toFixed(2)} x ${(wCm / 100).toFixed(2)} x ${(hCm / 100).toFixed(2)} m`;
  }
  return `${lCm.toFixed(2)} x ${wCm.toFixed(2)} x ${hCm.toFixed(2)} cm`;
}
