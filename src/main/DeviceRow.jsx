import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  IconButton,
  Tooltip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import Battery60Icon from '@mui/icons-material/Battery60';
import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
import Battery20Icon from '@mui/icons-material/Battery20';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import ErrorIcon from '@mui/icons-material/Error';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import { devicesActions } from '../store';
import {
  formatAlarm,
  formatBoolean,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import { useAttributePreference } from '../common/util/preferences';

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: "28px",
    height: "28px",
    filter: "brightness(0) invert(1)",
    padding: '4px',
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
    fill: theme.palette.error.main
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
  attention: {
    color: theme.palette.warning.light,
  },
}));

const DeviceRow = ({ device }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

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
      onClick={() => dispatch(devicesActions.selectId(device.id))}
      disabled={!admin && device.disabled}
    >
      <ListItemAvatar>
        <Avatar style={devices && position ? { backgroundColor: `${devices[position.deviceId].subColor}` } : {}}>
          <img
            className={classes.icon}
            src={mapIcons[mapIconKey(device.category)]}
            alt=""
          />
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
                <SpeedRoundedIcon width={22} height={22} className={classes.success}/>
              </IconButton>
            </Tooltip>
          )}
          {position.attributes.hasOwnProperty("alarm") && (
            <Tooltip title={`${t("eventAlarm")}: ${formatAlarm(position.attributes.alarm, t)}`}>
              <IconButton size="small">
                <ErrorIcon fontSize="small" className={classes.error} />
              </IconButton>
            </Tooltip>
          )}
          {position.attributes.hasOwnProperty("ignition") && (
            <Tooltip title={`${t("positionIgnition")}: ${formatBoolean(position.attributes.ignition, t)}`}>
              <IconButton size="small">
                {position.attributes.ignition ? (
                  <PowerSettingsNewRoundedIcon width={22} height={22} className={classes.success} />
                ) : (
                  <PowerSettingsNewRoundedIcon width={22} height={22} className={classes.error} />
                )}
              </IconButton>
            </Tooltip>
          )}
          {position.attributes.hasOwnProperty("batteryLevel") && (
            <Tooltip title={`${t("positionBatteryLevel")}: ${formatPercentage(position.attributes.batteryLevel)}`}>
              <IconButton size="small">
                {position.attributes.batteryLevel > 70 ? (
                  position.attributes.charge ? (
                    <BatteryChargingFullIcon fontSize="small" className={classes.success} />
                  ) : (
                    <BatteryFullIcon fontSize="small" className={classes.success} />
                  )
                ) : position.attributes.batteryLevel > 30 ? (
                  position.attributes.charge ? (
                    <BatteryCharging60Icon fontSize="small" className={classes.warning} />
                  ) : (
                    <Battery60Icon fontSize="small" className={classes.warning} />
                  )
                ) : position.attributes.charge ? (
                  <BatteryCharging20Icon fontSize="small" className={classes.error} />
                ) : (
                  <Battery20Icon fontSize="small" className={classes.error} />
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

