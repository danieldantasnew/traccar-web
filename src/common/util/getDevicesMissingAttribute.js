/**
 * Retorna os dispositivos que estão sem o atributo especificado.
 *
 * @param {Object} devices - Objeto contendo os dispositivos.
 * @param {string} [attribute="default"] - Nome do atributo a verificar (ex: "deviceColors").
 * @returns {Array} Lista de devices (objeto) que precisam do atributo.
 */
export default function getDevicesMissingAttribute(devices, attribute = "default") {
  if (!devices || Object.keys(devices).length === 0 || attribute === "default") {
    return [];
  }

  const devicesArray = Object.values(devices).filter(device => {
    return !Object.hasOwn(device?.attributes || {}, attribute);
  });

  return devicesArray;
}