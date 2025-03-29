import { Box, Tooltip } from "@mui/material";
import React from "react";
import { map } from "../../map/core/MapView";
import { useAttributePreference } from "../util/preferences";
import dimensions from "../theme/dimensions.js";
import { useDispatch, useSelector } from "react-redux";
import { devicesActions } from "../../store";
import { faEyeSlash, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColorsDevice from "./ColorsDevice.js";

const styleBox = {
  position: "fixed",
  zIndex: 8,
  right: 10,
  top: "17.5rem",
  display: "flex",
  flexDirection: "column",
  gap: ".5rem",
};

const controls = {
  height: "29px",
  width: "29px",
  backgroundColor: "#ffff",
  color: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  boxShadow: "0px 0px 1px 1.5px rgba(0, 0, 0, 0.1)",
  padding: "4px",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "rgb(245, 245, 245)",
  },
};

const ControllersInMap = ({  position }) => {
  const selectZoom = useAttributePreference("web.selectZoom", 10);
  const dispatch = useDispatch();
  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const centerDevice = () => {
    map.easeTo({
      center: [position.longitude, position.latitude],
      zoom: Math.max(map.getZoom(), selectZoom),
      offset: [0, -dimensions.popupMapOffset / 2],
    });
  };

  const hideRoutes = () => {
    dispatch(devicesActions.selectId(null));
  };

  if(!devices[selectedDeviceId]) return null;
  const {bgColor} = ColorsDevice(devices[selectedDeviceId].attributes['web.reportColor']);

  return (
    <Box sx={styleBox}>
      <Tooltip
        sx={controls}
        title="Centralizar dispositivo"
        placement="left"
        arrow
      >
        <Box onClick={centerDevice}>
          <FontAwesomeIcon icon={faMapPin} color={`${bgColor}`}/>
        </Box>
      </Tooltip>
      <Tooltip sx={controls} title="Ocultar rotas" placement="left" arrow>
        <Box onClick={hideRoutes}>
          <FontAwesomeIcon icon={faEyeSlash} color={`${bgColor}`} />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ControllersInMap;
