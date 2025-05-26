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
  const selectedId = useSelector((state) => state.devices.selectedId);

  const activeNotification = useCatch(async (type) => {
    const response = await fetch(`/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedId,
        type,
        always: true,
        notificators: "web",
        calendarId: 0,
        attributes: {},
      }),
    });
    if (response.ok) {
      const json = await response.json();
      const responsePermission = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: selectedId,
          notificationId: json.id,
        }),
      });

      if (!responsePermission.ok) {
        const errorText = await responsePermission.text();
        throw new Error(
          errorText || `Erro na permissão: ${responsePermission.status}`
        );
      }
    } else {
      throw Error(await response.text());
    }
  });

  const handleLink = useCatch(async () => {
    setModalSelectDriver(false);
    try {
      const selectedDriver = drivers[driverSelect];
      if (!selectedDriver || !device) return;

      const responsePermission = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: device.id,
          driverId: selectedDriver.id,
        }),
      });

      if (!responsePermission.ok) {
        const errorText = await responsePermission.text();
        throw new Error(
          errorText || `Erro na permissão: ${responsePermission.status}`
        );
      }

      const responseUpdate = await fetch(`/api/devices/${device.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...device,
          attributes: {
            ...(device.attributes || {}),
            driverUniqueId: Number(selectedDriver.uniqueId),
          },
        }),
      });

      if (!responseUpdate.ok) {
        const errorText = await responseUpdate.text();
        throw new Error(
          errorText || `Erro ao atualizar device: ${responseUpdate.status}`
        );
      }
      handleUpdateDevice();
    } catch (error) {
      console.error("Erro ao associar motorista:", error);
      throw error;
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
        <MenuItem
          sx={styleRow}
          onClick={() => activeNotification("ignitionOn")}
        >
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando ligar</Typography>
        </MenuItem>
        <MenuItem
          sx={styleRow}
          onClick={() => activeNotification("ignitionOff")}
        >
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando desligar</Typography>
        </MenuItem>
        <MenuItem
          sx={styleRow}
          onClick={() => activeNotification("deviceMoving")}
        >
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando estiver em movimento</Typography>
        </MenuItem>
        <MenuItem
          sx={styleRow}
          onClick={() => activeNotification("deviceStopped")}
        >
          <FontAwesomeIcon
            icon={faBellRegular}
            style={{ height: "22px", width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando estiver parado</Typography>
        </MenuItem>
        <MenuItem
          sx={styleRow}
          onClick={() => activeNotification("geofenceEnter")}
        >
          <DynamicIconsComponent
            category={"bellRing"}
            style={{ width: "20px" }}
            color={`${color}`}
          />
          <Typography>Avise-me quando entrar na cerca virtual</Typography>
        </MenuItem>
        <MenuItem
          sx={styleRow}
          onClick={() => activeNotification("geofenceExit")}
        >
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
