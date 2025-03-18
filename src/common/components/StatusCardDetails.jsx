import React, { useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { formatTime } from "../util/formatter";
import makeStyles from "@mui/styles/makeStyles";
import usePositionAttributes from "../attributes/usePositionAttributes";
import { useAttributePreference } from "../util/preferences";
import PositionValue from "./PositionValue";
import {
  Alert,
  Avatar,
  IconButton,
  Link,
  ListItemAvatar,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddressValue from "./AddressValue";
import { useTranslation } from "./LocalizationProvider";
import { mapIconKey, mapIcons } from "../../map/core/preloadImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faClock,
  faCopy,
  faExpand,
  faGaugeHigh,
  faGlobe,
  faMap,
  faPowerOff,
  faSatelliteDish,
  faSignsPost,
  faStreetView,
} from "@fortawesome/free-solid-svg-icons";
import { DynamicIconsComponent } from "./DynamicIcons";

const useStyles = makeStyles((theme) => ({
  cardDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "0 .5rem",
    overflow: "auto",
    "& h4": {
      fontSize: ".85rem",
      fontWeight: "500",
      color: "rgb(19, 9, 4)",
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
    [theme.breakpoints.down("lg")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
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
  },

  value: {
    fontSize: ".9rem !important",
    fontWeight: "600",
    [theme.breakpoints.down("lg")]: {
      fontSize: ".8rem !important",
    },
  },

  infoCar: {
    justifyContent: "space-between",
    padding: 0,
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
    filter: "brightness(0) invert(1)",
    width: "20px",
    height: "20px",
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
      return <FontAwesomeIcon icon={faClock} />;
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
      return <FontAwesomeIcon icon={faSatelliteDish} />;
    case "hours":
      return <FontAwesomeIcon icon={faClock} />;
    default:
      return <FontAwesomeIcon icon={faGlobe} />;
  }
};

const InfoCar = ({ device, classes }) => {
  return (
    <div className={`${classes.box} ${classes.infoCar}`}>
      <div className={`${classes.box}`} style={{ padding: "0" }}>
        <ListItemAvatar style={{ minWidth: "initial" }}>
          <Avatar style={{ backgroundColor: `${device.subColor}` }}>
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

const handleCopyAddress = (copiedAddress, setAlertCopied, timeOutAlert) => {
  if (copiedAddress) {
    navigator.clipboard.writeText(copiedAddress);
    setAlertCopied(true);
    if (timeOutAlert.current) {
      clearTimeout(timeOutAlert.current);
    }
    timeOutAlert.current = setTimeout(() => {
      setAlertCopied(false);
    }, 3000);
  }
};

const StatusCardDetails = ({ position, device }) => {
  const timeOutAlert = useRef();
  const t = useTranslation();
  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference(
    "positionItems",
    "fixTime,speed,totalDistance"
  );
  const [copiedAddress, setAddress] = useState(null);
  const [alertCopied, setAlertCopied] = useState(false);
  const classes = useStyles();

  return (
    <div className={classes.cardDetails}>
      <Snackbar
        open={alertCopied}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mr: 4 }}
      >
        <Alert
          color="success"
          style={{ backgroundColor: "#4bbf50", color: "white" }}
          size="md"
          onClose={() => setAlertCopied(false)}
        >
          Endereço copiado para área de transferência
        </Alert>
      </Snackbar>
      <InfoCar device={device} classes={classes} />
      <div>
        <h4>Endereço atual:</h4>
        <div
          className={classes.flexRow}
          style={{ justifyContent: "space-between" }}
        >
          <Typography style={{ maxWidth: "360px" }}>
            <AddressValue
              latitude={position.latitude}
              longitude={position.longitude}
              originalAddress={position.address}
              setStateAddress={setAddress}
            />
          </Typography>
          <div>
            <Tooltip
              title={"Copiar endereço"}
              onClick={() =>
                handleCopyAddress(copiedAddress, setAlertCopied, timeOutAlert)
              }
            >
              <IconButton component="a">
                <DynamicIconsComponent category={"copy"} style={{ border: "1px solid transparent", color: "#a1a1a1" }}/>
              </IconButton>
            </Tooltip>
            <Tooltip title={t("linkStreetView")}>
              <IconButton
                component="a"
                target="_blank"
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}
                className={classes.orange}
                style={{ border: "1px solid transparent" }}
              >
                <FontAwesomeIcon icon={faStreetView} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
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
