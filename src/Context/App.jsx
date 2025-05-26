import { createContext, useContext, useEffect, useState } from "react";
import { useCatch } from "../reactHelper";
import { useDispatch } from "react-redux";
import { notificationsActions } from "../store/notifications";

const DevicesContext = createContext();

export const DevicesProvider = ({ children }) => {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [heightMenuNavMobile, setHeightMenuNavMobile] = useState(0);
  const [statusCardOpen, setStatusCardOpen] = useState(false);
  const [firstLoadDevice, setFirstLoadDevice] = useState(true);

  const [stopCard, setStopCard] = useState(null);
  const [totalStops, setTotalStops] = useState([]);
  const [staticRoutes, setStaticRoutes] = useState(true);

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

  useEffect(() => {
    getAllNotifications();
  }, []);

  return (
    <DevicesContext.Provider
      value={{
        devicesOpen,
        heightMenuNavMobile,
        statusCardOpen,
        firstLoadDevice,
        stopCard,
        totalStops,
        staticRoutes,
        alert,
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
