import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatNotificationTitle, formatTime } from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import { eventsActions } from "../store";
import { faEllipsis, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DynamicIconsComponent } from "../common/components/DynamicIcons";

const useStyles = makeStyles((theme) => ({
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  flexRow: {
    display: "flex",
    alignItems: "center",
    gap: ".35rem",
  },

  drawer: {
    width: "100%",
  },

  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    minWidth: "24rem",
  },

  device: {
    justifyContent: "space-between",
    padding: `.5rem ${theme.spacing(2)}`,
    borderBottom: "1px solid rgba(0,0,0,.12)",
    width: "100%",
    "&:hover": {
      backgroundColor: "rgb(231, 231, 231)",
      cursor: "pointer",
      transition: ".2s",
    },
  },

  deviceName: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "140px",
  },

  circle: {
    content: "''",
    height: "4px",
    width: "4px",
    display: "inline-block",
    borderRadius: "50%",
    backgroundColor: "#85898E",
  },

  eventType: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "120px",
  },

  unreadEvent: {
    backgroundColor: "rgb(248, 248, 248)",
  }
}));

const EventsDrawer = ({ open, onClose }) => {
  const classes = useStyles();
  const colorIcon = "#85898E";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const reads = useSelector((state) => state.events.reads);
  const unreads = useSelector((state) => state.events.unreads);
  const devices = useSelector((state) => state.devices.items);
  const events = useSelector((state) => state.events.items);

  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElPerItem, setAnchorElPerItem] = useState({});

  const openMenuEvents = Boolean(anchorElMenu);
  const openMenuItemEvents = (eventId) => Boolean(anchorElPerItem[eventId]);

  const handleClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  const handleOpenItemMenu = (event, eventId) => {
    event.stopPropagation();
    setAnchorElPerItem((prev) => ({ ...prev, [eventId]: event.currentTarget }));
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

  useEffect(() => {
    if (events.length > 0) {
      dispatch(eventsActions.mergeUnreads(events));
    }
  }, [events]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} className={classes.content}>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "400",
          }}
        >
          Notificações
        </Typography>
        <IconButton size="small" color="inherit" onClick={handleClick}>
          <FontAwesomeIcon icon={faEllipsis} color={colorIcon} />
        </IconButton>
        <Menu
          anchorEl={anchorElMenu}
          open={openMenuEvents}
          onClose={handleClose}
        >
          <MenuItem
            onClick={(e) => {
              handleClose(e);
              dispatch(eventsActions.markAllAsRead());
            }}
            className={classes.flexRow}
          >
            <Box sx={{ padding: "2px" }}>
              <DynamicIconsComponent
                category={"doubleCheck"}
                color={colorIcon}
              />
            </Box>
            <Typography>Marcar todas como lida</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/settings/notifications")}
            className={classes.flexRow}
          >
            <Box sx={{ padding: "2px" }}>
              <DynamicIconsComponent
                category={"gearRegular"}
                color={colorIcon}
              />
            </Box>
            <Typography>Configurações de notificação</Typography>
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              dispatch(eventsActions.deleteAll());
              handleClose(e);
            }}
            className={classes.flexRow}
          >
            <Box sx={{ padding: "2px 7.5px 2px 6px" }}>
              <FontAwesomeIcon icon={faTrashCan} color={colorIcon} />
            </Box>
            <Typography>Excluir todas as notificações</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
      {Array.isArray(events) && events.length > 0 ? (
        <Box
          component={"section"}
          className={`${classes.drawer} ${classes.flexColumn}`}
        >
          {events.map((event) => {
            const { background, icon } = devices[event.deviceId]?.attributes
              ?.deviceColors || { background: "#f1f1f1", icon: "#000" };
            const isUnread = unreads.some((unread)=> unread.id === event.id);

            return (
              <Box
                key={event.id}
                onClick={() => {
                  navigate(`/event/${event.id}`);
                  readNotification(event);
                }}
                className={`${classes.flexRow} ${classes.device} ${isUnread ? classes.unreadEvent : ''}`}
              >
                <Box className={classes.flexRow}>
                  <Box>
                    <Avatar
                      style={{ backgroundColor: background, color: icon }}
                    >
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
                      <Typography
                        title={formatType(event)}
                        className={classes.eventType}
                      >
                        {formatType(event)}
                      </Typography>
                    </Box>
                    <Typography>
                      {formatTime(event.eventTime, "seconds")}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleOpenItemMenu(e, event.id)}
                >
                  <FontAwesomeIcon icon={faEllipsis} color={colorIcon} />
                </IconButton>
                <Menu
                  anchorEl={anchorElPerItem[event.id] || null}
                  open={openMenuItemEvents(event.id)}
                  onClose={(e) => {
                    e.stopPropagation();
                    handleCloseItemMenu(event.id)
                  }}
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseItemMenu(event.id);
                      dispatch(eventsActions.addReads(event));
                      dispatch(eventsActions.removeUnread(event));
                    }}
                    className={classes.flexRow}
                  >
                    <Box sx={{ padding: "2px" }}>
                      <DynamicIconsComponent
                        category={"doubleCheck"}
                        color={colorIcon}
                      />
                    </Box>
                    <Typography>Marcar como lida</Typography>
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
          })}
        </Box>
      ) : (
        <Typography
          sx={{ textAlign: "center", marginTop: "1rem", fontSize: "1.1rem" }}
        >
          Sem notificações
        </Typography>
      )}
    </Drawer>
  );
};

export default EventsDrawer;
