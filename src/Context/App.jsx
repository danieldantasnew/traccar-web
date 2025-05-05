import { createContext, useContext, useState } from "react";

const DevicesContext = createContext();

export const DevicesProvider = ({ children }) => {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [heightMenuNavMobile, setHeightMenuNavMobile] = useState(0);
  const [statusCardOpen, setStatusCardOpen] = useState(false);
  const [firstLoadDevice, setFirstLoadDevice] = useState(true);

  const [stopCard, setStopCard] = useState(null);
  const [totalStops, setTotalStops] = useState(null);
  const [staticRoutes, setStaticRoutes] = useState(true);


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
