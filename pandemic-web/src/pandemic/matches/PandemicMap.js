import React from 'react';
import { compose } from 'redux';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { withProps } from 'recompose';

import config from '../../config.json';
import mapStyles from './mapStyles.json';

const PandemicMap = () => (
  <GoogleMap
    defaultZoom={1.9}
    defaultCenter={{ lat: 12, lng: 13 }}
    defaultOptions={{ styles: mapStyles, disableDefaultUI: true }}
  >
    <Marker position={{ lat: -34.397, lng: 150.644 }} />
  </GoogleMap>
);

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
