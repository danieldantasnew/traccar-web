import { useTheme } from "@emotion/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, Tooltip, useMediaQuery, Zoom } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    pointerEvents: "auto",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    gap: ".5rem",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  flexRow: {
    display: "flex",
    alignItems: "center",
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

const StopsModal = ({ stop, setStopModal }) => {
  const classes = useStyles();
  const [zoom, setZoom] = useState(true);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.down("md"));
  const [axisY, setAxisY] = useState(0);

  const onClose = () => {
    setZoom(false);
    setAxisY(0);
  };

  return (
    <>
      <Box
        className={classes.root}
        style={desktop ? {} : { top: "0" }}
        onWheel={desktop ? handleWheel : null}
        onTouchMove={(e) => handleTouch(e, axisY, setAxisY)}
      >
        <Zoom in={zoom} onExited={() => setStopModal(null)}>
          <Card elevation={3} className={classes.card}>
            <Tooltip
              title="Fechar"
              arrow
              placement="right"
              onClick={onClose}
              onTouchStart={onClose}
              className={classes.closeButton}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Tooltip>
          </Card>
        </Zoom>
      </Box>
    </>
  );
};

export default StopsModal;
