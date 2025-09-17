import { useCatch } from "../reactHelper";

const useFetchPositionsAndStops = ({setLoading, setPositions, setStops}) => {
  const handlePositionsAndStops = useCatch(async ({ deviceId, from, to }) => {
    setLoading(true);
    const query = new URLSearchParams({ deviceId, from, to });

    const fetchPositions = fetch(`/api/positions?${query.toString()}`).then(
      async (response) => {
        if (response.ok) {
          const positions = await response.json();
          setPositions(positions);
        } else {
          throw Error(await response.text());
        }
      }
    );

    const fetchStops = fetch(`/api/reports/stops?${query.toString()}`, {
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const json = await response.json();
        setStops(json);
      } else {
        throw Error(await response.text());
      }
    });

    await Promise.all([fetchPositions, fetchStops]);
    setLoading(false);
  });

  return { handlePositionsAndStops };
};

export default useFetchPositionsAndStops;
