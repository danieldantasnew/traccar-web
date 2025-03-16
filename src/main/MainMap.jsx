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
import MapRouteCoordinates from "../map/MapRouteCoordinates";
import MapMarkers from "../map/MapMarkers";
import dayjs from "dayjs";
import { useCatch } from "../reactHelper.js";
import MapRoutePoints from "../map/MapRoutePoints.js";

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
  const [directions, setDirections] = useState(null);
 
  const deviceIds = useSelector((state) => state.devices.selectedIds);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");

  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch]
  );

  const createMarkers = () => {
    return items.flatMap((item) =>
       item.events
         .map((event) => item.positions.find((p) => event.positionId === p.id))
         .filter((position) => position != null)
         .map((position, index) => ({
           latitude: position.latitude,
           longitude: position.longitude,
           stopped: `${index+1}`,
           bgColor: `${devices[item.deviceId].bgColor}`,
           color: `${devices[item.deviceId].color}`,
         }))
     );
   }

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
    if(items) {
      items.forEach((item, index)=> {
        if(index === 0) {
          setDirections(items[index].positions)
        }

        return null;
      })
    }
  }, [items])

  useEffect(() => {
    if (devices[selectedId] && selectedId) {
      handleSubmit({
        deviceIds,
        groupIds,
        from: from.toISOString(),
        to: to.toISOString(),
      });
    } else {
      setItems([]);
      setDirections(null);
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
        {directions ? <MapRoutePoints positions={directions} colorDynamic={true}/> : ''}
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
