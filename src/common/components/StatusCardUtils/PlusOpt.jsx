import * as React from "react";
import { Menu, MenuItem, Box, Typography } from "@mui/material";
import {
  faClockRotateLeft,
  faEarthAmericas,
  faEllipsis,
  faMapLocationDot,
  faPen,
  faRoute,
  faShareNodes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DynamicIconsComponent } from "../DynamicIcons";
import { useNavigate } from "react-router-dom";
import { useCatchCallback } from "../../../reactHelper";
import { useSelector } from "react-redux";

const styleRow = { display: "flex", gap: ".5rem" };

const PlusOpt = ({ device, position, t, setRemoving, setSpeedRoutes, }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const colorForAll = "#878787";
  const shareDisabled = useSelector(
    (state) => state.session.server.attributes.disableShare
  );
  const user = useSelector((state) => state.session.user);

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
        cursor: "pointer",
        borderRadius: ".4rem",
        overflow: "hidden",
        boxShadow: "0 0 .5rem 0 rgba(0,0,0,.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: ".2rem",
          backgroundColor: "white",
          "&:hover": { backgroundColor: "#E0E0E0", transition: "background-color .3s" },
        }}
        onClick={handleEventIcon}
        open={open}
      >
        <FontAwesomeIcon
          icon={faEllipsis}
          size="lg"
          color={`${colorForAll}`}
          style={{ padding: "0 .4rem" }}
        />
        <Box
          component={"div"}
          sx={{
            backgroundColor: `${colorForAll}`,
            padding: ".4rem",
            color: "white",
            fontWeight: "500",
            fontSize: ".85rem",
            height: "100% !important",
          }}
        >
          Opções
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          sx={styleRow}
          onClick={() => navigate(`/settings/device/${device.id}`)}
        >
          <FontAwesomeIcon icon={faPen} size="lg" color={`${colorForAll}`} />
          <Typography>Editar veículo</Typography>
        </MenuItem>
        <MenuItem
          sx={styleRow}
          onClick={() => {
            setSpeedRoutes((speedRoutes)=> !speedRoutes) 
            handleClose()}
          }
        >
          <FontAwesomeIcon icon={faRoute} size="lg" color={`${colorForAll}`} />
          <Typography>Alterar cor das rotas</Typography>
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
                  color={`${colorForAll}`}
                />
                <Typography>Compartilhar localização</Typography>
              </MenuItem>
            )}

            <MenuItem sx={styleRow}>
              <DynamicIconsComponent
                category={"bellRing"}
                style={{ width: "20px", color: `${colorForAll}` }}
              />
              <Typography>Avise-me quando ligar</Typography>
            </MenuItem>

            <MenuItem sx={styleRow} onClick={() => navigate("/replay")}>
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                size="lg"
                color={`${colorForAll}`}
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
                color={`${colorForAll}`}
              />
              <Typography>Ver no Google Maps</Typography>
            </MenuItem>

            <MenuItem sx={styleRow} onClick={handleGeofence}>
              <FontAwesomeIcon
                icon={faEarthAmericas}
                size="lg"
                color={`${colorForAll}`}
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
