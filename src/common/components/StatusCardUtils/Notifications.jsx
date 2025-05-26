import { faBell, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { DynamicIconsComponent } from "../DynamicIcons";
import { useCatch } from "../../../reactHelper";
import { useDispatch, useSelector } from "react-redux";

const Notifications = ({ color, styleRow }) => {
  const [arrowNotification, setArrowNotification] = useState(false);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const openNotifications = Boolean(anchorElNotification);

  const dispatch = useDispatch();
  const selectedId = useSelector((state)=> state.devices.selectedId);

  const activeNotification = useCatch(async (type) => {
    const response = await fetch(`/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedId,
        type,
        always: true,
        notificators: 'web',
        calendarId: 0,
        attributes: {},
      }),
    });
    if (response.ok) {
      const json = await response.json();
      console.log(json)
    } else {
      throw Error(await response.text());
    }
  });

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
        <MenuItem sx={styleRow} onClick={()=> activeNotification("ignitionOn")}>
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando ligar</Typography>
        </MenuItem>
        <MenuItem sx={styleRow} onClick={()=> activeNotification("ignitionOff")}>
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando desligar</Typography>
        </MenuItem>
        <MenuItem sx={styleRow} onClick={()=> activeNotification("deviceMoving")}>
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando estiver em movimento</Typography>
        </MenuItem>
        <MenuItem sx={styleRow} onClick={()=> activeNotification("deviceStopped")}>
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando estiver parado</Typography>
        </MenuItem>
        <MenuItem sx={styleRow} onClick={()=> activeNotification("geofenceEnter")}>
          <DynamicIconsComponent
            category={"bellRing"}
            style={{ width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando entrar na cerca virtual</Typography>
        </MenuItem>
        <MenuItem sx={styleRow} onClick={()=> activeNotification("geofenceExit")}>
          <DynamicIconsComponent
            category={"bellRing"}
            style={{ width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando sair da cerca virtual</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Notifications;
