import { locationsMap } from '../pandemic-shared/game';

export function getLocationName(locationId) {
  return locationsMap[locationId].name;
}

export function getLocationAbbreviation(locationId) {
  return locationsMap[locationId].abbreviation;
}

export function getLocationDisease(locationId) {
  return locationsMap[locationId].disease;
}

export function getLocationColor(locationId) {
  const diseaseColors = {
    Blue: '#1B87C4',
    Black: '#4D4D4D',
    Red: '#DA1C49',
    Yellow: '#DABC1C',
  };
  const disease = getLocationDisease(locationId);
  return diseaseColors[disease] || '#999999';
}
