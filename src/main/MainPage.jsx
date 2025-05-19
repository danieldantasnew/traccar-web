import { useState, useCallback, useEffect, useRef } from "react";
import { Box, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";
import { useAttributePreference } from "../common/util/preferences";
import StatusCard from "../common/components/StatusCard.jsx";
import usePersistedState from "../common/util/usePersistedState";
import EventsDrawer from "./EventsDrawer";
import useFilter from "./useFilter";
import MainMap from "./MainMap";
import NavMenu from "../common/components/NavMenu.jsx";
import { useDevices } from "../Context/App.jsx";
import ControllersInMap from "../common/components/ControllersInMap.jsx";
import StopCard from "../common/components/StopCard.jsx";
import UpdatingItems from "./UpdatingItems.jsx";
import MyDevices from "./MyDevices.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  sidebar: {
    backgroundColor: "#ffff",
    pointerEvents: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "auto",
    position: "fixed",
    width: "auto",
    left: 12,
    top: "50%",
    borderRadius: "44px",
    transform: "translateY(-50%)",
    margin: 0,
    zIndex: 3,
    padding: "8px",
  },
  sidebarLayout: {
    pointerEvents: "auto",
    zIndex: 6,
  },
  allDevices: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    width: "28vw",
    minWidth: "336px",
    maxWidth: "480px",
    zIndex: "6",
    ["& h3"]: {
      margin: 0,
      padding: "0 1rem",
      fontSize: "1.6rem",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: ".5rem",
      ["& svg"]: {
        width: "32px",
        height: "32px",
        ["& path"]: {
          fill: "white",
        },
      },
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: "initial",
      zIndex: 60,
    },
  },
  devices: {
    display: "grid",
    maxHeight: "100% !important",
    height: "100% !important",
    overflow: "auto",
    width: "100%",
  },
  contentMap: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
  },
  contentList: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
    maxHeight: "100%",
    zIndex: 4,
  },
  mediaButton: {
    color: "white",
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const mapOnSelect = useAttributePreference("mapOnSelect", true);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const notificationsButtonRef = useRef(null);
  const [updatingItems, setUpdatingItems] = useState(true);

  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );

  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = usePersistedState("filter", {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState("filterSort", "");
  const [filterMap, setFilterMap] = usePersistedState("filterMap", false);

  const {
    statusCardOpen,
    stopCard,
    setDevicesOpen,
    setFirstLoadDevice,
    setStaticRoutes,
  } = useDevices();
  const [eventsOpen, setEventsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useEffect(() => {
    if (selectedDeviceId) {
      setFirstLoadDevice(true);
      setStaticRoutes(true);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    if (!loading) {
      setFirstLoadDevice(false);
    }
  }, [loading, setFirstLoadDevice, setLoading]);

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  return updatingItems ? (
    <UpdatingItems setUpdatingItems={setUpdatingItems} />
  ) : (
    <div className={classes.root}>
      <MainMap
        filteredPositions={filteredPositions}
        selectedPosition={selectedPosition}
        onEventsClick={onEventsClick}
        setLoading={setLoading}
      />
      <MyDevices
        filteredDevices={filteredDevices}
        setKeyword={setKeyword}
        keyword={keyword}
        filter={filter}
        setFilter={setFilter}
        setFilterSort={setFilterSort}
        filterSort={filterSort}
        setFilterMap={setFilterMap}
        filterMap={filterMap}
        desktop={desktop}
      />
      {desktop && (
        <Paper square elevation={4} className={classes.sidebar}>
          <Box component="div" className={classes.sidebarLayout}>
            <NavMenu setDevicesOpen={setDevicesOpen} />
          </Box>
        </Paper>
      )}
      <EventsDrawer
        open={eventsOpen}
        onClose={() => {
          setEventsOpen(false);
          notificationsButtonRef.current?.focus();
        }}
      />
      {selectedDeviceId && statusCardOpen && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
      <ControllersInMap
        position={selectedPosition}
        selectedDeviceId={selectedDeviceId}
        onClick={onEventsClick}
        notificationsButtonRef={notificationsButtonRef}
      />
      {selectedDeviceId && stopCard && <StopCard stop={stopCard} />}
    </div>
  );
};

export default MainPage;
