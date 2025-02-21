import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  CardMedia,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import PublishIcon from "@mui/icons-material/Publish";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PendingIcon from "@mui/icons-material/Pending";
import { useTranslation } from "./LocalizationProvider";
import RemoveDialog from "./RemoveDialog";
import { useDeviceReadonly } from "../util/permissions";
import { devicesActions } from "../../store";
import { useCatch, useCatchCallback } from "../../reactHelper";
import { useAttributePreference } from "../util/preferences";
import StatusCardDetails from "./StatusCardDetails";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";

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
  ignitionState: {
    position: "absolute",
    left: "6px",
    top: "6px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    gap: ".3rem",
    backgroundColor: "transparent",
    borderRadius: ".5rem",
    boxShadow: "none",
    "& p": {
      fontWeight: "500",
      fontSize: ".9rem",
    },
  },
  media: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    maxHeight: "35vh",
    height: "100%",
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
  mediaButton: {
    color: theme.palette.primary.contrastText,
    mixBlendMode: "difference",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    maxHeight: "35vh",
    height: "100%",
    padding: theme.spacing(1, 1, 0, 2),
    backgroundColor: "#e9e9e9",
    fontSize: "1.4rem",
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
  },
  root: () => ({
    pointerEvents: "none",
    position: "fixed",
    zIndex: 100,
    left: "0",
    top: "0",
    height: "100vh",
    width: "38vw",
    maxWidth: "550px",
    transition: ".3s",
    [theme.breakpoints.down("md")]: {
      top: "40vh",
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
        <PowerSettingsNewRoundedIcon width={18} height={18} />
        <Typography>Ligado</Typography>
      </Card>
    );

  return (
    <Card className={`${classes.ignitionState} ${classes.red}`}>
      <PowerSettingsNewRoundedIcon width={18} height={18} />
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

  const deviceReadonly = useDeviceReadonly();

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
        onTouchMove={(e)=> handleTouch(e, axisY, setAxisY)}
      >
        {device && (
          <Card elevation={3} className={classes.card}>
            <div style={{ maxHeight: "100%" }}>
              {deviceImage ? (
                <CardMedia
                  className={classes.media}
                  image={`/api/media/${device.uniqueId}/${deviceImage}`}
                >
                  {position && (
                    <IgnitionState position={position} classes={classes} />
                  )}
                  <IconButton
                    size="medium"
                    onClick={onClose}
                    onTouchStart={onClose}
                  >
                    <CloseIcon
                      fontSize="medium"
                      className={classes.mediaButton}
                    />
                  </IconButton>
                </CardMedia>
              ) : (
                <div className={classes.header}>
                  {position && (
                    <IgnitionState position={position} classes={classes} />
                  )}
                  <IconButton
                    size="medium"
                    onClick={onClose}
                    onTouchStart={onClose}
                  >
                    <CloseIcon
                      fontSize="medium"
                      className={classes.mediaButton}
                    />
                  </IconButton>
                </div>
              )}
              {position && (
                <CardContent className={classes.content}>
                  <StatusCardDetails position={position} device={device} />
                </CardContent>
              )}
            </div>
            <CardActions classes={{ root: classes.actions }} disableSpacing>
              <Tooltip title={t("sharedExtra")}>
                <IconButton
                  color="secondary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  disabled={!position}
                >
                  <PendingIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("reportReplay")}>
                <IconButton
                  onClick={() => navigate("/replay")}
                  disabled={disableActions || !position}
                >
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("commandTitle")}>
                <IconButton
                  onClick={() =>
                    navigate(`/settings/device/${deviceId}/command`)
                  }
                  disabled={disableActions}
                >
                  <PublishIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("sharedEdit")}>
                <IconButton
                  onClick={() => navigate(`/settings/device/${deviceId}`)}
                  disabled={disableActions || deviceReadonly}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("sharedRemove")}>
                <IconButton
                  color="error"
                  onClick={() => setRemoving(true)}
                  disabled={disableActions || deviceReadonly}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        )}
      </div>
      {position && (
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
      )}
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
