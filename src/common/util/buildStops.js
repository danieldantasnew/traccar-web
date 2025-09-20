export const buildStops = (stops, positions, devices) => {
  if (!stops || !positions || !devices) return [];

  return stops.map((stop, index) => {
    const stopPosition = positions.find(
      (position) => position.id === stop.positionId
    );
    const device = devices[stop.deviceId] || {};
    const attributes = device?.attributes || {};
    const { background, text, secondary } = attributes?.deviceColors || {
      background: "black",
      icon: "red",
      text: "white",
      secondary: "blue",
    };
    const model = device?.model || "";
    const safeStopPosition = Object.fromEntries(
      Object.entries(stopPosition || {}).filter(([key]) => key !== "attributes")
    );
    const attributesStopPosition = stopPosition?.attributes || {};

    return {
      ...safeStopPosition,
      ...attributesStopPosition,
      model,
      latitude: stop.latitude,
      longitude: stop.longitude,
      stopped: `${index == 0 ? "INI" : index}`,
      background,
      text,
      secondary,
      address: stop.address,
      averageSpeed: stop.averageSpeed,
      deviceId: stop.deviceId,
      deviceName: stop.deviceName,
      duration: stop.duration,
      endTime: stop.endTime,
      startTime: stop.startTime,
    };
  });
};