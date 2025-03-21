import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Card,
  Typography,
  Menu,
  MenuItem,
  CardMedia,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "./LocalizationProvider";
import RemoveDialog from "./RemoveDialog";
import { devicesActions } from "../../store";
import { useCatch, useCatchCallback } from "../../reactHelper";
import { useAttributePreference } from "../util/preferences";
import StatusCardDetails from "./StatusCardDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import InfoCar from "./InfoCar";
import AddressComponent from "./AddressComponent";

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
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    height: "18px",
    width: "18px",
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
    zIndex: 100,
    left: "0",
    top: "0",
    height: "100vh",
    width: "38vw",
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

const StatusCard = ({ deviceId, position, onClose, disableActions }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.down("md"));
  const [axisY, setAxisY] = useState(0);

  const shareDisabled = useSelector(
    (state) => state.session.server.attributes.disableShare
  );
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const navigationAppLink = useAttributePreference("navigationAppLink");
  const navigationAppTitle = useAttributePreference("navigationAppTitle");

  const [anchorEl, setAnchorEl] = useState(null);

  const [removing, setRemoving] = useState(false);

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

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t("sharedGeofence"),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetch("/api/geofences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      const item = await response.json();
      const permissionResponse = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: position.deviceId,
          geofenceId: item.id,
        }),
      });
      if (!permissionResponse.ok) {
        throw Error(await permissionResponse.text());
      }
      navigate(`/settings/geofence/${item.id}`);
    } else {
      throw Error(await response.text());
    }
  }, [navigate, position]);

  return (
    <>
      <div
        className={classes.root}
        style={desktop ? {} : { top: "0" }}
        onWheel={desktop ? handleWheel : null}
        onTouchMove={(e) => handleTouch(e, axisY, setAxisY)}
      >
        {device && (
          <Card elevation={3} className={classes.card}>
            <Box className={classes.contentCardTop}>
              <CardMedia
                className={classes.media}
                image={
                  deviceImage
                    ? `/api/media/${device.uniqueId}/${deviceImage}`
                    : ""
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
              </CardMedia>
              
              <InfoCar device={device} classes={classes}/>
              {position && (
                <Box style={{padding: '0 .5rem'}}>
                  <AddressComponent position={position} t={t}/>
                  <StatusCardDetails position={position} device={device} />
                </Box>
              )}
            </Box>
            {/* <CardActions classes={{ root: classes.actions }} disableSpacing>
              <Tooltip title={t("sharedExtra")}>
                <IconButton
                  color="secondary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  disabled={!position}
                >
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    size="sm"
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      padding: "4px",
                      color: "white",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("reportReplay")}>
                <IconButton
                  onClick={() => navigate("/replay")}
                  disabled={disableActions || !position}
                >
                  <FontAwesomeIcon icon={faRotateLeft} size="sm" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("commandTitle")}>
                <IconButton
                  onClick={() =>
                    navigate(`/settings/device/${deviceId}/command`)
                  }
                  disabled={disableActions}
                >
                  <FontAwesomeIcon icon={faArrowUpFromBracket} size="sm" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("sharedEdit")}>
                <IconButton
                  onClick={() => navigate(`/settings/device/${deviceId}`)}
                  disabled={disableActions || deviceReadonly}
                >
                  <FontAwesomeIcon icon={faPen} size="sm" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("sharedRemove")}>
                <IconButton
                  color="error"
                  onClick={() => setRemoving(true)}
                  disabled={disableActions || deviceReadonly}
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </IconButton>
              </Tooltip>
            </CardActions> */}
          </Card>
        )}
      </div>
      {/* {position && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleGeofence}>
            {t("sharedCreateGeofence")}
          </MenuItem>
          <MenuItem
            component="a"
            target="_blank"
            href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}
          >
            {t("linkGoogleMaps")}
          </MenuItem>
          {navigationAppTitle && (
            <MenuItem
              component="a"
              target="_blank"
              href={navigationAppLink
                .replace("{latitude}", position.latitude)
                .replace("{longitude}", position.longitude)}
            >
              {navigationAppTitle}
            </MenuItem>
          )}
          {!shareDisabled && !user.temporary && (
            <MenuItem
              onClick={() => navigate(`/settings/device/${deviceId}/share`)}
            >
              <Typography color="secondary">{t("deviceShare")}</Typography>
            </MenuItem>
          )}
        </Menu>
      )} */}
      {/* <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      /> */}
    </>
  );
};

export default StatusCard;
