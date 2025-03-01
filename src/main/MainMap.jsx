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
import MapPositions from "../map/MapPositions";
import MapOverlay from "../map/overlay/MapOverlay";
import MapGeocoder from "../map/geocoder/MapGeocoder";
import MapScale from "../map/MapScale";
import MapNotification from "../map/notification/MapNotification";
import useFeatures from "../common/util/useFeatures";
import MapRouteCoordinates from "../map/MapRouteCoordinates";
import MapMarkers from "../map/MapMarkers";
import DevicePath from "../common/components/DevicePath.jsx";
import { useCatch } from "../reactHelper.js";

const MainMap = ({ filteredPositions, selectedPosition, onEventsClick }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const eventsAvailable = useSelector((state) => !!state.events.items.length);
  const features = useFeatures();
  const devices = useSelector((state) => state.devices.items);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedId = useSelector((state) => state.devices.selectedId);


  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch]
  );

  const createMarkers = () =>
    items.flatMap((item) =>
      item.events
        .map((event) => item.positions.find((p) => event.positionId === p.id))
        .filter((position) => position != null)
        .map((position) => ({
          latitude: position.latitude,
          longitude: position.longitude,
        }))
    );

    const handleSubmit = useCatch(async ({ deviceIds, groupIds, from, to }) => {
      const query = new URLSearchParams({ from, to });
      deviceIds.forEach((deviceId) => query.append("deviceId", deviceId));
      groupIds.forEach((groupId) => query.append("groupId", groupId));
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/combined?${query.toString()}`);
        if (response.ok) {
          setItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    });

    useEffect(()=> {
      console.log(selectedId)
    }, [selectedId]);
  return (
    <>
      {selectedId && <DevicePath setItems={setItems} handleSubmit={handleSubmit}/>}
      <MapView>
        <MapOverlay />
        <MapGeofence />
        <MapAccuracy positions={filteredPositions} />
        {/* <MapLiveRoutes positions={selectedPosition}/> */}
        <MapPositions
          positions={filteredPositions}
          onClick={onMarkerClick}
          selectedPosition={selectedPosition}
          showStatus
        />
        {items.map((item) => (
          <MapRouteCoordinates
            key={item.deviceId}
            name={devices[item.deviceId].name}
            coordinates={item.route}
            deviceId={item.deviceId}
          />
        ))}
        <MapMarkers markers={createMarkers()} />
        <MapDefaultCamera />
        <MapSelectedDevice />
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
