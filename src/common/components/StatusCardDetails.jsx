import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import makeStyles from "@mui/styles/makeStyles";
import usePositionAttributes from "../attributes/usePositionAttributes";
import { useAttributePreference } from "../util/preferences";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SignpostRoundedIcon from "@mui/icons-material/SignpostRounded";
import CropFreeRoundedIcon from "@mui/icons-material/CropFreeRounded";
import MapIcon from "@mui/icons-material/Map";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import PositionValue from "./PositionValue";
import { Typography, TableRow, TableCell, Link } from "@mui/material";
import AddressValue from "./AddressValue";
import { useTranslation } from "./LocalizationProvider";

const useStyles = makeStyles((theme) => ({
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  details: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
}));

const getIcon = (name) => {
  switch (name) {
    case "fixTime":
      return (
        <AccessTimeFilledRoundedIcon
          style={{ fill: "#753F32" }}
          width={22}
          height={22}
        />
      );
    case "address":
      return (
        <LocationOnRoundedIcon style={{ fill: "red" }} width={22} height={22} />
      );
    case "speed":
      return (
        <SpeedRoundedIcon style={{ fill: "#283639" }} width={22} height={22} />
      );
    case "totalDistance":
      return <MapIcon style={{ fill: "brown" }} width={22} height={22} />;
    case "course":
      return (
        <SignpostRoundedIcon style={{ fill: "blue" }} width={22} height={22} />
      );
    case "id":
      return (
        <CropFreeRoundedIcon
          style={{ fill: "orange" }}
          width={22}
          height={22}
        />
      );
    case "motion":
      return (
        <SpeedRoundedIcon style={{ fill: "green" }} width={22} height={22} />
      );
    case "batteryLevel":
      return (
        <BatteryChargingFullRoundedIcon
          style={{ fill: "#005C53" }}
          width={22}
          height={22}
        />
      );
    case "ignition":
      return (
        <PowerSettingsNewRoundedIcon
          style={{ fill: "#042940" }}
          width={22}
          height={22}
        />
      );
    default:
      return "";
  }
};

const StatusRow = ({ position, keys, positionAttributes }) => {
  const classes = useStyles();

  if(keys == "address") return null;
  
  return (
    <div>
      <div>
        <Typography
          variant="body2"
          style={{ display: "flex", gap: ".3rem", alignItems: "center" }}
        >
          {getIcon(keys)}
          {positionAttributes[keys].name}
        </Typography>

        <PositionValue
            position={position}
            property={position.hasOwnProperty(keys) ? keys : null}
            attribute={position.hasOwnProperty(keys) ? null : keys}
        />
      </div>
    </div>
  );
};

const StatusCardDetails = ({ position }) => {
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference(
    "positionItems",
    "fixTime,speed,totalDistance"
  );
  const classes = useStyles();

  return (
    <div className={classes.cardDetails}>
      <div>
        <h4>Endereço atual:</h4>
        <AddressValue
          latitude={position.latitude}
          longitude={position.longitude}
          originalAddress={position.address}
        />
      </div>

      <div className={classes.details}>
        {positionItems
          .split(",")
          .filter(
            (key) =>
              position.hasOwnProperty(key) ||
              position.attributes.hasOwnProperty(key)
          )
          .map((key) => (
            <StatusRow key={key} keys={key} position={position} positionAttributes={positionAttributes}/>
          ))}
      </div>

      <Link component={RouterLink} to={`/position/${position.id}`}>
        {t("sharedShowDetails")}
      </Link>
    </div>
  );
};

export default StatusCardDetails;
