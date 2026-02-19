const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;
const ML_PER_FL_OZ = 29.5735;
const G_PER_OZ = 28.3495;
const G_PER_LB = 453.592;

export function inchesToCm(inches) {
  return parseFloat((inches * CM_PER_INCH).toFixed(5));
}

export function feetToM(feet) {
  return parseFloat(((feet * CM_PER_FOOT) / 100).toFixed(5));
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

export function formatVolume(totalMl) {
  if (totalMl >= 1000) {
    return `${(totalMl / 1000).toFixed(2)} L`;
  }
  return `${totalMl.toFixed(2)} mL`;
}

export function convertFlOz(flOz) {
  const ml = flOz * ML_PER_FL_OZ;
  return formatVolume(ml);
}

export function formatWeight(totalG) {
  if (totalG >= 1000) {
    return `${(totalG / 1000).toFixed(2)} kg`;
  }
  return `${totalG.toFixed(2)} g`;
}

export function convertOz(oz) {
  const g = oz * G_PER_OZ;
  return formatWeight(g);
}

export function convertPounds(lbs) {
  const g = lbs * G_PER_LB;
  return formatWeight(g);
}

export function convertPoundsOz(lbs, oz) {
  const totalG = lbs * G_PER_LB + oz * G_PER_OZ;
  return formatWeight(totalG);
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

const ML_PER_GALLON = 3785.41;
const ML_PER_QUART = 946.353;
const ML_PER_PINT = 473.176;
const SQ_CM_PER_SQ_INCH = 6.4516;
const SQ_CM_PER_SQ_FOOT = 929.0304;
const BAR_PER_PSI = 0.0689476;
const KM_PER_MILE = 1.60934;

export function convertGallons(gal) {
  const ml = gal * ML_PER_GALLON;
  return formatVolume(ml);
}

export function convertQuarts(qt) {
  const ml = qt * ML_PER_QUART;
  return formatVolume(ml);
}

export function convertPints(pt) {
  const ml = pt * ML_PER_PINT;
  return formatVolume(ml);
}

export function convertFahrenheit(f) {
  const c = ((f - 32) * 5) / 9;
  return `${c.toFixed(2)} °C`;
}

export function formatArea(totalSqCm) {
  if (totalSqCm >= 10000) {
    return `${(totalSqCm / 10000).toFixed(2)} m²`;
  }
  return `${totalSqCm.toFixed(2)} cm²`;
}

export function convertSqFeet(sqFt) {
  const sqCm = sqFt * SQ_CM_PER_SQ_FOOT;
  return formatArea(sqCm);
}

export function convertSqInches(sqIn) {
  const sqCm = sqIn * SQ_CM_PER_SQ_INCH;
  return formatArea(sqCm);
}

export function convertPsi(psi) {
  const bar = psi * BAR_PER_PSI;
  return `${bar.toFixed(2)} bar`;
}

export function convertMph(mph) {
  const kmh = mph * KM_PER_MILE;
  return `${kmh.toFixed(2)} km/h`;
}

export function convertMiles(miles) {
  const km = miles * KM_PER_MILE;
  return `${km.toFixed(2)} km`;
}
