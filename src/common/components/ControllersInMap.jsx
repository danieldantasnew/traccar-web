import { Box, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { map } from "../../map/core/MapView";
import { useAttributePreference } from "../util/preferences";
import dimensions from "../theme/dimensions.js";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../../store";
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
    top: "15rem",
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
  },
  controls: {
    height: "29px",
    width: "29px",
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

const ControllersInMap = ({ position, selectedDeviceId, onClick }) => {
  const classes = useStyles();
  const selectZoom = useAttributePreference("web.selectZoom", 10);
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.items);
  const unreads = useSelector((state) => state.events.unreads);
  const [animKey, setAnimKey] = useState(0);
  const timeOutRef = useRef();

  const { setStopCard } = useDevices();

  const centerDevice = () => {
    map.easeTo({
      center: [position.longitude, position.latitude],
      zoom: Math.max(map.getZoom(), selectZoom),
      offset: [0, -dimensions.popupMapOffset / 2],
    });
  };

  const hideRoutes = () => {
    setStopCard(null);
    dispatch(devicesActions.selectId(null));
  };

  const { background } =
    devices[selectedDeviceId]?.attributes?.deviceColors || "#000";

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

  return (
    <Box className={classes.styleBox}>
      <Tooltip
        className={classes.controls}
        title="Notificações"
        placement="left"
        arrow
      >
        <Box onClick={onClick}>
          <BellOn
            key={animKey}
            color={!!unreads.length ? "red" : "#000"}
            animated={!!unreads.length}
            uniqAnimation={true}
          />
          <Box className={`${!!unreads.length ? classes.notifications : ""}`}></Box>
        </Box>
      </Tooltip>
      {selectedDeviceId && (
        <>
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
          <Tooltip className={classes.controls} aria-label="Ocultar rotas" title="Ocultar rotas" placement="left" arrow>
            <Box onClick={hideRoutes}>
              <FontAwesomeIcon icon={faEyeSlash} color={`${background}`} />
            </Box>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default ControllersInMap;
