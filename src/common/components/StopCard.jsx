import { useTheme } from "@emotion/react";
import {
  faMapLocationDot,
  faPowerOff,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  Zoom,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "./LocalizationProvider";
import AddressComponent from "./AddressComponent";
import AttributesStop from "./StopCardUtils/AttributesStop";
import { useDevices } from "../../Context/App";

const useStyles = makeStyles((theme) => ({
  card: {
    pointerEvents: "auto",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  closeButton: {
    color: "white",
    padding: "4px",
    backgroundColor: "#bababa",
    borderRadius: "50%",
    height: "22px",
    width: "22px",
    cursor: "pointer",
    boxShadow: "0 0 4px .5px rgba(255, 255, 255, 0.62)",
    ["&:hover"]: {
      backgroundColor: "red",
    },
  },
  flexRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    columnGap: "2rem",
    rowGap: "1.4rem",
  },
  root: () => ({
    pointerEvents: "none",
    position: "fixed",
    zIndex: 10,
    left: "0",
    top: "0",
    height: "100vh",
    width: "50vw",
    maxWidth: "500px",
    transition: ".3s",
    [theme.breakpoints.down("md")]: {
      top: "50vh",
      width: "100vw",
      maxWidth: "initial",
      borderRadius: ".6rem",
      overflow: "hidden",
    },
  }),
}));

function handleWheel(e) {
  if (e.deltaY > 0) {
    return (e.currentTarget.style.top = "0");
  }
  return (e.currentTarget.style.top = "40vh");
}

function handleTouch(e, state, setState) {
  const deltaY = e.touches[0].clientY;
  setState(deltaY);
  if (deltaY > state) {
    return (e.currentTarget.style.top = "40vh");
  }
  return (e.currentTarget.style.top = "0");
}

const StopCard = ({ stop, }) => {
  const classes = useStyles();
  const [zoom, setZoom] = useState(true);
  const theme = useTheme();
  const t = useTranslation();
  const desktop = useMediaQuery(theme.breakpoints.down("md"));
  const [axisY, setAxisY] = useState(0);
  const {setStopCard, setStatusCardOpen} = useDevices();

  const onClose = () => {
    setZoom(false);
    setAxisY(0);
  };

  useEffect(() => {
    setStatusCardOpen(false);
  }, []);

  if (!stop) return null;
  return (
    <>
      <Box
        className={classes.root}
        style={desktop ? {} : { top: "0" }}
        onWheel={desktop ? handleWheel : null}
        onTouchMove={(e) => handleTouch(e, axisY, setAxisY)}
      >
        <Zoom in={zoom} onExited={() => setStopCard(null)}>
          <Card elevation={3} className={classes.card}>
            <Box
              className={classes.flexRow}
              sx={{ padding: "1.7rem .5rem", backgroundColor: stop.background }}
            >
              <Typography
                variant="h2"
                fontSize="1.6rem"
                fontWeight="bold"
                color={`${stop.text}`}
                sx={{ display: "flex", alignItems: "center", gap: ".4rem" }}
              >
                <FontAwesomeIcon
                  icon={faMapLocationDot}
                  style={{ fontSize: "26px" }}
                />
                Dados da Parada
              </Typography>
              <Tooltip
                title="Fechar"
                arrow
                placement="right"
                onClick={onClose}
                onTouchStart={onClose}
                className={classes.closeButton}
              >
                <FontAwesomeIcon size="xl" icon={faXmark} />
              </Tooltip>
            </Box>
            <Box
              sx={{ padding: "1rem .5rem", backgroundColor: "#ECECEC" }}
              className={classes.flexRow}
            >
              <Box className={classes.flexRow} sx={{ gap: ".6rem !important" }}>
                <Tooltip
                  title={`${stop.stopped == "INI" ? 'No estacionamento' : stop.stopped + '° Parada'}`}
                  arrow
                  placement="bottom"
                >
                  <IconButton
                    sx={{
                      fontSize: `${stop.stopped == "INI"  ? "1.5rem" : "1.9rem"}`,
                      fontWeight: "600",
                      width: "48px",
                      height: "48px",
                      boxShadow: `0 0 0 3px ${stop.text}`,
                      backgroundColor: `${stop.background}`,
                      color: `${stop.text}`,
                      "&:hover": {
                        backgroundColor: `${stop.secondary} !important`,
                      },
                    }}
                  >
                    {stop.stopped}
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={`Dispositivo estava ${
                    stop.ignition ? "Ligado" : "Desligado"
                  }`}
                  arrow
                  placement="bottom"
                >
                  <IconButton
                    sx={{
                      fontSize: "1.9rem",
                      fontWeight: "600",
                      width: "48px",
                      height: "48px",
                      boxShadow: `0 0 0 3px white`,
                      backgroundColor: `${
                        stop.ignition ? "#4CAF50" : "#FF0000"
                      }`,
                      color: `white`,
                      "&:hover": {
                        backgroundColor: `${
                          stop.ignition ? "#38883B" : "#C00000"
                        } !important`,
                      },
                    }}
                  >
                    <FontAwesomeIcon icon={faPowerOff} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                className={classes.flexColumn}
                sx={{ gap: "0 !important", alignItems: "flex-end !important" }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    lineHeight: "1rem",
                  }}
                >
                  {stop.deviceName}
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: "400" }}>
                  {stop.model}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                padding: "0 .5rem",
                " & h4": { fontSize: "1.4rem !important", lineHeight: "1rem" },
              }}
            >
              <AddressComponent
                position={{
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                  address: stop.address,
                }}
                t={t}
                labelAdress="Local"
              />
            </Box>
            <AttributesStop stop={stop} classes={classes}/>
          </Card>
        </Zoom>
      </Box>
    </>
  );
};

export default StopCard;
