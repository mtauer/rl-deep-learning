import React from 'react';
import { compose } from 'redux';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';
import { withProps } from 'recompose';
import range from 'lodash/range';

import config from '../../config.json';
import mapStyles from './mapStyles.json';
import { getLocationMarkerIcon, getLocationPosition, getRoutePath } from '../../utils/formatHelpers';
import { routes } from '../../pandemic-shared/constants';

const PandemicMap = () => {
  return (
    <GoogleMap
      defaultZoom={1.9}
      defaultCenter={{ lat: 12, lng: 13 }}
      defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
    >
      {renderRoutes()}
      {renderLocations()}
    </GoogleMap>
  );

  function renderRoutes() {
    return routes.map(route => (
      <Polyline
        key={route.join('-')}
        path={getRoutePath(route)}
        options={{ strokeColor: 'rgba(0, 0, 0, 0.25)', strokeWeight: 1 }}
      />
    ));
  }

  function renderLocations() {
    return range(48).map(id => (
      <Marker
        key={`location-${id}`}
        position={getLocationPosition(id)}
        icon={getLocationMarkerIcon(id)}
      />
    ));
  }
};

export default compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&language=de&v=3.exp&region=DE&key=${config.googleMapsApi.key}`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(PandemicMap);
