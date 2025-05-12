import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
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
  flexRow: {
    display: "flex",
    alignItems: "center",
    gap: ".35rem",
  },
  drawer: {
    width: theme.dimensions.eventsDrawerWidth,
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    minWidth: "16rem",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    title: {
      flexGrow: 1,
    },
  },
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

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuEvents = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Toolbar className={classes.toolbar} disableGutters>
        <Typography variant="h6" className={classes.title}>
          Notificações
        </Typography>
        <IconButton size="small" color="inherit" onClick={handleClick}>
          <FontAwesomeIcon icon={faEllipsis} color={colorIcon} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
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
      <List className={classes.drawer} dense>
        {events.map((event) => (
          <ListItemButton
            key={event.id}
            onClick={() => {
              navigate(`/event/${event.id}`);
              readNotification(event);
            }}
            disabled={!event.id}
          >
            <ListItemText
              primary={`${devices[event.deviceId]?.name} • ${formatType(
                event
              )}`}
              secondary={formatTime(event.eventTime, "seconds")}
            />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
                dispatch(eventsActions.delete(event));
              }}
            >
              <FontAwesomeIcon icon={faEllipsis} color={colorIcon} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
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
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default EventsDrawer;
