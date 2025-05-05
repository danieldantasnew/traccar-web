import React from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import {
  IconButton,
  Tooltip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import Battery60Icon from "@mui/icons-material/Battery60";
import BatteryCharging60Icon from "@mui/icons-material/BatteryCharging60";
import Battery20Icon from "@mui/icons-material/Battery20";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { devicesActions } from "../store";
import {
  formatAlarm,
  formatBoolean,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import { mapIconKey, mapIcons } from "../map/core/preloadImages";
import { useAdministrator } from "../common/util/permissions";
import { useAttributePreference } from "../common/util/preferences";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faCircleExclamation,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { DynamicIconsComponent } from "../common/components/DynamicIcons";

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: "28px",
    height: "28px",
    filter: "brightness(0) invert(1)",
    padding: "4px",
  },
  batteryText: {
    fontSize: "0.75rem",
    fontWeight: "normal",
    lineHeight: "0.875rem",
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
    fill: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
  attention: {
    color: theme.palette.warning.light,
  },
}));

const DeviceRow = ({ device, setStatusCardOpen, setDevicesOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();
  const colors = device.attributes["web.reportColor"]
    ? device.attributes["web.reportColor"].split(";")
    : ["rgb(189, 12, 18)", "white", "rgb(255, 0, 8)"];
  const admin = useAdministrator();

  const position = useSelector((state) => state.session.positions[device.id]);
  const devices = useSelector((state) => state.devices.items);

  const devicePrimary = useAttributePreference("devicePrimary", "name");
  const deviceSecondary = useAttributePreference("deviceSecondary", "");

  const secondaryText = () => {
    let status;
    if (device.status === "online" || !device.lastUpdate) {
      status = formatStatus(device.status, t);
    } else {
      status = dayjs(device.lastUpdate).fromNow();
    }
    return (
      <>
        {deviceSecondary &&
          device[deviceSecondary] &&
          `${device[deviceSecondary]} • `}
        <span className={classes[getStatusColor(device.status)]}>{status}</span>
      </>
    );
  };

  return (
    <ListItemButton
      key={device.id}
      onClick={() => {
        dispatch(devicesActions.selectId(device.id));
        setStatusCardOpen(true);
        setDevicesOpen(false);
      }}
      disabled={!admin && device.disabled}
    >
      <ListItemAvatar>
        <Avatar
          style={
            devices && position
              ? { backgroundColor: colors[0], color: colors[1] }
              : {}
          }
        >
          <DynamicIconsComponent category={device.category} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={device[devicePrimary]}
        primaryTypographyProps={{ noWrap: true }}
        secondary={secondaryText()}
        secondaryTypographyProps={{ noWrap: true }}
      />
      {position && (
        <>
          {position.attributes.motion && (
            <Tooltip title="Em movimento">
              <IconButton size="small">
                <FontAwesomeIcon icon={faGaugeHigh} color="#455cdb" />
              </IconButton>
            </Tooltip>
          )}
          {position.attributes.hasOwnProperty("alarm") && (
            <Tooltip
              title={`${t("eventAlarm")}: ${formatAlarm(
                position.attributes.alarm,
                t
              )}`}
            >
              <IconButton size="small">
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className={classes.error}
                />
              </IconButton>
            </Tooltip>
          )}
          {position.attributes.hasOwnProperty("batteryLevel") && (
            <Tooltip
              title={`${t("positionBatteryLevel")}: ${formatPercentage(
                position.attributes.batteryLevel
              )}`}
            >
              <IconButton size="small">
                {position.attributes.batteryLevel > 70 ? (
                  position.attributes.charge ? (
                    <DynamicIconsComponent
                      category={"batteryBolt"}
                      className={classes.success}
                      style={{width: '20px', height: '20px'}}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBatteryFull}
                      className={classes.success}
                    />
                  )
                ) : position.attributes.batteryLevel > 50 ? (
                  position.attributes.charge ? (
                    <DynamicIconsComponent
                      category={"batteryBolt"}
                      className={classes.success}
                      style={{width: '20px', height: '20px'}}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBatteryThreeQuarters}
                      className={classes.success}
                    />
                  )
                ) : position.attributes.batteryLevel > 30 ? (
                  position.attributes.charge ? (
                    <DynamicIconsComponent
                      category={"batteryBolt"}
                      className={classes.warning}
                      style={{width: '20px', height: '20px'}}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBatteryHalf}
                      className={classes.warning}
                    />
                  )
                ) : position.attributes.charge ? (
                  <DynamicIconsComponent
                    category={"batteryBolt"}
                    className={classes.error}
                    style={{width: '20px', height: '20px'}}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faBatteryQuarter}
                    className={classes.error}
                  />
                )}
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </ListItemButton>
  );
};

export default DeviceRow;
