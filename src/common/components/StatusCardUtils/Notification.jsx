import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useCatch } from "../../../reactHelper";
import { MenuItem, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Notification = ({ label, color, styleRow, notificationType }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.devices.selectedId);

  const activeNotification = useCatch(async (type) => {
    const response = await fetch(`/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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

  const removeNotification = useCatch(async (notificationId) => {
    const response = await fetch("/api/permissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: selectedId,
        notificationId,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  });

  return (
    <MenuItem sx={styleRow} onClick={() => activeNotification(notificationType)}>
      <FontAwesomeIcon
        icon={faBellRegular}
        style={{ height: "22px", width: "20px" }}
        color={`${color}`}
      />
      <Typography>{label}</Typography>
    </MenuItem>
  );
};

export default Notification;
