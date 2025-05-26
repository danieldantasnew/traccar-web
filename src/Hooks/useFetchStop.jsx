import { useEffect, useRef } from "react";
import { useDevices } from "../Context/App";
import { useCatch } from "../reactHelper";
import dayjs from "dayjs";

const useFetchStop = (setLoading, dependencies) => {
  const { setTotalStops } = useDevices();
  const alreadyRendered = useRef(false);
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");

  const handleStops = useCatch(async ({ deviceId, from, to }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ deviceId, from, to });
      const response = await fetch(`/api/reports/stops?${query.toString()}`, {
        headers: { Accept: "application/json" },
      });

      const json = await response.json();
      if (Array.isArray(json) && json.length > 0)
        setTotalStops((state) => {
          const newStop = {
            total: json.length - 1,
            deviceId: json[0].deviceId,
          };
          const existsStop = state.find((s) => s.deviceId === newStop.deviceId);

          if (existsStop) {
            return state.map((s) =>
              s.deviceId === newStop.deviceId ? newStop : s
            );
          } else {
            return [...state, newStop];
          }
        });
    } catch (error) {}
  });

  useEffect(() => {
    const devicesSnapshot = [...dependencies];

    if (!alreadyRendered.current) {
      const fetchStops = () => {
        if (Array.isArray(devicesSnapshot) && devicesSnapshot.length > 0) {
          for (const device of devicesSnapshot) {
            handleStops({
              deviceId: device.id,
              from: from.toISOString(),
              to: to.toISOString(),
            });
          }
          setLoading(false);
          alreadyRendered.current = true;
        }
      };

      fetchStops();
    }
  }, [dependencies]);

  useEffect(() => {
    const interval = setInterval(
      () => (alreadyRendered.current = false),
      2 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default useFetchStop;
