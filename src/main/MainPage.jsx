import React, { useState, useCallback, useEffect } from "react";
import { IconButton, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import DeviceList from "./DeviceList";
import BottomMenu from "../common/components/BottomMenu";
import StatusCard from "../common/components/StatusCard";
import { devicesActions } from "../store";
import usePersistedState from "../common/util/usePersistedState";
import EventsDrawer from "./EventsDrawer";
import useFilter from "./useFilter";
import MainToolbar from "./MainToolbar";
import MainMap from "./MainMap";
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { useAttributePreference } from "../common/util/preferences";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  sidebar: {
    backgroundColor: "#ffffff",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "auto",
    position: "fixed",
    left: 0,
    top: 0,
    width: "100%",
    margin: 0,
    zIndex: 60,
  },
  sidebarLayoutLeft: {
    pointerEvents: "auto",
    zIndex: 6,
  },
  sidebarLayoutRight: {
    pointerEvents: "auto",
    zIndex: 6,
  },
  allDevices: {
    display: 'flex',
    flexDirection: 'column',
    
  },
  devices: {
    display: "grid",
    maxHeight: "100% !important",
    height: "100% !important",
    overflow: "auto",
    position: 'fixed',
    top: '4rem',
    width: '28vw',
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

  const [devicesOpen, setDevicesOpen] = useState(desktop);
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
      {desktop && (
        <MainMap
          filteredPositions={filteredPositions}
          selectedPosition={selectedPosition}
          onEventsClick={onEventsClick}
        />
      )}
      <div className={classes.sidebar}>
        <Paper elevation={0} className={classes.sidebarLayoutLeft}>
          <IconButton edge="start" onClick={() => setDevicesOpen(!devicesOpen)}>
            {devicesOpen ? <MapRoundedIcon /> : <ViewListRoundedIcon />}
          </IconButton>
          <Paper elevation={0} className={classes.allDevices} style={devicesOpen ? {} : { visibility: "hidden" }}>
            <MainToolbar
              filteredDevices={filteredDevices}
              devicesOpen={devicesOpen}
              setDevicesOpen={setDevicesOpen}
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
            <div
              className={classes.devices}
            >
              {!desktop && (
                <div className={classes.contentMap}>
                  <MainMap
                    filteredPositions={filteredPositions}
                    selectedPosition={selectedPosition}
                    onEventsClick={onEventsClick}
                  />
                </div>
              )}
              <Paper square className={classes.contentList}>
                <DeviceList devices={filteredDevices} phraseGroup={phraseGroup} />
              </Paper>
            </div>
          </Paper>
        </Paper>
        {desktop && (
          <Paper elevation={0} className={classes.sidebarLayoutRight}>
            <BottomMenu />
          </Paper>
        )}
      </div>
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
