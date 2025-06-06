import { Box, Tooltip, Typography } from "@mui/material";
import PageLayout from "../common/components/PageLayout";
import SettingsMenu from "./components/SettingsMenu";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import useFilter from "./utils/useFilter";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DevicesInPanel from "./components/DevicesInPanel";
import useFetchStop from "../hooks/useFetchStop";
import MainToolbar from "./components/MainToolbar";

const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [devicesOn, setDevicesOn] = useState(0);
  const [devicesOff, setDevicesOff] = useState(0);

  useFilter(
    keyword,
    filter,
    positions,
    setFilteredDevices,
    setFilteredPositions,
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

  useFetchStop(setLoading, filteredDevices);

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
          <MainToolbar
            setKeyword={setKeyword}
            keyword={keyword}
            filter={filter}
            setFilter={setFilter}
          />
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
