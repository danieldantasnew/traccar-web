import * as React from "react";
import { Menu, MenuItem, IconButton, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  faClockRotateLeft,
  faEarthAmericas,
  faEllipsis,
  faEyeSlash,
  faLocationCrosshairs,
  faMapLocationDot,
  faPen,
  faShareNodes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DynamicIconsComponent } from "./DynamicIcons";
import { useNavigate } from "react-router-dom";
import { useCatchCallback } from "../../reactHelper";
import { useSelector } from "react-redux";

const RotateIconButton = styled(IconButton)(({ open }) => ({
  transform: open ? "rotate(90deg)" : "rotate(0deg)",
  transition: "transform 0.3s ease",
}));

const styleRow = { display: "flex", gap: ".5rem" };

const PlusOpt = ({ device, position, t, setRemoving }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const shareDisabled = useSelector(
    (state) => state.session.server.attributes.disableShare
  );
  const user = useSelector((state) => state.session.user);

  const attributes = device.attributes || {};
  const reportColor = attributes["web.reportColor"]
    ? attributes["web.reportColor"].split(";")
    : ["rgb(189, 12, 18)", "rgb(189, 12, 18)"];

  const bgColor = reportColor[0];
  const textColor = reportColor[1];

  const handleEventIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t("sharedGeofence"),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetch("/api/geofences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      const item = await response.json();
      const permissionResponse = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: position.deviceId,
          geofenceId: item.id,
        }),
      });
      if (!permissionResponse.ok) {
        throw Error(await permissionResponse.text());
      }
      navigate(`/settings/geofence/${item.id}`);
    } else {
      throw Error(await response.text());
    }
  }, [navigate, position]);

  return (
    <Box
      sx={{
        position: "absolute",
        right: ".5rem",
        bottom: "1rem",
        backgroundColor: bgColor,
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      <RotateIconButton
        open={open}
        onClick={handleEventIcon}
        title="Mais opções"
      >
        <FontAwesomeIcon icon={faEllipsis} size="sm" color={`${textColor}`} />
      </RotateIconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          sx={styleRow}
          onClick={() => navigate(`/settings/device/${device.id}`)}
        >
          <FontAwesomeIcon icon={faPen} size="lg" color="#6D6D6D" />
          <Typography>Editar veículo</Typography>
        </MenuItem>
        {position && (
          <>
            {!shareDisabled && !user.temporary && (
              <MenuItem
                sx={styleRow}
                onClick={() => navigate(`/settings/device/${device.id}/share`)}
              >
                <FontAwesomeIcon
                  icon={faShareNodes}
                  size="lg"
                  color="#6D6D6D"
                />
                <Typography>Compartilhar localização</Typography>
              </MenuItem>
            )}

            <MenuItem sx={styleRow}>
              <DynamicIconsComponent
                category={"bellRing"}
                style={{ width: "20px", color: "#6D6D6D" }}
              />
              <Typography>Avise-me quando ligar</Typography>
            </MenuItem>

            <MenuItem sx={styleRow}>
              <FontAwesomeIcon
                icon={faLocationCrosshairs}
                size="lg"
                color="#6D6D6D"
              />
              <Typography>Centralizar veículo</Typography>
            </MenuItem>

            <MenuItem sx={styleRow}>
              <FontAwesomeIcon icon={faEyeSlash} size="lg" color="#6D6D6D" />
              <Typography>Ocultar rota do mapa</Typography>
            </MenuItem>

            <MenuItem sx={styleRow} onClick={() => navigate("/replay")}>
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                size="lg"
                color="#6D6D6D"
              />
              <Typography>Replay</Typography>
            </MenuItem>

            <MenuItem
              sx={styleRow}
              component="a"
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}
            >
              <FontAwesomeIcon
                icon={faMapLocationDot}
                size="lg"
                color="#6D6D6D"
              />
              <Typography>Ver no Google Maps</Typography>
            </MenuItem>

            <MenuItem sx={styleRow} onClick={handleGeofence}>
              <FontAwesomeIcon
                icon={faEarthAmericas}
                size="lg"
                color="#6D6D6D"
              />
              <Typography>Criar cerca</Typography>
            </MenuItem>
          </>
        )}
        <MenuItem sx={styleRow} onClick={() => setRemoving(true)}>
          <FontAwesomeIcon icon={faTrash} color="red" size="lg" />
          <Typography>Remover veículo</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PlusOpt;
