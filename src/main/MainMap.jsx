import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useDevices } from "../Context/App.jsx";

const MainMap = ({
  filteredPositions,
  selectedPosition,
  onEventsClick,
  setLoading,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const eventsAvailable = useSelector((state) => !!state.events.items.length);
  const features = useFeatures();
  const devices = useSelector((state) => state.devices.items);
  const [stops, setStops] = useState([]);
  const [positions, setPositions] = useState([]);
  const {
    statusCardOpen,
    setStatusCardOpen,
    firstLoadDevice,
    setStopCard,
    staticRoutes,
    setTotalStops,
  } = useDevices();

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

    const createMarkersStops = useMemo(() => {
      if (!stops || !positions || !devices) return [];
    
      return stops.map((stop, index) => {
        const stopPosition = positions.find(
          (position) => position.id === stop.positionId
        );
        const device = devices[stop.deviceId] || {};
        const attributes = device.attributes || {};
        const { bgColor, subColor, color } = ColorsDevice(
          attributes["web.reportColor"]
        );
        const model = device?.model || "";
        const safeStopPosition = Object.fromEntries(
          Object.entries(stopPosition || {}).filter(([key]) => key !== "attributes")
        );
        const attributesStopPosition = stopPosition?.attributes || {};
    
        return {
          ...safeStopPosition,
          ...attributesStopPosition,
          model,
          latitude: stop.latitude,
          longitude: stop.longitude,
          stopped: `${index == 0 ? "INI" : index}`,
          bgColor,
          color,
          subColor,
          address: stop.address,
          averageSpeed: stop.averageSpeed,
          deviceId: stop.deviceId,
          deviceName: stop.deviceName,
          duration: stop.duration,
          endTime: stop.endTime,
          startTime: stop.startTime,
        };
      });
    }, [stops, positions, devices]);
    
    useEffect(() => {
      if (createMarkersStops.length > 0) {
        setTotalStops(createMarkersStops.length - 1);
      }
    }, [createMarkersStops, setTotalStops]);
  

  const handlePositionsAndStops = useCatch(async ({ deviceId, from, to }) => {
    setLoading(true);
    const query = new URLSearchParams({ deviceId, from, to });

    const fetchPositions = fetch(`/api/positions?${query.toString()}`).then(
      async (response) => {
        if (response.ok) {
          const positions = await response.json();
          setPositions(positions);
        } else {
          throw Error(await response.text());
        }
      }
    );

    const fetchStops = fetch(`/api/reports/stops?${query.toString()}`, {
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const json = await response.json();
        setStops(json);
      } else {
        throw Error(await response.text());
      }
    });

    await Promise.all([fetchPositions, fetchStops]);
    setLoading(false);
  });

  useEffect(() => {
    if (devices[selectedId] && selectedId) {
      handlePositionsAndStops({
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
          MainMap={true}
        />
        {!firstLoadDevice && selectedId && (
          <>
            <MapRoutePoints
              positions={positions}
              colorStatic={staticRoutes}
              needFilterPosition={true}
            />
            <MapRoutePath positions={positions} staticColor={staticRoutes} />
            {stops?.length > 0 && (
              <MapMarkersStops
                markers={createMarkersStops}
                setStopCard={setStopCard}
              />
            )}
          </>
        )}
        <MapDefaultCamera />
        {statusCardOpen && <MapSelectedDevice />}
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
