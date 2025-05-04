import {
  faClock,
  faCompass,
  faRoad,
  faSatellite,
  faSatelliteDish,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import React from "react";
import durationOfStop from "../../util/durationOfStop";
import { formatTime } from "../../util/formatter";
import accuracy from "../../util/accuracy";

const OrganizeBox = ({ icon, sizeIcon, title, value, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: ".3rem",
        color,
      }}
    >
      <FontAwesomeIcon icon={icon} style={{fontSize: sizeIcon}} color={color} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h5" sx={{ fontSize: "1.2rem", fontWeight: "500", lineHeight: ".9rem" }}>{title}</Typography>
        <Typography variant="p" sx={{ fontSize: "1rem", fontWeight: "400", lineHeight: "1.3rem" }}>{value}</Typography>
      </Box>
    </Box>
  );
};

const AttributesStop = ({ stop, classes }) => {
  const sizeIcons = "1.3rem";
  const color = "rgb(63, 63, 63)"
  return (
    <Box sx={{ padding: "1rem .5rem" }} className={classes.grid}>
      <OrganizeBox
        icon={faClock}
        sizeIcon={sizeIcons}
        title="Início"
        value={formatTime(stop.startTime, "seconds")}
        color={color}
      />
      <OrganizeBox
        icon={faClock}
        sizeIcon={sizeIcons}
        title="Fim"
        value={formatTime(stop.endTime, "seconds")}
        color={color}
      />
      <OrganizeBox
        icon={faStopwatch}
        sizeIcon={sizeIcons}
        title="Duração"
        value={durationOfStop(stop.startTime, stop.endTime).formatted}
        color={color}
      />
      <OrganizeBox
        icon={faRoad}
        sizeIcon={sizeIcons}
        title="Odômetro"
        value={stop.odometer ? `${stop.odometer} km` : "Não informado"}
        color={color}
      />
      <OrganizeBox
        icon={faSatelliteDish}
        sizeIcon={sizeIcons}
        title="Precisão GPS"
        value={accuracy(stop.accuracy)}
        color={color}
      />
      <OrganizeBox
        icon={faSatellite}
        sizeIcon={sizeIcons}
        title="Qtd de satélites"
        value={stop.sat ? stop.sat : 0}
        color={color}
      />
      <OrganizeBox
        icon={faCompass}
        sizeIcon={sizeIcons}
        title="Latitude"
        value={parseFloat(stop.latitude).toFixed(6)}
        color={color}
      />
      <OrganizeBox
        icon={faCompass}
        sizeIcon={sizeIcons}
        title="Logitude"
        value={parseFloat(stop.longitude).toFixed(6)}
        color={color}
      />
    </Box>
  );
};

export default AttributesStop;
