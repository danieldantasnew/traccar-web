import { useTheme } from '@mui/styles';
import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import getSpeedColor from '../common/util/colors';

const MapRoutePath = ({ positions, staticColor }) => {
  const id = useId();
  const devices = useSelector((state) => state.devices.items);
  const selectedId = useSelector((state) => state.devices.selectedId);
  const theme = useTheme();
  const device = devices[selectedId] || {}; 
  const attributes = device.attributes || {};
  const { secondary } = attributes?.deviceColors || {background: "black", icon: "red", text: "white", secondary: "blue"};

  const reportColor = useSelector((state) => {
    const position = positions?.[0];
    if (position) {
      const attributes = state.devices.items[position.deviceId]?.attributes;
      const color = attributes?.attributes;
      return color || null;
    }
    return null;
  });
  
  useEffect(() => {
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
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          4, 2,
          14, 2.8,
          18, 3.3,
        ],
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
  }, []);

  useEffect(() => {
    const minSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.min(a, b), Infinity);
    const maxSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.max(a, b), -Infinity);
    const features = [];

    for (let i = 0; i < positions.length - 1; i += 1) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[positions[i].longitude, positions[i].latitude], [positions[i + 1].longitude, positions[i + 1].latitude]],
        },
        properties: {
          color: (staticColor  && secondary) || getSpeedColor(
            positions[i + 1].speed,
            minSpeed,
            maxSpeed,
          ),
        },
      });
    }
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [theme, positions, reportColor, staticColor]);

  return null;
};

export default MapRoutePath;
