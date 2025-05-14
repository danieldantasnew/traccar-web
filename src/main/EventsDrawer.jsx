import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "../common/components/LocalizationProvider";
import { eventsActions } from "../store";
import { faEllipsis, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DynamicIconsComponent } from "../common/components/DynamicIcons";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Events from "./Events";

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
    fontWeight: "500 !important",
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
  },
}));

const EventsDrawer = ({ open, onClose }) => {
  const classes = useStyles();
  const colorIcon = "#85898E";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();
  const [valueTabs, setValueTabs] = useState("t1");
  const [allAsRead, setAllAsRead] = useState(false);

  const events = useSelector((state) => state.events.items);
  const unreads = useSelector((state) => state.events.unreads);
  const reads = useSelector((state) => state.events.reads);

  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const openMenuEvents = Boolean(anchorElMenu);

  const handleChange = (event, newValue) => {
    setValueTabs(newValue);
  };

  const handleClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  useEffect(() => {
    if (events.length > 0) {
      dispatch(eventsActions.mergeUnreads(events));
    }
  }, [events]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className={classes.content}
    >
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
              allAsRead
                ? dispatch(eventsActions.markAllAsUnread())
                : dispatch(eventsActions.markAllAsRead());
              setAllAsRead((prev) => !prev);
            }}
            className={classes.flexRow}
          >
            <Box sx={{ padding: "2px" }}>
              <DynamicIconsComponent
                category={"doubleCheck"}
                color={colorIcon}
              />
            </Box>
            <Typography>
              {allAsRead && reads.length > 0
                ? "Marcar todas como não lida"
                : "Marcar todas como lida"}
            </Typography>
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
      <TabContext value={valueTabs}>
        <Box>
          <TabList
            onChange={handleChange}
            variant="fullWidth"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#2C76AC",
                height: "3px",
              },
            }}
          >
            <Tab
              label={
                <Badge
                  badgeContent={events.length}
                  sx={{
                    "& .MuiBadge-badge": {
                      right: -12,
                      top: "50%",
                      fontSize: 9,
                      backgroundColor: `${
                        valueTabs === "t1" ? "#2C76AC" : "#E3E3E3"
                      }`,
                      color: "#ffffff",
                      minWidth: 0,
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                    },
                  }}
                >
                  Todas
                </Badge>
              }
              value="t1"
              sx={{
                color: "#E3E3E3",
                textTransform: "none",
                fontSize: "1rem",
                "&.Mui-selected": {
                  color: "#1A1A1A",
                },
              }}
            />
            <Tab
              label={
                <Badge
                  badgeContent={unreads.length}
                  sx={{
                    "& .MuiBadge-badge": {
                      right: -12,
                      top: "50%",
                      fontSize: 9,
                      backgroundColor: `${
                        valueTabs === "t2" ? "#2C76AC" : "#E3E3E3"
                      }`,
                      color: "#ffffff",
                      minWidth: 0,
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                    },
                  }}
                >
                  Não lidas
                </Badge>
              }
              value="t2"
              sx={{
                color: "#E3E3E3",
                fontSize: "1rem",
                textTransform: "none",
                "&.Mui-selected": {
                  color: "#1A1A1A",
                },
              }}
            />
            <Tab
              label={
                <Badge
                  badgeContent={reads.length}
                  sx={{
                    "& .MuiBadge-badge": {
                      right: -12,
                      top: "50%",
                      fontSize: 9,
                      backgroundColor: `${
                        valueTabs === "t3" ? "#2C76AC" : "#E3E3E3"
                      }`,
                      color: "#ffffff",
                      minWidth: 0,
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                    },
                  }}
                >
                  Lidas
                </Badge>
              }
              value="t3"
              sx={{
                color: "#E3E3E3",
                textTransform: "none",
                fontSize: "1rem",
                "&.Mui-selected": {
                  color: "#1A1A1A",
                },
              }}
            />
          </TabList>
        </Box>
        <TabPanel value="t1" sx={{ padding: 0 }}>
          <Events
            classes={classes}
            colorIcon={colorIcon}
            events={events}
            t={t}
          />
        </TabPanel>
        <TabPanel value="t2" sx={{ padding: 0 }}>
          <Events
            classes={classes}
            colorIcon={colorIcon}
            events={unreads}
            t={t}
          />
        </TabPanel>
        <TabPanel value="t3" sx={{ padding: 0 }}>
          <Events
            classes={classes}
            colorIcon={colorIcon}
            events={reads}
            t={t}
          />
        </TabPanel>
      </TabContext>
    </Drawer>
  );
};

export default EventsDrawer;
