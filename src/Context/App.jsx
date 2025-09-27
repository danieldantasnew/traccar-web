import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCatch } from "../reactHelper";
import { useDispatch } from "react-redux";
import { notificationsActions } from "../store/notifications";
import { devicesActions } from "../store";

const DevicesContext = createContext();

export const DevicesProvider = ({ children }) => {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [heightMenuNavMobile, setHeightMenuNavMobile] = useState(0);
  const [statusCardOpen, setStatusCardOpen] = useState(false);
  const [firstLoadDevice, setFirstLoadDevice] = useState(true);

  const [routeTrips, setRouteTrips] = useState([]);
  const [configsOnTrip, setConfigsOnTrip] = useState({
    markers: null,
  });
  const [selectedItemOnTrip, setSelectedItemOnTrip] = useState(null);

  const [stopCard, setStopCard] = useState(null);
  const [totalStops, setTotalStops] = useState([]);
  const [staticRoutes, setStaticRoutes] = useState(true);

  const [ stopCardSelected, setStopCardSelected] = useState(null);
  const [stops, setStops] = useState([]);
  const [positions, setPositions] = useState([]);
  const [mainMapPositions, setMainMapPositions] = useState([]);

  const popupMarkerPoint = useRef(null);

  const [alert, setAlert] = useState(false);

  const dispatch = useDispatch();

  const getAllNotifications = useCatch(async () => {
    const response = await fetch(`/api/notifications`);
    if (response.ok) {
      const json = await response.json();
      dispatch(notificationsActions.add(json));
    } else {
      throw Error(await response.text());
    }
  });

  const closePopUpMarkerPoint = ()=> {
    if(popupMarkerPoint.current) {
      popupMarkerPoint.current._onClose();
      popupMarkerPoint.current = null;
    }
  }

  const hideRoutes = (closeDevice = false) => {
    closePopUpMarkerPoint();
    setStopCard(null);
    setPositions([]);
    setStops([]);
    setStopCardSelected(null);
    if(closeDevice) dispatch(devicesActions.selectId(null));
  };

  const hideRoutesTrips = () => {
    closePopUpMarkerPoint();
    setRouteTrips([]);
    setSelectedItemOnTrip(null);
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  return (
    <DevicesContext.Provider
      value={{
        popupMarkerPoint,
        devicesOpen,
        heightMenuNavMobile,
        statusCardOpen,
        firstLoadDevice,
        stopCard,
        totalStops,
        staticRoutes,
        alert,
        mainMapPositions,
        routeTrips,
        selectedItemOnTrip, 
        configsOnTrip,
        stops, 
        positions, 
        stopCardSelected,
        setStopCardSelected,
        setPositions,
        setStops,
        setConfigsOnTrip,
        setSelectedItemOnTrip,
        hideRoutes,
        hideRoutesTrips,
        setRouteTrips,
        setMainMapPositions,
        setAlert,
        setStatusCardOpen,
        setFirstLoadDevice,
        setStopCard,
        setTotalStops,
        setStaticRoutes,
        setDevicesOpen,
        setHeightMenuNavMobile,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
};

export const useDevices = () => useContext(DevicesContext);
