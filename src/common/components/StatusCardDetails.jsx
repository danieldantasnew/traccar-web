import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { formatTime } from "../util/formatter";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import makeStyles from "@mui/styles/makeStyles";
import usePositionAttributes from "../attributes/usePositionAttributes";
import { useAttributePreference } from "../util/preferences";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SignpostRoundedIcon from "@mui/icons-material/SignpostRounded";
import CropFreeRoundedIcon from "@mui/icons-material/CropFreeRounded";
import MapIcon from "@mui/icons-material/Map";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import PositionValue from "./PositionValue";
import { Avatar, Link, ListItemAvatar, Typography } from "@mui/material";
import AddressValue from "./AddressValue";
import { useTranslation } from "./LocalizationProvider";
import { mapIconKey, mapIcons } from "../../map/core/preloadImages";

const useStyles = makeStyles((theme) => ({
  cardDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "& h4": {
      fontSize: ".85rem",
      fontWeight: "500",
      color: "rgb(19, 9, 4)",
      margin: ".5rem 0 .2rem 0",
    },
    "& p": {
      fontSize: "1rem",
    },
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    [theme.breakpoints.down("lg")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  fieldset: {
    borderRadius: ".5rem",
    border: "2px solid black",
    padding: "0px",
    height: "48px",
  },
  legend: {
    fontSize: ".8rem",
    fontWeight: "500",
  },
  box: {
    display: "flex",
    alignItems: "center",
    gap: ".3rem",
    justifyContent: "flex-start",
    padding: "2px 4px",
    "& svg": {
      width: "18px",
    }
  },

  value: {
    fontSize: ".8rem !important",
    fontWeight: "600",
    [theme.breakpoints.down("lg")]: {
      fontSize: ".8rem !important",
    },
  },

  infoCar: {
    justifyContent: "space-between",
    "& div:last-child": {
      textAlign: "right",
      "& h2": {
        fontSize: ".8rem",
        margin: ".3rem 0",
        color: "gray",
        fontWeight: "600",
      },
      "& p": {
        fontSize: ".9rem",
      },
    },
  },
  icon: {
    padding: ".5rem",
    filter: "brightness(0) invert(1)",
  },

  description: {
    textAlign: "left !important",
    "& p": {
      fontSize: ".9rem !important",
      color: "black",
    },
    "& p:first-child": {
      fontWeight: "600",
    },
  },
  red: {
    fill: "red",
    border: "2px solid red",
    color: "red",
  },

  brownLight: {
    fill: "#753F32",
    border: "2px solid #753F32",
    color: "#753F32",
  },

  greenDark: {
    fill: "#283639",
    border: "2px solid #283639",
    color: "#283639",
  },

  brown: {
    fill: "brown",
    border: "2px solid brown",
    color: "brown",
  },

  blue: {
    fill: "blue",
    border: "2px solid blue",
    color: "blue",
  },

  orange: {
    fill: "orange",
    border: "2px solid orange",
    color: "orange",
  },

  green: {
    fill: "green",
    border: "2px solid green",
    color: "green",
  },
  greenLight: {
    fill: "#005C53",
    border: "2px solid #005C53",
    color: "#005C53",
  },
  blueDark: {
    fill: "#042940",
    border: "2px solid #042940",
    color: "#042940",
  },
}));

const getColor = (attribute) => {
  switch (attribute) {
    case "fixTime":
      return "brownLight";
    case "speed":
      return "greenDark";
    case "totalDistance":
      return "brown";
    case "course":
      return "blue";
    case "id":
      return "orange";
    case "motion":
      return "green";
    case "batteryLevel":
      return "greenLight";
    case "ignition":
      return "blueDark";
    default:
      return "";
  }
};

const getIcon = (name) => {
  switch (name) {
    case "fixTime":
      return <AccessTimeFilledRoundedIcon />;
    case "speed":
      return <SpeedRoundedIcon />;
    case "totalDistance":
      return <MapIcon />;
    case "course":
      return <SignpostRoundedIcon />;
    case "id":
      return <CropFreeRoundedIcon />;
    case "motion":
      return <SpeedRoundedIcon />;
    case "batteryLevel":
      return <BatteryChargingFullRoundedIcon />;
    case "ignition":
      return <PowerSettingsNewRoundedIcon />;
    default:
      return "";
  }
};

const InfoCar = ({ device, classes }) => {
  return (
    <div className={`${classes.box} ${classes.infoCar}`}>
      <div className={`${classes.box}`} style={{ padding: "0" }}>
        <ListItemAvatar style={{ minWidth: "initial" }}>
          <Avatar style={{ backgroundColor: "#312F92" }}>
            <img
              className={classes.icon}
              src={mapIcons[mapIconKey(device.category)]}
              alt=""
            />
          </Avatar>
        </ListItemAvatar>
        <div className={classes.description}>
          <Typography>{device.model}</Typography>
          <Typography>{device.name}</Typography>
        </div>
      </div>
      <div>
        <h2>Última atualização</h2>
        <Typography>{formatTime(device.lastUpdate, "seconds")}</Typography>
      </div>
    </div>
  );
};

const StatusRow = ({ position, keys, positionAttributes }) => {
  const classes = useStyles();
  if (keys == "address" || keys == "fixTime") return null;
  return (
    <fieldset className={`${classes.fieldset} ${classes[getColor(keys)]}`}>
      <legend className={`${classes.legend}`}>
        {positionAttributes[keys].name}
      </legend>
      <div className={classes.box}>
        {getIcon(keys)}
        <Typography className={`${classes.value}`}>
          <PositionValue
            position={position}
            property={position.hasOwnProperty(keys) ? keys : null}
            attribute={position.hasOwnProperty(keys) ? null : keys}
          />
        </Typography>
      </div>
    </fieldset>
  );
};

const StatusCardDetails = ({ position, device }) => {
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference(
    "positionItems",
    "fixTime,speed,totalDistance"
  );
  const classes = useStyles();

  return (
    <div className={classes.cardDetails}>
      <InfoCar device={device} classes={classes} />
      <div>
        <h4>Endereço atual:</h4>
        <Typography>
          <AddressValue
            latitude={position.latitude}
            longitude={position.longitude}
            originalAddress={position.address}
          />
        </Typography>
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
            <StatusRow
              key={key}
              keys={key}
              position={position}
              positionAttributes={positionAttributes}
            />
          ))}
      </div>

      <Link component={RouterLink} to={`/position/${position.id}`}>
        {t("sharedShowDetails")}
      </Link>
    </div>
  );
};

export default StatusCardDetails;
