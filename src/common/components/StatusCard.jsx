import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  CardMedia,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
  Zoom,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "./LocalizationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faXmark } from "@fortawesome/free-solid-svg-icons";
import InfoCar from "./InfoCar";
import TabsDevice from "./TabsDevice";
import PlusOpt from "./PlusOpt";
import { useCatch } from "../../reactHelper";
import RemoveDialog from "./RemoveDialog";
import { devicesActions } from "../../store";
import SkeletonStatusCard from "./SkeletonStatusCard";

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
  contentCardTop: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  ignitionState: {
    padding: "6px",
    display: "flex",
    alignItems: "center",
    gap: ".3rem",
    backgroundColor: "#f3f3f3",
    borderRadius: ".5rem",
    boxShadow: "0 0 4px 0px rgba(0, 0, 0, 0.34)",
    "& p": {
      fontWeight: "500",
      fontSize: ".9rem",
    },
  },
  box: {
    display: "flex",
    alignItems: "center",
    gap: ".3rem",
    justifyContent: "flex-start",
    padding: "2px 4px",
    "& svg": {
      width: "18px",
    },
    "& h2": {
      fontSize: ".8rem !important",
      color: "#444444 !important",
    },
  },
  media: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    maxHeight: "35vh",
    height: "100%",
    backgroundColor: "#fff",
    position: "relative",
  },
  red: {
    fill: "red",
    border: "2px solid red",
    color: "red",
  },
  green: {
    fill: "green",
    border: "2px solid green",
    color: "green",
  },
  orange: {
    fill: "orange",
    border: "2px solid orange",
    color: "orange",
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
  infoTop: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 8px",
    alignItems: "center",
    fontSize: "1.4rem",
    position: "absolute",
    top: 12,
    left: 0,
    width: "100%",
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    overflow: "auto",
  },
  cell: {
    borderBottom: "none",
  },
  actions: {
    justifyContent: "space-between",
    backgroundColor: "white",
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

const IgnitionState = ({ position, classes }) => {
  if (!position) return null;
  if (position.attributes.ignition || position.attributes.motion)
    return (
      <Card className={`${classes.ignitionState} ${classes.green}`}>
        <FontAwesomeIcon icon={faPowerOff} size="xs" />
        <Typography>Ligado</Typography>
      </Card>
    );

  return (
    <Card className={`${classes.ignitionState} ${classes.red}`}>
      <FontAwesomeIcon icon={faPowerOff} size="xs" />
      <Typography>Desligado</Typography>
    </Card>
  );
};

const StatusCard = ({
  deviceId,
  position,
  setStatusCardOpen,
  firstLoadDevice,
}) => {
  const classes = useStyles();
  const t = useTranslation();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.down("md"));
  const [axisY, setAxisY] = useState(0);
  const dispatch = useDispatch();

  const device = useSelector((state) => state.devices.items[deviceId]);
  const [removing, setRemoving] = React.useState(false);
  const [zoom, setZoom] = useState(false);
  const deviceImage = device?.attributes?.deviceImage;

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetch("/api/devices");
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
    setRemoving(false);
  });

  const onClose = () => {
    setZoom(false);
    setAxisY(0);
  };

  useEffect(() => {
    if (device) setZoom(true);
  }, [device]);

  return (
    <>
      <Box
        className={classes.root}
        style={desktop ? {} : { top: "0" }}
        onWheel={desktop ? handleWheel : null}
        onTouchMove={(e) => handleTouch(e, axisY, setAxisY)}
      >
        <Zoom in={zoom} onExited={() => setStatusCardOpen(false)}>
          <Card elevation={3} className={classes.card}>
            {firstLoadDevice ? (
              <SkeletonStatusCard classes={classes} onClose={onClose}/>
            ) : (
              <Box className={classes.contentCardTop}>
                <CardMedia
                  className={classes.media}
                  image={
                    deviceImage
                      ? `/api/media/${device.uniqueId}/${deviceImage}`
                      : "../../../withoutPhoto.png"
                  }
                >
                  <Box component={"div"} className={classes.infoTop}>
                    {position ? (
                      <IgnitionState position={position} classes={classes} />
                    ) : (
                      <span></span>
                    )}
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
                  </Box>
                  <PlusOpt
                    device={device}
                    position={position}
                    t={t}
                    setRemoving={setRemoving}
                  />
                </CardMedia>

                <InfoCar device={device} classes={classes} />
                <TabsDevice device={device} position={position} t={t} />
              </Box>
            )}
          </Card>
        </Zoom>
      </Box>
      {device && (
        <RemoveDialog
          open={removing}
          endpoint="devices"
          itemId={device.id}
          onResult={(removed) => handleRemove(removed)}
        />
      )}
    </>
  );
};

export default StatusCard;
