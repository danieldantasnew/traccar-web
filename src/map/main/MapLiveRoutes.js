import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';
import { useAttributePreference } from '../../common/util/preferences';
import { findFonts } from '../core/mapUtil';

const MapLiveRoutes = () => {
  const id = useId();

  const theme = useTheme();

  const type = useAttributePreference('mapLiveRoutes', 'none');

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const history = useSelector((state) => state.session.history);

  useEffect(() => {
    if (type !== 'none') {
      map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });
      map.addLayer({
        source: id,
        id: `${id}-line`,
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.5,
        },
      });

        map.addSource(`${id}-points`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
        map.addLayer({
          source: `${id}-points`,
          id: `${id}-points-layer`,
          type: 'symbol',
          layout: {
            'text-field': '▲',
            'text-font': findFonts(map),
            'text-size': 24,
            'text-allow-overlap': true,
            'text-rotate': ['get', 'rotation'],
          },
          paint: {
            'text-color': 'red',
          },
        });
        

      return () => {
        if (map.getLayer(`${id}-title`)) {
          map.removeLayer(`${id}-title`);
        }
        if (map.getLayer(`${id}-line`)) {
          map.removeLayer(`${id}-line`);
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      };
    }
    return () => {};
  }, [type]);

  useEffect(() => {
    if (type !== 'none') {
      const deviceIds = Object.values(devices)
        .map((device) => device.id)
        .filter((id) => (type === 'selected' ? id === selectedDeviceId : true))
        .filter((id) => history.hasOwnProperty(id));

      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: deviceIds.map((deviceId) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: history[deviceId],
          },
          properties: {
            color: 'purple',
          },
        })),
      });

      map.getSource(`${id}-points`)?.setData({
        type: 'FeatureCollection',
        features: deviceIds.flatMap((deviceId) =>
          history[deviceId].map((coord, index) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coord,
            },
            properties: {
              id: `${deviceId}-${index}`,
              rotation: 1010,
            },
          }))
        ),
      });
    }
  }, [theme, type, devices, selectedDeviceId, history]);

  return null;
};

export default MapLiveRoutes;
