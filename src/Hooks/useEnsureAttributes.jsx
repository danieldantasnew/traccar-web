import React, { useEffect, useState } from "react";
import { getRandomColor } from "../common/util/colors";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../store";

const useEnsureAttributes = (needCreateDeviceColors) => {
  const devices = useSelector((state) => state.devices.items);
  const dispatch = useDispatch();
  const [json, setJson] = useState(null);

  const createDeviceColorsAttribute = async (device) => {
    let url = `/api/devices/${device.id}`;
    const updatedItem = {
      ...device,
      attributes: {
        ...(device.attributes || {}),
        deviceColors: getRandomColor(),
      },
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar deviceColors: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    setJson(jsonResponse);
    dispatch(devicesActions.update([jsonResponse]))
  };

  async function updateDevicesSequentially(devicesArray) {
    for (const [id, device] of devicesArray) {
      if (!Object.hasOwn(device?.attributes || {}, "deviceColors")) {
        try {
          await createDeviceColorsAttribute(device);
        } catch (error) {
          console.error(`Erro ao atualizar device ${device.name}:`, error);
          throw new Error(`Erro ao atualizar device ${device.name}`);
        }
      }
    }
  }

  useEffect(() => {
    if (needCreateDeviceColors) {
      const devicesArray = Object.entries(devices);
      if (devicesArray && devicesArray.length > 0)
        updateDevicesSequentially(devicesArray);
    }
  }, [needCreateDeviceColors]);

  return json;
};

export default useEnsureAttributes;
