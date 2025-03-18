import React, { useState, useCallback, useEffect } from "react";
import { Box, IconButton, Paper, Slide, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import DeviceList from "./DeviceList";
import StatusCard from "../common/components/StatusCard";
import { devicesActions } from "../store";
import usePersistedState from "../common/util/usePersistedState";
import EventsDrawer from "./EventsDrawer";
import useFilter from "./useFilter";
import MainToolbar from "./MainToolbar";
import MainMap from "./MainMap";
import { useAttributePreference } from "../common/util/preferences";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import NavMenu from "../common/components/NavMenu.jsx";
import { useDevices } from "../common/components/AllDevices.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
    zIndex: 5,
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
    minWidth: '336px',
    maxWidth: "480px",
    zIndex: "6",
    ["& h3"]: {
      margin: 0,
      padding: "0 1rem",
      fontSize: "1.6rem",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: "1rem",
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
  const dispatch = useDispatch();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const mapOnSelect = useAttributePreference("mapOnSelect", true);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );
  const phraseGroup = "OUTROS";

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = usePersistedState("filter", {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState("filterSort", "");
  const [filterMap, setFilterMap] = usePersistedState("filterMap", false);

  const {devicesOpen, setDevicesOpen, heightMenuNavMobile} = useDevices();
  const [eventsOpen, setEventsOpen] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  return (
    <div className={classes.root}>
      <MainMap
        filteredPositions={filteredPositions}
        selectedPosition={selectedPosition}
        onEventsClick={onEventsClick}
      />
      <Slide direction="right" in={devicesOpen} timeout={200}>
        <Paper square className={classes.allDevices} style={!desktop? {height: `calc(100% - ${heightMenuNavMobile}px)`}: {height: "100%"}}>
          <Box
            component={"div"}
            sx={{
              backgroundColor: theme.palette.primary.main,
              padding: "1rem 0 1rem 0",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box component={"h3"}>
                <DynamicIconsComponent
                  style={{ marginBottom: "3px" }}
                  category={"carGroup"}
                />
                Meus Veículos
              </Box>
              <Tooltip title="Fechar" arrow placement="right">
                <IconButton
                  size="medium"
                  onClick={() => setDevicesOpen(!devicesOpen)}
                  onTouchStart={() => setDevicesOpen(!devicesOpen)}
                >
                  <FontAwesomeIcon icon={faXmark} className={classes.mediaButton}/>
                </IconButton>
              </Tooltip>
            </Box>
            <MainToolbar
              filteredDevices={filteredDevices}
              keyword={keyword}
              setKeyword={setKeyword}
              filter={filter}
              setFilter={setFilter}
              filterSort={filterSort}
              setFilterSort={setFilterSort}
              filterMap={filterMap}
              setFilterMap={setFilterMap}
              phraseGroup={phraseGroup}
            />
          </Box>
          <div className={classes.devices}>
            <Paper square className={classes.contentList}>
              <DeviceList devices={filteredDevices} phraseGroup={phraseGroup} />
            </Paper>
          </div>
        </Paper>
      </Slide>
      {desktop && (
        <Paper square elevation={4} className={classes.sidebar}>
          <Box component="div" className={classes.sidebarLayout}>
            <NavMenu setDevicesOpen={setDevicesOpen} />
          </Box>
        </Paper>
      )}
      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default MainPage;
