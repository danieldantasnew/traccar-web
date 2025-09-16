import { Box, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { map } from "../../map/core/MapView";
import { useAttributePreference } from "../util/preferences";
import dimensions from "../theme/dimensions.js";
import { useSelector } from "react-redux";
import { faEyeSlash, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDevices } from "../../Context/App.jsx";
import BellOn from "./IconsAnimated/BellOn.jsx";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  styleBox: {
    position: "fixed",
    zIndex: 8,
    right: 10,
    top: "12.8rem",
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
  },
  controls: {
    height: "32px",
    width: "32px",
    backgroundColor: "#ffffff",
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 0px 1px 1.5px rgba(0, 0, 0, 0.1)",
    padding: "4px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "rgb(245, 245, 245)",
    },
  },
  notifications: {
    position: "absolute",
    content: "",
    backgroundColor: "red",
    color: "white",
    width: "5px",
    height: "5px",
    top: 5,
    right: 4,
    zIndex: 100,
    borderRadius: "50%",
  },
}));

const ControllersInMap = ({
  position,
  selectedDeviceId,
  onClick,
  notificationsButtonRef,
}) => {
  const classes = useStyles();
  const selectZoom = useAttributePreference("web.selectZoom", 10);
  const devices = useSelector((state) => state.devices.items);
  const unreads = useSelector((state) => state.events.unreads);
  const [animKey, setAnimKey] = useState(0);
  const timeOutRef = useRef();

  const { hideRoutes, routeTrips, hideRoutesTrips } = useDevices();

  const centerDevice = () => {
    map.easeTo({
      center: [position.longitude, position.latitude],
      zoom: Math.max(map.getZoom(), selectZoom),
      offset: [0, -dimensions.popupMapOffset / 2],
    });
  };

  const { background } =
    devices[selectedDeviceId]?.attributes?.deviceColors || "#616161";

  useEffect(() => {
    if (unreads.length > 0) {
      clearInterval(timeOutRef.current);
      timeOutRef.current = setInterval(
        () => setAnimKey((prev) => prev + 1),
        15000
      );
    }

    return () => clearInterval(timeOutRef.current);
  }, [unreads.length]);

  const hiddenItems = () => {
    hideRoutes(true);
    hideRoutesTrips();
  };

  return (
    <Box className={classes.styleBox}>
      <Tooltip
        className={classes.controls}
        title="Notificações"
        placement="left"
        arrow
      >
        <Box onClick={onClick} tabIndex={0} ref={notificationsButtonRef}>
          <BellOn
            key={animKey}
            color={!!unreads.length ? "red" : "#616161"}
            animated={!!unreads.length}
            uniqAnimation={true}
          />
          <Box
            className={`${!!unreads.length ? classes.notifications : ""}`}
          ></Box>
        </Box>
      </Tooltip>
      {selectedDeviceId && (
        <Tooltip
          className={classes.controls}
          aria-label="Centralizar dispositivo"
          title="Centralizar dispositivo"
          placement="left"
          arrow
        >
          <Box onClick={centerDevice}>
            <FontAwesomeIcon icon={faMapPin} color={`${background}`} />
          </Box>
        </Tooltip>
      )}
      {(selectedDeviceId || routeTrips && routeTrips.length > 0) && (
          <>
            <Tooltip
              className={classes.controls}
              aria-label="Ocultar rotas"
              title="Ocultar rotas"
              placement="left"
              arrow
            >
              <Box onClick={() => hiddenItems()}>
              <FontAwesomeIcon icon={faEyeSlash} color={`${background || "#616161"}`} />
              </Box>
            </Tooltip>
          </>
        )}
    </Box>
  );
};

export default ControllersInMap;
