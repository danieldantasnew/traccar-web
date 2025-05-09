import React, { useEffect, useState } from "react";
import { getRandomColor } from "../common/util/colors";
import { useSelector } from "react-redux";

const useEnsureDeviceColors = () => {
  const devices = useSelector((state) => state.devices.items);
  const [json, setJson] = useState(null)

  const createDeviceColorsAttribute = async (device) => {
    let url = `/api/${endpoint}/${device.id}`;
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
    setJson(jsonResponse)
    console.log(jsonResponse);
  };

  async function updateDevicesSequentially() {
    for (const device of devices) {
        console.log(device)
    //   if (!device.attributes?.deviceColors) {
    //     try {
    //       await createDeviceColorsAttribute(device);
    //     } catch (error) {
    //       throw new Error(`Erro ao atualizar device ${device.name}:`, error);
    //     }
    //   }
    }
  }

  useEffect(() => {
    if(devices && devices.length > 0) updateDevicesSequentially(); // devices é um objeto, verificar outra forma de ver o tamanho de um objeto
  }, [devices]);

  return json;
};

export default useEnsureDeviceColors;
