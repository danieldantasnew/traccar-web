import { Avatar, Box, ListItemAvatar, Typography } from "@mui/material";
import { formatTime } from "../../util/formatter";
import { DynamicIconsComponent } from "../DynamicIcons";

const infoCar = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ".3rem",
    padding: ".4rem .5rem",
    backgroundColor: "#f3f3f3",
};

const box = {
    textAlign: 'right',
    color: '#444444'
};

const avatarInfo = {
    display: 'flex',
    alignItems: 'center',
    gap: '.4rem',
};

const InfoCar = ({ device }) => {
  const attributes = device?.attributes || {};
  const { background, icon } = attributes?.deviceColors || {background: "black", icon: "red", text: "white", secondary: "blue"};

  if(!device) return null;

  return (
    <Box style={infoCar}>
      <Box style={avatarInfo}>
        <Box style={{ minWidth: "initial" }}>
          <Avatar style={{ backgroundColor: background, color: icon }}>
            <DynamicIconsComponent category={device.category}/>
          </Avatar>
        </Box>
        <Box>
          <Typography variant="h2" style={{fontSize: '.8rem', fontWeight: 500}}>{device.name}</Typography>
          <Typography style={{fontSize: '.8rem', fontWeight: 400}}>{device.model}</Typography>
        </Box>
      </Box>
      <Box style={box}>
        <h2 style={{margin: 0, fontSize: '.75rem'}}>Última atualização</h2>
        <Typography style={{margin: 0, fontSize: '.77rem'}}>{formatTime(device.lastUpdate, "seconds")}</Typography>
      </Box>
    </Box>
  );
};

export default InfoCar;
