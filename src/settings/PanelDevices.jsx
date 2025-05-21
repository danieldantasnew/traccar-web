import { Box, Tooltip, Typography } from "@mui/material";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import useFilter from "../main/useFilter";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import usePersistedState from "../common/util/usePersistedState";
import DevicesInPanel from "./components/DevicesInPanel";
import { useCatch } from "../reactHelper";
import { useDevices } from "../Context/App";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const styles = makeStyles((theme) => ({
  flexRow: {
    display: "flex",
    alignItems: "center",
  },
  container: {
    padding: "1rem",
    height: "100%",
  },
  header: {
    justifyContent: "space-between",
    padding: "1rem 0",
  },
  powers: {
    gap: "1rem",
    "& div": {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: ".3rem",
      padding: ".2rem .5rem",
      height: "40px",
      width: "80px",
      borderRadius: "4px",
      backgroundColor: "#f3f3f3",
      "& p": {
        fontSize: "1.2rem",
        fontWeight: 500,
      },
    },
  },
}));

const PanelDevices = () => {
  const classes = styles();
  const location = useLocation();
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filterSort, setFilterSort] = usePersistedState("filterSort", "");
  const [filterMap, setFilterMap] = usePersistedState("filterMap", false);
  const [filter, setFilter] = usePersistedState("filter", {
    statuses: [],
    groups: [],
  });

  const [loading, setLoading] = useState(false);
  const { totalStops, setTotalStops } = useDevices();
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");
  const [devicesOn, setDevicesOn] = useState(0);
  const [devicesOff, setDevicesOff] = useState(0);

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
          const newStop = { total: json.length, deviceId: json[0].deviceId };
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

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  useEffect(() => {
    if (Array.isArray(filteredPositions) && filteredPositions.length > 0) {
      setDevicesOn(0);
      setDevicesOff(0);
      filteredPositions.forEach((position) => {
        if (position?.attributes?.ignition || position?.attributes?.motion) {
          setDevicesOn((prev) => prev + 1);
        } else {
          setDevicesOff((prev) => prev + 1);
        }
      });
    }
  }, [filteredPositions]);

  useEffect(() => {
    const devicesSnapshot = [...filteredDevices];

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
      }
    };

    fetchStops();

    const interval = setInterval(fetchStops, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "deviceTitle"]}
    >
      <Box className={classes.container}>
        <Box className={`${classes.flexRow} ${classes.header}`}>
          <Box className={`${classes.flexRow} ${classes.powers}`}>
            <Tooltip title="Dispositivos Ligados" placement="bottom" arrow>
              <Box
                sx={{
                  backgroundColor: `${devicesOn ? "#EDF7ED !important" : ""}`,
                  color: `${devicesOn ? "#4CAF50 !important" : ""}`,
                }}
              >
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
                <Typography>{devicesOn}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Dispositivos Desligados" placement="bottom" arrow>
              <Box
                sx={{
                  backgroundColor: `${devicesOff ? "#FFE6E6 !important" : ""}`,
                  color: `${devicesOff ? "#FF0000 !important" : ""}`,
                }}
              >
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
                <Typography>{devicesOff}</Typography>
              </Box>
            </Tooltip>
          </Box>
          <Box>Filters</Box>
        </Box>
        <DevicesInPanel
          filteredDevices={filteredDevices}
          filteredPositions={filteredPositions}
        />
      </Box>
    </PageLayout>
  );
};

export default PanelDevices;
