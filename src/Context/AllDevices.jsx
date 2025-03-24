import { createContext, useContext, useState } from 'react';

const DevicesContext = createContext();

export const DevicesProvider = ({ children }) => {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [heightMenuNavMobile, setHeightMenuNavMobile] = useState(0);

  return (
    <DevicesContext.Provider value={{ devicesOpen, setDevicesOpen, setHeightMenuNavMobile, heightMenuNavMobile}}>
      {children}
    </DevicesContext.Provider>
  );
};

export const useDevices = () => useContext(DevicesContext);
