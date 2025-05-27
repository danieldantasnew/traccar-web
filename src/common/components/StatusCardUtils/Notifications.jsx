import { faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import Notification from "./Notification";

const notifications = [
  {
    label: "Avise-me quando ligar",
    notificationType: "ignitionOn",
  },
  {
    label: "Avise-me quando desligar",
    notificationType: "ignitionOff",
  },
  {
    label: "Avise-me quando estiver em movimento",
    notificationType: "deviceMoving",
  },
  {
    label: "Avise-me quando estiver parado",
    notificationType: "deviceStopped",
  },
  {
    label: "Avise-me quando entrar na cerca virtual",
    notificationType: "geofenceEnter",
  },
  {
    label: "Avise-me quando sair da cerca virtual",
    notificationType: "geofenceExit",
  },
];

const Notifications = ({ color, styleRow }) => {
  const [arrowNotification, setArrowNotification] = useState(false);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const openNotifications = Boolean(anchorElNotification);

  return (
    <>
      <MenuItem
        sx={styleRow}
        onClick={(e) => {
          setAnchorElNotification(e.currentTarget);
          setArrowNotification(true);
        }}
      >
        <FontAwesomeIcon
          icon={faBell}
          style={{ height: "22px", width: "20px" }}
          color={`${color}`}
        />
        <Typography
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          Notificações
          <FontAwesomeIcon
            icon={faCaretDown}
            style={{
              transition: ".3s",
              transform: `${arrowNotification ? "rotate(-90deg)" : ""}`,
            }}
            color={`${color}`}
          />
        </Typography>
      </MenuItem>
      <Menu
        anchorEl={anchorElNotification}
        open={openNotifications}
        onClose={() => {
          setArrowNotification(false);
          setAnchorElNotification(null);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {notifications.map((notification, index) => (
          <Notification
            key={'n'+ index}
            label={notification.label}
            color={color}
            styleRow={styleRow}
            notificationType={notification.notificationType}
          />
        ))}
      </Menu>
    </>
  );
};

export default Notifications;
