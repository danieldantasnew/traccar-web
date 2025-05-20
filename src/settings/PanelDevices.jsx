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
    padding: "1rem",
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
  const devices = useSelector((state) => state.devices.items);
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

  const [devicesOn, setDevicesOn] = useState(0);
  const [devicesOff, setDevicesOff] = useState(0);

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

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={["settingsTitle", "deviceTitle"]}
    >
      <Box className={classes.container}>
        <Box className={`${classes.flexRow} ${classes.header}`}>
          <Box className={`${classes.flexRow} ${classes.powers}`}>
            <Tooltip title="Dispositivos Ligados" placement="bottom" arrow>
              <Box sx={{backgroundColor: `${devicesOn ? '#EDF7ED !important': ''}`, color: `${devicesOn ? '#4CAF50 !important': ''}`}}>
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
                <Typography>{devicesOn}</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Dispositivos Desligados" placement="bottom" arrow>
              <Box sx={{backgroundColor: `${devicesOff ? '#FFE6E6 !important': ''}`, color: `${devicesOff ? '#FF0000 !important': ''}`}}>
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
                <Typography>{devicesOff}</Typography>
              </Box>
            </Tooltip>
          </Box>
          <Box>Filters</Box>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default PanelDevices;
