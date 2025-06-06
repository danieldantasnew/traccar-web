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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { devicesActions } from "../store";
import {
  formatAlarm,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
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
  const attributes = device?.attributes || {};
  const { background, icon } = attributes?.deviceColors || {background: "black", icon: "red", text: "white", secondary: "blue"};
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
        setDevicesOpen(false);
        dispatch(devicesActions.selectId(device.id));
        setStatusCardOpen(true);
      }}
      disabled={!admin && device.disabled}
    >
      <ListItemAvatar>
        <Avatar
          style={
            devices && position
              ? { backgroundColor: background }
              : {}
          }
        >
          <DynamicIconsComponent category={device.category} color={icon} />
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
