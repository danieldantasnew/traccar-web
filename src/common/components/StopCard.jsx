import { useTheme } from "@emotion/react";
import { faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  Tooltip,
  Typography,
  useMediaQuery,
  Zoom,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "./LocalizationProvider";
import AddressComponent from "./AddressComponent";
import { formatTime } from "../util/formatter";
import durationOfStop from "../util/durationOfStop";

const useStyles = makeStyles((theme) => ({
  card: {
    pointerEvents: "auto",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    gap: ".5rem",
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

const StopCard = ({ stop, setStopCard, setStatusCardOpen }) => {
  const classes = useStyles();
  const [zoom, setZoom] = useState(true);
  const theme = useTheme();
  const t = useTranslation();
  const desktop = useMediaQuery(theme.breakpoints.down("md"));
  const [axisY, setAxisY] = useState(0);

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
            <Box className={classes.flexRow} sx={{ padding: "2.4rem .5rem", backgroundColor: stop.bgColor }}>
              <Typography
                variant="h2"
                fontSize="1.6rem"
                fontWeight="bold"
                color={`${stop.color}`}
                sx={{display: "flex", alignItems: "center", gap: ".4rem"}}
              >
                <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '26px' }}/>
                Informações da Parada
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
            <Box sx={{ padding: ".5rem", }}>
              <Box>
                <Typography variant="h4" fontSize="1.2rem" fontWeight="bold">
                  {stop.stopped + '° parada'}
                </Typography>
                <Typography variant="h4" fontSize="1.2rem" fontWeight="bold">
                  Dispositivo
                </Typography>
                <Typography>{stop.deviceName}</Typography>
              </Box>
              <Box sx={{'& h4': { fontSize: '.9rem !important'}}}>
                <AddressComponent position={{latitude: stop.latitude, longitude: stop.longitude, address: stop.address}} t={t} labelAdress="Endereço da Parada"/>
              </Box>

              <Box>
                <Box>Horario de início: {formatTime(stop.startTime, 'seconds')}</Box>
                <Box>Horario de fim: {formatTime(stop.endTime, 'seconds')}</Box>
                <Box>Duração da parada: {durationOfStop(stop.startTime, stop.endTime).formatted}</Box>
                <Box>Latitude: {parseFloat(stop.latitude).toFixed(6)}</Box>
                <Box>Logitude: {parseFloat(stop.longitude).toFixed(6)}</Box>
              </Box>
            </Box>
          </Card>
        </Zoom>
      </Box>
    </>
  );
};

export default StopCard;
