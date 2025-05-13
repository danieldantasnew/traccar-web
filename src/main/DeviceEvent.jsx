import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { DynamicIconsComponent } from "../common/components/DynamicIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { formatNotificationTitle, formatTime } from "../common/util/formatter";
import { eventsActions } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeviceEvent = ({ classes, event, t, colorIcon, reads, unreads }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const devices = useSelector((state) => state.devices.items);
  const { background, icon } = devices[event.deviceId]?.attributes
  ?.deviceColors || { background: "#f1f1f1", icon: "#000" };
  
  const isRead = reads.some((r) => r.id === event.id);
  const isUnread = unreads.some((unread) => unread.id === event.id);
  
  const [anchorElPerItem, setAnchorElPerItem] = useState({});
  const openMenuItemEvents = (eventId) => Boolean(anchorElPerItem[eventId]);
  const handleOpenItemMenu = (e, eventId) => {
    e.stopPropagation();
    setAnchorElPerItem((prev) => ({ ...prev, [eventId]: e.currentTarget }));
  };

  const handleCloseItemMenu = (eventId) => {
    setAnchorElPerItem((prev) => ({ ...prev, [eventId]: null }));
  };

  const formatType = (event) =>
    formatNotificationTitle(t, {
      type: event.type,
      attributes: {
        alarms: event.attributes.alarm,
      },
    });

  const readNotification = (notification) => {
    dispatch(eventsActions.addReads(notification));
    dispatch(eventsActions.removeUnread(notification));
  };

  const unReadNotification = (notification) => {
    dispatch(eventsActions.mergeUnreads([notification]));
    dispatch(eventsActions.removeRead(notification));
  };

  const eventTitle = useMemo(() => formatType(event), [event]);

  return (
    <Box
      onClick={() => {
        navigate(`/event/${event.id}`);
        readNotification(event);
      }}
      className={`${classes.flexRow} ${classes.device} ${
        isUnread ? classes.unreadEvent : ""
      }`}
    >
      <Box className={classes.flexRow}>
        <Box>
          <Avatar style={{ backgroundColor: background, color: icon }}>
            <DynamicIconsComponent
              category={devices[event.deviceId]?.category}
            />
          </Avatar>
        </Box>
        <Box className={classes.flexColumn}>
          <Box className={classes.flexRow}>
            <Typography
              title={devices[event.deviceId]?.name}
              className={classes.deviceName}
            >
              {devices[event.deviceId]?.name}
            </Typography>
            <Typography className={classes.circle}></Typography>
            <Typography title={eventTitle} className={classes.eventType}>
              {eventTitle}
            </Typography>
          </Box>
          <Typography>{formatTime(event.eventTime, "seconds")}</Typography>
        </Box>
      </Box>
      <IconButton size="small" onClick={(e) => handleOpenItemMenu(e, event.id)}>
        <FontAwesomeIcon icon={faEllipsis} color={colorIcon} />
      </IconButton>
      <Menu
        anchorEl={anchorElPerItem[event.id] || null}
        open={openMenuItemEvents(event.id)}
        onClose={(e) => {
          e.stopPropagation();
          handleCloseItemMenu(event.id);
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleCloseItemMenu(event.id);
            isRead ? unReadNotification(event) : readNotification(event);
          }}
          className={classes.flexRow}
        >
          <Box sx={{ padding: "2px" }}>
            <DynamicIconsComponent category={"doubleCheck"} color={colorIcon} />
          </Box>
          <Typography>
            {isRead ? "Marcar como não lida" : "Marcar como lida"}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleCloseItemMenu(event.id);
            dispatch(eventsActions.delete(event));
          }}
          className={classes.flexRow}
        >
          <Box sx={{ padding: "2px 7.5px 2px 6px" }}>
            <FontAwesomeIcon icon={faTrashCan} color={colorIcon} />
          </Box>
          <Typography>Excluir notificação</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DeviceEvent;
