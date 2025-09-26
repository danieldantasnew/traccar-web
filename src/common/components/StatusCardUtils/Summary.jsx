import { Box, Typography } from "@mui/material";
import AddressComponent from "../AddressComponent";
import AttributesOfDevice from "../AttributesOfDevice";
import LinkDriver from "../LinkDriver";
import { useDevices } from "../../../Context/App";
import { useEffect, useState } from "react";
import useFetchPositionsAndStops from "../../../hooks/useFetchPositionsAndStops";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import SpinLoading from "../SpinLoading";

const Summary = ({ backgroundColor, position, device }) => {
  const selectedId = useSelector((state) => state.devices.selectedId);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const { positions, setPositions, setStops, hideRoutesTrips } = useDevices();
  const [loading, setLoading] = useState(false);
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");
  const { handlePositionsAndStops } = useFetchPositionsAndStops({
    setPositions,
    setStops,
    setLoading,
  });

  useEffect(() => {
    hideRoutesTrips();
    if (positions && positions.length == 0 && selectedId) {
      handlePositionsAndStops({
        deviceId: selectedId,
        groupIds,
        from: from.toISOString(),
        to: to.toISOString(),
      });
    }
  }, []);

  if (!position) return <Typography>Nada por aqui...</Typography>;
  if (loading) return <SpinLoading backgroundColor={backgroundColor} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: ".8rem",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box sx={{ maxHeight: "264px", overflow: "auto" }}>
        <AddressComponent position={position} />
        <AttributesOfDevice position={position} device={device} />
      </Box>
      <LinkDriver device={device} />
    </Box>
  );
};

export default Summary;
