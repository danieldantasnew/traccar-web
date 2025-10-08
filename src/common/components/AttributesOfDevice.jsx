import makeStyles from "@mui/styles/makeStyles";
import usePositionAttributes from "../attributes/usePositionAttributes";
import { useAttributePreference } from "../util/preferences";
import PositionValue from "./PositionValue";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "./LocalizationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faCircleStop,
  faClock,
  faExpand,
  faGaugeHigh,
  faGlobe,
  faMap,
  faPowerOff,
  faSatellite,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import { useDevices } from "../../Context/App";
import getSpeedColor from "../util/colors";

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
  },

  warning: {
    color: theme.palette.warning.main,
  },

  error: {
    color: theme.palette.error.main,
    fill: theme.palette.error.main,
  },

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
    maxHeight: "100%",
  },

  fieldset: {
    borderRadius: ".5rem",
    border: "2px solid black",
    padding: "2px 4px",
  },

  legend: {
    fontSize: ".75rem",
    fontWeight: "500",
  },

  stopIconStyle: {
    "& g path": {
      fill: "white",
    },
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
    fontSize: ".75rem !important",
    fontWeight: "600",
  },

  red: {
    fill: "red",
    border: "2px solid red",
    color: "red",
  },

  gray: {
    fill: "#949494ff !important",
    border: "2px solid #949494ff !important",
    color: "#949494ff !important",
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
    fill: "#2C76AC",
    border: "2px solid #2C76AC",
    color: "#2C76AC",
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

const getIcon = (name, batteryLevel, classes) => {
  switch (name) {
    case "fixTime":
      return <FontAwesomeIcon size="sm" icon={faClock} />;
    case "speed":
      return <FontAwesomeIcon size="sm" icon={faGaugeHigh} />;
    case "totalDistance":
      return <FontAwesomeIcon size="sm" icon={faMap} />;
    case "course":
      return <FontAwesomeIcon size="sm" icon={faSignsPost} />;
    case "id":
      return <FontAwesomeIcon size="sm" icon={faExpand} />;
    case "motion":
      return <FontAwesomeIcon size="sm" icon={faGaugeHigh} />;
    case "batteryLevel":
      if (batteryLevel > 70)
        return <FontAwesomeIcon size="sm" icon={faBatteryFull} />;
      else if (batteryLevel > 50)
        return (
          <FontAwesomeIcon
            icon={faBatteryThreeQuarters}
            className={classes.success}
          />
        );
      else if (batteryLevel > 30)
        return (
          <FontAwesomeIcon icon={faBatteryHalf} className={classes.warning} />
        );
      else
        return (
          <FontAwesomeIcon icon={faBatteryQuarter} className={classes.error} />
        );
    case "ignition":
      return <FontAwesomeIcon size="sm" icon={faPowerOff} />;
    case "sat":
      return <FontAwesomeIcon size="sm" icon={faSatellite} />;
    case "hours":
      return <FontAwesomeIcon size="sm" icon={faClock} />;
    default:
      return <FontAwesomeIcon size="sm" icon={faGlobe} />;
  }
};

const StatusRow = ({ position, keys, positionAttributes }) => {
  const classes = useStyles();
  let speedColor = null;
  if (keys == "address" || keys == "fixTime") return null;
  const battery = keys == "batteryLevel" ? position.attributes[keys] : null;

  if (keys == "speed") {
    speedColor = getSpeedColor(null, null, null, position[keys]);
    speedColor = {
      fill: `${speedColor}`,
      border: `2px solid ${speedColor}`,
      color: `${speedColor}`,
    };
  }

  return (
    <fieldset
      className={`${classes.fieldset} ${
        position?.[keys] || position?.attributes?.[keys]
          ? classes[getColor(keys, position)]
          : classes.gray
      }`}
      style={speedColor ? speedColor : {}}
    >
      <legend className={`${classes.legend}`}>
        {positionAttributes[keys].name}
      </legend>
      <div className={classes.box}>
        {getIcon(keys, battery, classes)}
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

const AttributesOfDevice = ({ position }) => {
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference(
    "positionItems",
    "fixTime,speed,totalDistance"
  );

  const classes = useStyles();
  const { totalStops } = useDevices();
  const selectedStop = Array.isArray(totalStops)
    ? totalStops.find((stopDevice) => stopDevice.deviceId === position.deviceId)
    : null;

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
        {selectedStop && (
          <fieldset
            className={`${classes.fieldset} ${
              selectedStop.total ? classes.red : classes.gray
            }`}
          >
            <legend className={`${classes.legend}`}>Total de Paradas</legend>
            <div className={`${classes.box}`}>
              <FontAwesomeIcon icon={faCircleStop} />
              <Typography className={`${classes.value}`}>
                {selectedStop.total}
              </Typography>
            </div>
          </fieldset>
        )}
      </Box>
    </div>
  );
};

export default AttributesOfDevice;
