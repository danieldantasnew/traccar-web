import { makeStyles } from "@mui/styles";
import { DynamicIconsComponent } from "../common/components/DynamicIcons";
import { Box, IconButton } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  iconsSideBar: {
    display: "flex",
    gap: ".5rem",
  },
}));

const NavSideBar = ({setDevicesOpen}) => {
  const classes = useStyles();
  return (
    <Box className={classes.iconsSideBar}>
      <IconButton
        size="medium"
        onClick={() => setDevicesOpen((devicesOpen)=> !devicesOpen)}
        onTouchStart={() => setDevicesOpen((devicesOpen)=> !devicesOpen)}
      >
        <DynamicIconsComponent category={"carGroup"} />
      </IconButton>
    </Box>
  );
};

export default NavSideBar;
