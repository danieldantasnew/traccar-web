import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import MapView from "../map/core/MapView";
import MapSelectedDevice from "../map/main/MapSelectedDevice";
import MapAccuracy from "../map/main/MapAccuracy";
import MapGeofence from "../map/MapGeofence";
import MapCurrentLocation from "../map/MapCurrentLocation";
import PoiMap from "../map/main/PoiMap";
import MapPadding from "../map/MapPadding";
import { devicesActions } from "../store";
import MapDefaultCamera from "../map/main/MapDefaultCamera";
import MapPositions from "../map/MapPositions.jsx";
import MapOverlay from "../map/overlay/MapOverlay";
import MapGeocoder from "../map/geocoder/MapGeocoder";
import MapScale from "../map/MapScale";
import MapNotification from "../map/notification/MapNotification";
import useFeatures from "../common/util/useFeatures";
import MapMarkersStops from "../map/MapMarkersStops.js";
import dayjs from "dayjs";
import { useCatch } from "../reactHelper.js";
import MapRoutePoints from "../map/MapRoutePoints.js";
import ColorsDevice from "../common/components/ColorsDevice.js";
import MapRoutePath from "../map/MapRoutePath.js";

const MainMap = ({ filteredPositions, selectedPosition, onEventsClick, statusCardOpen, setStatusCardOpen }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const eventsAvailable = useSelector((state) => !!state.events.items.length);
  const features = useFeatures();
  const devices = useSelector((state) => state.devices.items);
  const [stops, setStops] = useState([])
  const [positions, setPositions] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const selectedId = useSelector((state) => state.devices.selectedId);
 
  const groupIds = useSelector((state) => state.reports.groupIds);
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");

  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch]
  );

  const createMarkersStops = () => {
    return stops.map((stop, index) => {
      const device = devices[stop.deviceId] || {}; 
      const attributes = device.attributes || {};  
      const {bgColor, subColor, color} = ColorsDevice(attributes['web.reportColor']);

      return({
        latitude: stop.latitude,
        longitude: stop.longitude,
        stopped: `${index+1}`,
        bgColor,
        color,
        subColor
      })
    })
  }

  const handleSubmit = useCatch(async ({ deviceId, from, to }) => {
    setLoading(true);
    const query = new URLSearchParams({ deviceId, from, to });
    try {
      const response = await fetch(`/api/positions?${query.toString()}`);
      if (response.ok) {
        const positions = await response.json();
        const positionsFilter = positions.filter((position, index)=> {
          if(index === 0) return position;
          if(index % 4 === 0) return position;
        });
        setPositions(positionsFilter);
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  });

    const handleStops = useCatch(async ({ deviceId, from, to, type }) => {
      const query = new URLSearchParams({ deviceId, from, to });
      if (type === 'export') {
        window.location.assign(`/api/reports/stops/xlsx?${query.toString()}`);
      } else if (type === 'mail') {
        const response = await fetch(`/api/reports/stops/mail?${query.toString()}`);
        if (!response.ok) {
          throw Error(await response.text());
        }
      } else {
        setLoading(true);
        try {
          const response = await fetch(`/api/reports/stops?${query.toString()}`, {
            headers: { Accept: 'application/json' },
          });
          if (response.ok) {
            const json = await response.json()
            setStops(json);
          } else {
            throw Error(await response.text());
          }
        } finally {
          setLoading(false);
        }
      }
    });

  useEffect(() => {
    if (devices[selectedId] && selectedId) {
      handleSubmit({
        deviceId: selectedId,
        groupIds,
        from: from.toISOString(),
        to: to.toISOString(),
      });
      handleStops({
        deviceId: selectedId,
        groupIds,
        from: from.toISOString(),
        to: to.toISOString(),
      });
    } else {
      setPositions([]);
      setStops([]);
    }
  }, [selectedId, selectedPosition]);


  return (
    <>
      <MapView>
        <MapOverlay />
        <MapGeofence />
        <MapAccuracy positions={filteredPositions} />
        <MapPositions
          positions={filteredPositions}
          onClick={onMarkerClick}
          selectedPosition={selectedPosition}
          setStatusCardOpen={setStatusCardOpen}
          showStatus
          setStops={setStops}
          setPositions={setPositions}
        />
        <MapRoutePoints positions={positions} colorStatic={true}/>
        <MapRoutePath positions={positions} />
        {stops && <MapMarkersStops markers={createMarkersStops()} />}
        <MapDefaultCamera />
        {statusCardOpen && (<MapSelectedDevice />)}
        <PoiMap />
      </MapView>
      <MapScale />
      <MapCurrentLocation />
      <MapGeocoder />
      {!features.disableEvents && (
        <MapNotification enabled={eventsAvailable} onClick={onEventsClick} />
      )}
      {desktop && (
        <MapPadding
          left={
            parseInt(theme.dimensions.drawerWidthDesktop, 10) +
            parseInt(theme.spacing(1.5), 10)
          }
        />
      )}
    </>
  );
};

export default MainMap;
