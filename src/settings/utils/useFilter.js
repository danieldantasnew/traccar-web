import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default (keyword, filter, positions, setFilteredDevices, setFilteredPositions) => {
  const devices = useSelector((state) => state.devices.items);
    
  useEffect(() => {
    const filtered = Object.values(devices)
      .filter((device) => {
        // console.log(filter)
        // console.log(positions[device.id]?.attributes)
        const lowerCaseKeyword = keyword.toLowerCase();
        return [device.name, device.uniqueId, device.phone, device.model, device.contact].some((s) => s && s.toLowerCase().includes(lowerCaseKeyword));
      });
    setFilteredDevices(filtered);
    setFilteredPositions(filtered.map((device) => positions[device.id]).filter(Boolean));
  }, [keyword, filter, devices, positions, setFilteredDevices, setFilteredPositions]);
};
