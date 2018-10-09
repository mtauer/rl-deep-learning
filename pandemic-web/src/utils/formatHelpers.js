import fromPairs from 'lodash/fromPairs';

import { locationsMap } from '../pandemic-shared/game';
import { locations } from '../pandemic-shared/constants';
import iconCityBlue from '../assets/map-city-blue.svg';
import iconCityBlack from '../assets/map-city-black.svg';
import iconCityRed from '../assets/map-city-red.svg';
import iconCityYellow from '../assets/map-city-yellow.svg';

const locationIdsByName = fromPairs(locations.map(l => [l.name, l.id]));

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

export function getRoutePath(route) {
  return route
    .map(name => locationsMap[locationIdsByName[name]])
    .map(l => l.coordinates);
}
