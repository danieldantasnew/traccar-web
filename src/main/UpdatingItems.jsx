import { useEffect } from "react";
import { useSelector } from "react-redux";
import getDevicesMissingAttribute from "../common/util/getDevicesMissingAttribute";
import useCreateAttribute from "../Hooks/useCreateAttribute";
import { getRandomColor } from "../common/util/colors";
import Loader from "../common/components/Loader";

const UpdatingItems = ({ setUpdatingItems }) => {
  const devices = useSelector((state) => state.devices.items);
  const loading = useSelector((state) => state.devices.loading);
  const missingAttributeDeviceColorsInDevices = getDevicesMissingAttribute(
    devices,
    "deviceColors"
  );
  const missingAttributeDriverInDevices = getDevicesMissingAttribute(
    devices,
    "driver"
  );
  useCreateAttribute(
    missingAttributeDeviceColorsInDevices,
    "deviceColors",
    getRandomColor
  );
  useCreateAttribute(missingAttributeDriverInDevices, "driver", {});

  useEffect(() => {
    if (!loading) {
      if (
        (!Array.isArray(missingAttributeDeviceColorsInDevices) ||
          missingAttributeDeviceColorsInDevices.length === 0) &&
        (!Array.isArray(missingAttributeDriverInDevices) ||
          missingAttributeDriverInDevices.length === 0)
      ) {
          setUpdatingItems(false);
      }
    }
  }, [
    loading,
    missingAttributeDeviceColorsInDevices,
    missingAttributeDriverInDevices,
  ]);
  return <Loader/>;
};

export default UpdatingItems;
