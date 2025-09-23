import { useCallback, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import MapView, { map } from "../map/core/MapView";
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
import MapMarkersStops from "../map/MapMarkersStops.js";
import dayjs from "dayjs";
import MapRoutePoints from "../map/MapRoutePoints.js";
import MapRoutePath from "../map/MapRoutePath.js";
import { useDevices } from "../Context/App.jsx";
import MapCamera from "../map/MapCamera.js";
import MapMarkers from "../map/MapMarkers.js";
import useFetchPositionsAndStops from "../hooks/useFetchPositionsAndStops.jsx";
import MapSelectedDevice from "../map/main/MapSelectedDevice.js";
import { buildStops } from "../common/util/buildStops.js";

const MainMap = ({ filteredPositions, selectedPosition, setLoading }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const devices = useSelector((state) => state.devices.items);

  const {
    stops,
    positions,
    setPositions,
    setStops,
    configsOnTrip,
    routeTrips,
    hideRoutes,
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
  const { handlePositionsAndStops } = useFetchPositionsAndStops({
    setPositions,
    setStops,
    setLoading,
  });

  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch]
  );

  const markersStop = useMemo(
    () => buildStops(stops, positions, devices),
    [stops, positions, devices]
  );

  useEffect(() => {
    if (markersStop.length > 0) {
      setTotalStops((state) => {
        const newStop = {
          total: markersStop.length - 1,
          deviceId: markersStop[0].deviceId,
        };

        const existsStop = state.find((s) => s.deviceId === newStop.deviceId);

        if (existsStop) {
          return state.map((s) =>
            s.deviceId === newStop.deviceId ? newStop : s
          );
        } else {
          return [...state, newStop];
        }
      });
    }
  }, [markersStop, setTotalStops]);

  useEffect(() => {
    if (devices[selectedId] && selectedId && routeTrips.length === 0) {
      handlePositionsAndStops({
        deviceId: selectedId,
        groupIds,
        from: from.toISOString(),
        to: to.toISOString(),
      });
    } else {
      hideRoutes();
    }
  }, [selectedId, selectedPosition]);

  useEffect(()=> {
    map.scrollZoom.setWheelZoomRate(1/120);
  }, [])

  return (
    <>
      <MapView>
        {/* <MapSelectedDevice/> */}
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
            {stops?.length > 0 ? (
              <MapMarkersStops
                markers={markersStop}
                setStopCard={setStopCard}
                key={`stops-${stops.length}`}
              />
            ) : null}
          </>
        )}
        {routeTrips && routeTrips.length > 0 && (
          <>
            <MapRoutePath positions={routeTrips} />
            <MapRoutePoints
              positions={routeTrips}
              colorStatic={false}
              needFilterPosition={false}
            />
            <MapCamera positions={routeTrips} />
            {configsOnTrip.markers && (
              <MapMarkers markers={configsOnTrip.markers} />
            )}
          </>
        )}
        <MapDefaultCamera />
        <PoiMap />
      </MapView>
      <MapScale />
      <MapCurrentLocation />
      <MapGeocoder />
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
