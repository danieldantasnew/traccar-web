import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { map } from '../core/MapView';
import { useAttributePreference } from '../../common/util/preferences';
import centerInMap from '../../common/util/centerInMap';

const MapSelectedDevice = () => {
  const currentId = useSelector((state) => state.devices.selectedId);
  const selectZoom = useAttributePreference('web.selectZoom', 10);
  const mapFollow = useAttributePreference('mapFollow', false);
  const position = useSelector((state) => state.session.positions[currentId]);

  const lastUserZoomTime = useRef(Date.now());

  useEffect(() => {
    const handleZoom = () => {
      lastUserZoomTime.current = Date.now();
    };

    map.on('zoom', handleZoom);
    map.on('move', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
      map.off('move', handleZoom);
    };
  }, []);

  useEffect(() => {
    if (position) {
      centerInMap(position, Math.max(map.getZoom(), selectZoom));
      lastUserZoomTime.current = Date.now();
    }
  }, [currentId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastZoom = Date.now() - lastUserZoomTime.current;

      if (timeSinceLastZoom >= 2000 && position && mapFollow) {
        centerInMap(position, Math.max(map.getZoom(), selectZoom));
        lastUserZoomTime.current = Date.now();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [position, selectZoom, mapFollow]);

  return null;
};

export default MapSelectedDevice;
