import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import usePositionAttributes from "../attributes/usePositionAttributes";
import { useAttributePreference } from "../util/preferences";
import PositionValue from "./PositionValue";
import {
  Box,
  Link,
  Typography,
} from "@mui/material";
import { useTranslation } from "./LocalizationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faClock,
  faExpand,
  faGaugeHigh,
  faGlobe,
  faMap,
  faPowerOff,
  faSatellite,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  cardDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0",
    overflow: "auto",
    "& h4": {
      fontSize: ".8rem",
      fontWeight: "500",
      color: "#4B4B4B",
      margin: "0",
    },
    "& p": {
      fontSize: "1rem",
    },
  },
  flexRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "1rem",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
  },
  fieldset: {
    borderRadius: ".5rem",
    border: "2px solid black",
    padding: "0px",
    paddingLeft: ".5rem",
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
    },
    "& h2": {
      fontSize: ".8rem !important",
      color: "#444444 !important",
    },
  },

  value: {
    fontSize: ".9rem !important",
    fontWeight: "600",
    [theme.breakpoints.down("lg")]: {
      fontSize: ".8rem !important",
    },
  },
  red: {
    fill: "red",
    border: "2px solid red",
    color: "red",
  },
  gray: {
    fill: "gray",
    border: "2px solid gray",
    color: "gray",
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
  defaultColor: {
    fill: "##2C76AC",
    border: "2px solid #2C76AC",
    color: "#2C76AC",
  }
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
      return "brownLight";
    case "motion":
      return "green";
    case "batteryLevel":
      return "greenLight";
    case "ignition":
      return "blueDark";
    case "sat":
      return "orange";
    default:
      return "defaultColor";
  }
};

const getIcon = (name) => {
  switch (name) {
    case "fixTime":
      return <FontAwesomeIcon icon={faClock} color="" />;
    case "speed":
      return <FontAwesomeIcon icon={faGaugeHigh} />;
    case "totalDistance":
      return <FontAwesomeIcon icon={faMap} />;
    case "course":
      return <FontAwesomeIcon icon={faSignsPost} />;
    case "id":
      return <FontAwesomeIcon icon={faExpand} />;
    case "motion":
      return <FontAwesomeIcon icon={faGaugeHigh} />;
    case "batteryLevel":
      return <FontAwesomeIcon icon={faBatteryFull} />;
    case "ignition":
      return <FontAwesomeIcon icon={faPowerOff} />;
    case "sat":
      return <FontAwesomeIcon icon={faSatellite} />;
    case "hours":
      return <FontAwesomeIcon icon={faClock} />;
    default:
      return <FontAwesomeIcon icon={faGlobe} />;
  }
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
      <Box className={classes.details}>
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
      </Box>
    </div>
  );
};

export default StatusCardDetails;
