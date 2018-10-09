import { locationsMap } from '../pandemic-shared/game';
import iconCityBlue from '../assets/city-blue.svg';
import iconCityBlack from '../assets/city-black.svg';
import iconCityRed from '../assets/city-red.svg';
import iconCityYellow from '../assets/city-yellow.svg';

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

export function getLocationPosition(locationId) {
  return locationsMap[locationId].coordinates;
}

export function getLocationMarkerIcon(locationId) {
  const icons = {
    Blue: {
      url: iconCityBlue,
      anchor: { x: 3, y: 3 },
    },
    Black: {
      url: iconCityBlack,
      anchor: { x: 3, y: 3 },
    },
    Red: {
      url: iconCityRed,
      anchor: { x: 3, y: 3 },
    },
    Yellow: {
      url: iconCityYellow,
      anchor: { x: 3, y: 3 },
    },
  };
  return icons[locationsMap[locationId].disease];
}
