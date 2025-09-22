import { Box, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { map } from "../../map/core/MapView";
import dimensions from "../theme/dimensions.js";
import { useSelector } from "react-redux";
import {
  faEyeSlash,
  faInfo,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDevices } from "../../Context/App.jsx";
import BellOn from "./IconsAnimated/BellOn.jsx";
import { makeStyles } from "@mui/styles";
import centerInMap from "../util/centerInMap.js";

const useStyles = makeStyles((theme) => ({
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "translateX(-50%) scale(0)" },
    "80%": { opacity: 1, transform: "translateX(0) scale(1.2)" },
    "100%": { opacity: 1, transform: "translateX(0) scale(1)" },
  },
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
    animation: "$fadeIn .4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
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

const ControlButton = ({ title, classes, children }) => {
  return (
    <Tooltip
      className={classes.controls}
      aria-label={`${title}`}
      title={`${title}`}
      placement="left"
      arrow
    >
      {children}
    </Tooltip>
  );
};

const ControllersInMap = ({
  position,
  selectedDeviceId,
  onClick,
  notificationsButtonRef,
  setStatusCardOpen,
}) => {
  const classes = useStyles();
  const devices = useSelector((state) => state.devices.items);
  const unreads = useSelector((state) => state.events.unreads);
  const [animKey, setAnimKey] = useState(0);
  const timeOutRef = useRef();

  const { hideRoutes, hideRoutesTrips } = useDevices();

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

  const buttonOpc = [
    {
      title: "Centralizar dispositivo",
      icon: faMapPin,
      action: ()=> centerInMap(position, 16),
    },
    {
      title: "Ocultar rotas",
      icon: faEyeSlash,
      action: hiddenItems,
    },
    {
      title: "Ver informações do dispositivo",
      icon: faInfo,
      action: () => setStatusCardOpen(true),
    },
  ];

  return (
    <Box className={classes.styleBox}>
      <ControlButton classes={classes} title="Notificações">
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
      </ControlButton>
      {selectedDeviceId && (
        buttonOpc.map((button, index) => (
          <ControlButton classes={classes} title={button.title} key={index}>
            <Box onClick={button.action}>
              <FontAwesomeIcon
                icon={button.icon}
                color={`${background}`}
              />
            </Box>
          </ControlButton>
        ))
      )}
    </Box>
  );
};

export default ControllersInMap;
