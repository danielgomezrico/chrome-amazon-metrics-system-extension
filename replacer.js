import { findMeasurements } from './patterns.js';
import {
  convertInches,
  convertFeet,
  convertFeetInches,
  convertDimensions2D,
  convertDimensions3D,
  convertFlOz,
} from './conversion.js';

function convertMeasurement(measurement) {
  switch (measurement.type) {
    case 'fractional_ft_in':
    case 'combined_ft_in':
      return convertFeetInches(measurement.feet, measurement.inches);
    case 'dimensions_3d':
      return convertDimensions3D(...measurement.values);
    case 'dimensions_2d':
      return convertDimensions2D(...measurement.values);
    case 'feet':
      return convertFeet(measurement.value);
    case 'inches':
      return convertInches(measurement.value);
    case 'fluid_oz':
      return convertFlOz(measurement.value);
    default:
      return null;
  }
}

export function replaceWithMetric(text) {
  const measurements = findMeasurements(text);
  if (measurements.length === 0) return text;

  let result = '';
  let lastIndex = 0;

  const cleaned = text.replace(/[\u200e\u200f\u200b]/g, '');

  for (const m of measurements) {
    const converted = convertMeasurement(m);
    if (!converted) continue;

    const end = m.index + m.matched.length;
    result += cleaned.slice(lastIndex, end);
    result += ` (${converted})`;
    lastIndex = end;
  }

  result += cleaned.slice(lastIndex);
  return result;
}
