import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../store";

const useCreateDriver = (needCreateAttribute) => {
  const devices = useSelector((state) => state.devices.items);
  const dispatch = useDispatch();
  const [json, setJson] = useState(null);

  const createDriver = async (device) => {
    let url = `/api/devices/${device.id}`;
    const updatedItem = {
      ...device,
      attributes: {
        ...(device.attributes || {}),
        driver: "",
      },
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao criar a propriedade Driver: ${response.statusText}`
      );
    }

    const jsonResponse = await response.json();
    setJson(jsonResponse);
    dispatch(devicesActions.update([jsonResponse]));
  };

  async function updateDevice(devicesArray) {
    for (const [id, device] of devicesArray) {
      if (!device?.attributes?.driver) {
        try {
          await createDriver(device);
        } catch (error) {
          console.error(
            `Erro ao atualizar o dispositivo ${device.name}:`,
            error
          );
          throw new Error(`Erro ao atualizar o dispositivo ${device.name}`);
        }
      }
    }
  }

  useEffect(() => {
    if (needCreateAttribute) {
      const devicesArray = Object.entries(devices);
      if (devicesArray && devicesArray.length > 0) updateDevice(devicesArray);
    }
  }, [needCreateAttribute]);

  return json;
};

export default useCreateDriver;
