import { useId, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { map } from './core/MapView';
import { formatTime, getStatusColor } from '../common/util/formatter';
import { mapIconKey } from './core/preloadImages';
import { useAttributePreference } from '../common/util/preferences';
import { useCatchCallback } from '../reactHelper';
import { findFonts } from './core/mapUtil';
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client';
import "./css/style.css"

const MapPositions = ({ positions, onClick, showStatus, selectedPosition, titleField }) => {
  const id = useId();
  const clusters = `${id}-clusters`;
  const selected = `${id}-selected`;

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 1 : 1.6);

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const mapCluster = useAttributePreference('mapCluster', true);
  const directionType = useAttributePreference('mapDirection', 'selected');



  const createFeature = (devices, position, selectedPositionId) => {

    const device = devices[position.deviceId];
    let showDirection;
    switch (directionType) {
      case 'none':
        showDirection = false;
        break;
      case 'all':
        showDirection = position.course > 0;
        break;
      default:
        showDirection = selectedPositionId === position.id && position.course > 0;
        break;
    }
    return {
      id: position.id,
      deviceId: position.deviceId,
      name: device.name,
      fixTime: formatTime(position.fixTime, 'seconds'),
      category: mapIconKey(device.category),
      color: showStatus ? position.attributes.color || getStatusColor(device.status) : 'neutral',
      rotation: position.course,
      direction: showDirection,
    };
  };

  const onMouseEnter = () => map.getCanvas().style.cursor = 'pointer';
  const onMouseLeave = () => map.getCanvas().style.cursor = '';

  const onMapClick = useCallback((event) => {
    if (!event.defaultPrevented && onClick) {
      onClick(event.lngLat.lat, event.lngLat.lng);
    }
  }, [onClick]);

  const onMarkerClick = useCallback((event) => {
    event.preventDefault();
    const feature = event.features[0];
    if (onClick) {
      onClick(feature.properties.id, feature.properties.deviceId);
    }
  }, [onClick]);

  const onClusterClick = useCatchCallback(async (event) => {
    event.preventDefault();
    const features = map.queryRenderedFeatures(event.point, {
      layers: [clusters],
    });
    const clusterId = features[0].properties.cluster_id;
    const zoom = await map.getSource(id).getClusterExpansionZoom(clusterId);
    map.easeTo({
      center: features[0].geometry.coordinates,
      zoom,
    });
  }, [clusters]);

  // useEffect(() => {
  //   map.addSource(id, {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: [],
  //     },
  //     cluster: mapCluster,
  //     clusterMaxZoom: 14,
  //     clusterRadius: 50,
  //   });
  //   map.addSource(selected, {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: [],
  //     },
  //   });
  //   [id, selected].forEach((source) => {
  //     map.addLayer({
  //       id: source,
  //       type: 'symbol',
  //       source,
  //       filter: ['!has', 'point_count'],
  //       layout: {
  //         'icon-image': '{category}-{color}',
  //         'icon-size': iconScale,
  //         'icon-allow-overlap': true,
  //         'text-field': `{${titleField || 'name'}}`,
  //         'text-allow-overlap': true,
  //         'text-anchor': 'bottom',
  //         'text-offset': [0, -2 * iconScale],
  //         'text-font': findFonts(map),
  //         'text-size': 14,
  //       },
  //       paint: {
  //         'text-halo-color': 'green',
  //         'text-color': 'green',
  //         'text-halo-width': .2,
  //       },
  //     });
  //     map.addLayer({
  //       id: `direction-${source}`,
  //       type: 'symbol',
  //       source,
  //       filter: [
  //         'all',
  //         ['!has', 'point_count'],
  //         ['==', 'direction', true],
  //       ],
  //       layout: {
  //         'icon-image': 'direction',
  //         'icon-size': iconScale * 1.06,
  //         'icon-allow-overlap': true,
  //         'icon-rotate': ['get', 'rotation'],
  //         'icon-rotation-alignment': 'map',
  //       },
  //     });
  
  //       map.on('mouseenter', source, onMouseEnter);
  //       map.on('mouseleave', source, onMouseLeave);
  //       map.on('click', source, onMarkerClick);
    
  //   });
  //   map.addLayer({
  //     id: clusters,
  //     type: 'symbol',
  //     source: id,
  //     filter: ['has', 'point_count'],
  //     layout: {
  //       'icon-image': 'background',
  //       'icon-size': iconScale,
  //       'text-field': '{point_count_abbreviated}',
  //       'text-font': findFonts(map),
  //       'text-size': 16,
  //     },
  //   });

  //   map.on('mouseenter', clusters, onMouseEnter);
  //   map.on('mouseleave', clusters, onMouseLeave);
  //   map.on('click', clusters, onClusterClick);
  //   map.on('click', onMapClick);

  //   return () => {
  //     map.off('mouseenter', clusters, onMouseEnter);
  //     map.off('mouseleave', clusters, onMouseLeave);
  //     map.off('click', clusters, onClusterClick);
  //     map.off('click', onMapClick);

  //     if (map.getLayer(clusters)) {
  //       map.removeLayer(clusters);
  //     }

  //     [id, selected].forEach((source) => {
  //       map.off('mouseenter', source, onMouseEnter);
  //       map.off('mouseleave', source, onMouseLeave);
  //       map.off('click', source, onMarkerClick);

  //       if (map.getLayer(source)) {
  //         map.removeLayer(source);
  //       }
  //       if (map.getLayer(`direction-${source}`)) {
  //         map.removeLayer(`direction-${source}`);
  //       }
  //       if (map.getSource(source)) {
  //         map.removeSource(source);
  //       }
  //     });
  //   };
  // }, [mapCluster, clusters, onMarkerClick, onClusterClick]);
  
  const markersRef = useRef([]); // Guarda os marcadores ativos
  useEffect(() => {
    // Remove os marcadores antigos do mapa antes de adicionar novos
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    // Verifica se o mapa está carregado
    if (!map || !positions.length) return;

    // Adiciona os novos marcadores ao mapa
    positions
      .filter((it) => devices.hasOwnProperty(it.deviceId)) // Filtra apenas os devices válidos
      .forEach((position) => {
        const el = document.createElement("div");
            el.className = 'marker'
        el.innerHTML = `
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
              <path fill="#ffffff" d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
            </svg>
          </div>
          <div>
            <div style="font-weight: bold;">${devices[position.deviceId].name}</div>
            <div>${devices[position.deviceId].model}</div>
          </div>
        `;

        el.addEventListener("click", (event) => {
          event.stopPropagation();
          onClick(position.id, position.deviceId);
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([position.longitude, position.latitude])
          .addTo(map);

        markersRef.current.push(marker); // Guarda os marcadores ativos
      });

    return () => {
      // Limpa os marcadores quando o componente for desmontado ou os dados forem atualizados
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, positions, devices]);
  
  useEffect(() => {
    [id, selected].forEach((source) => {
      map.getSource(source)?.setData({
        type: 'FeatureCollection',
        features: positions.filter((it) => devices.hasOwnProperty(it.deviceId))
          .filter((it) => (source === id ? it.deviceId !== selectedDeviceId : it.deviceId === selectedDeviceId))
          .map((position) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [position.longitude, position.latitude],
            },
            properties: createFeature(devices, position, selectedPosition && selectedPosition.id),
          })),
      });
    });
  }, [mapCluster, clusters, onMarkerClick, onClusterClick, devices, positions, selectedPosition]);

  return null;
};

export default MapPositions;
