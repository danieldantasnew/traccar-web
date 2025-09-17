import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dimensions from '../../common/theme/dimensions';
import { map } from '../core/MapView';
import { useAttributePreference } from '../../common/util/preferences';

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
      map.easeTo({
        center: [position.longitude, position.latitude],
        zoom: Math.max(map.getZoom(), selectZoom),
        offset: [0, -dimensions.popupMapOffset / 2],
      });

      lastUserZoomTime.current = Date.now();
    }
  }, [currentId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastZoom = Date.now() - lastUserZoomTime.current;

      if (timeSinceLastZoom >= 2000 && position && mapFollow) {
        map.easeTo({
          center: [position.longitude, position.latitude],
          zoom: Math.max(map.getZoom(), selectZoom),
          offset: [0, -dimensions.popupMapOffset / 2],
        });

        lastUserZoomTime.current = Date.now();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [position, selectZoom, mapFollow]);

  return null;
};

export default MapSelectedDevice;
