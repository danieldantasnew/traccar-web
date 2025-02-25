import { useId, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';
import { useAttributePreference } from '../../common/util/preferences';
import { findFonts } from '../core/mapUtil';

const MapLiveRoutes = ({positions}) => {
  const id = useId();
  
  const theme = useTheme();
  const type = useAttributePreference('mapLiveRoutes', 'none');
  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const history = useSelector((state) => state.session.history);
  const [rotations, setRotations] = useState({});
  
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

      map.addSource(`${id}-points`, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
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
          'line-width': 4,
        },
      });

      map.addLayer({
        source: `${id}-points`,
        id: `${id}-points-layer`,
        type: 'symbol',
        layout: {
          'text-field': '▲',
          'text-font': findFonts(map),
          'text-size': 20,
          'text-allow-overlap': true,
          'text-rotate': ['get', 'rotation'],
        },
        paint: {
          'text-color': 'purple',
        },
      });
    }
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
            color: 'rgba(128, 0, 128, 0.59)',
          },
        })),
      });

      setRotations((prevRotations) => {
        const newRotations = { ...prevRotations };

        deviceIds.forEach((deviceId) => {
          history[deviceId].forEach((coord, index) => {
            const key = `${deviceId}-${index}`;
            if (!newRotations[key]) {
              newRotations[key] = positions?.course ?? 0;
            }
          });
        });

        return newRotations;
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
              rotation: rotations[`${deviceId}-${index}`] ?? 0,
            },
          }))
        ),
      });
    }
  }, [theme, type, devices, selectedDeviceId, history]);

  return null;
};

export default MapLiveRoutes;
