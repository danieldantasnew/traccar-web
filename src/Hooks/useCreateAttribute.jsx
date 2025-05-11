import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { devicesActions } from "../store";

/**
 * Hook para criar um atributo ausente em uma lista de devices.
 * @param {Array} devicesMissingAttribute - Lista de dispositivos sem o atributo.
 * @param {string} attribute - Nome do atributo a ser criado.
 * @param {function|any} value - Valor a ser atribuído (ou função que retorna o valor).
 */
const useCreateAttribute = (devicesMissingAttribute, attribute, value) => {
  const dispatch = useDispatch();
  const [json, setJson] = useState(null);

  const createAttribute = async (device) => {
    const attrValue = typeof value === "function" ? value() : value;

    const updatedItem = {
      ...device,
      attributes: {
        ...(device.attributes || {}),
        [attribute]: attrValue,
      },
    };

    const response = await fetch(`/api/devices/${device.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar ${attribute}: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    setJson(jsonResponse);
    dispatch(devicesActions.update([jsonResponse]));
  };

  const updateDevicesSequentially = async () => {
    for (const device of devicesMissingAttribute) {
      try {
        await createAttribute(device);
      } catch (error) {
        console.error(`Erro ao atualizar device ${device.name}:`, error);
        throw new Error(`Erro ao atualizar device ${device.name}`);
      }
    }
  };

  useEffect(() => {
    if (
      Array.isArray(devicesMissingAttribute) &&
      devicesMissingAttribute.length > 0
    ) {
      updateDevicesSequentially();
    }
  }, [devicesMissingAttribute]);

  return json;
};

export default useCreateAttribute;
