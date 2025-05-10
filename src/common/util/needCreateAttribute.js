/**
 * Verifica se algum dispositivo está sem o atributo especificado dentro de `attributes`.
 *
 * @param {Object} devices - Objeto contendo os dispositivos.
 * @param {string} [attribute="default"] - Nome da chave dentro de `attributes` (ex: "deviceColors", "driver").
 * @returns {boolean} Retorna true se ao menos um dispositivo estiver sem o atributo.
 */

export default function needCreateAttribute(devices, attribute = "default") {
  if (!devices || Object.keys(devices).length === 0 || attribute === "default") {
    return false;
  }

  return Object.values(devices).some(device => {
    return !Object.hasOwn(device?.attributes || {}, attribute);
  });
}

//Melhorar a função para retornar um array com os id's que precisam da criação do atributo e no hook fazer um looping apenas criando os atributos desses id's. Pois atualmente faz um looping por todo o objeto 2x, aqui nessa função e também no hook.