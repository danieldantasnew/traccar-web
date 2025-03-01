import { useId, useEffect } from 'react';
import { useTheme } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
import { map } from './core/MapView';
import { useAttributePreference } from '../common/util/preferences';
import { findFonts } from './core/mapUtil';

const MapMarkers = ({ markers }) => {
  const id = useId();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1);

  useEffect(() => {
    if (!map) return;

    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    map.addLayer({
      id: `${id}-circle`,
      type: 'circle',
      source: id,
      paint: {
        'circle-color': 'white',
        'circle-radius': 22,
        'circle-opacity': 1,
      },
    });

    map.addLayer({
      id,
      type: 'symbol',
      source: id,
      layout: {
        'text-field': '{stopped}',
        'text-size': 18,
        'text-font': findFonts(map),
        'text-allow-overlap': true,
        'text-anchor': 'center',
      },
      paint: {
        'text-halo-color': 'white',
        'text-halo-width': 2,
        'text-color': 'red',
      },
    });

    map.once('idle', () => {
      if (map.getLayer(id)) map.moveLayer(id);
      if (map.getLayer(`${id}-circle`)) map.moveLayer(`${id}-circle`, id);
    });

    return () => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getLayer(`${id}-circle`)) map.removeLayer(`${id}-circle`);
      if (map.getSource(id)) map.removeSource(id);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !map.getSource(id)) return;

    const features = markers.map(({ latitude, longitude, stopped }) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      properties: {
        stopped: `${stopped == 1 ? 'INI' : stopped}`,
      },
    }));

    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [markers, map]);

  return null;
};

export default MapMarkers;
