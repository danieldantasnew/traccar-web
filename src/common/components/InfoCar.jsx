import { Avatar, Box, Typography } from "@mui/material";
import { DynamicIconsComponent } from "./DynamicIcons";
import { formatTime } from "../util/formatter";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  infoCar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ".3rem",
    padding: ".4rem .5rem",
    backgroundColor: "#f3f3f3",
  },
  box: {
    textAlign: "right",
    color: "#444444",
  },

  avatarInfo: {
    display: "flex",
    alignItems: "center",
    gap: ".4rem",
  },
}));

const InfoCar = ({ device, className=null, avatarCSS=null, }) => {
  const classes = useStyles();
  const attributes = device?.attributes || {};
  const { background, icon } = attributes?.deviceColors || {
    background: "black",
    icon: "red",
    text: "white",
    secondary: "blue",
  };

  if (!device) return null;

  return (
    <Box className={`${classes.infoCar} ${className || null}`}>
      <Box className={`${classes.avatarInfo} ${avatarCSS || null}`}>
        <Box style={{ minWidth: "initial" }}>
          <Avatar style={{ backgroundColor: background, color: icon }}>
            <DynamicIconsComponent category={device.category} />
          </Avatar>
        </Box>
        <Box>
          <Typography
            variant="h2"
            style={{ fontSize: ".8rem", fontWeight: 500 }}
          >
            {device.name}
          </Typography>
          <Typography style={{ fontSize: ".8rem", fontWeight: 400 }}>
            {device.model}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.box}>
        <Typography component={"h2"} style={{ margin: 0, fontSize: ".77rem", fontWeight: 700 }}>Última atualização</Typography>
        <Typography style={{ margin: 0, fontSize: ".77rem" }}>
          {formatTime(device.lastUpdate, "seconds")}
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoCar;
