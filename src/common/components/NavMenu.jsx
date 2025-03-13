import { makeStyles } from "@mui/styles";
import { DynamicIconsComponent } from "./DynamicIcons";
import { Box, IconButton, Tooltip } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./LocalizationProvider";

const useStyles = makeStyles((theme) => ({
  iconsSideBar: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    ["& svg"]: {
      width: "",
    },
  },
}));

const NavMenu = ({ setDevicesOpen }) => {
  const classes = useStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  return (
    <Box className={classes.iconsSideBar}>
      <Tooltip title="Meus veículos" placement="right">
        <IconButton
          size="medium"
          onClick={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
          onTouchStart={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
        >
          <DynamicIconsComponent category={"carGroup"} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('reportTitle')} placement="right">
        <IconButton
          size="medium"
          onClick={() => navigate("/reports/combined")}
          onTouchStart={() => navigate("/reports/combined")}
        >
          <DescriptionRoundedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('settingsTitle')} placement="right">
        <IconButton
          size="medium"
          onClick={() => navigate("/settings/preferences")}
          onTouchStart={() => navigate("/settings/preferences")}
        >
          <SettingsRoundedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('settingsUser')} placement="right">
        <IconButton
          size="medium"
          onClick={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
          onTouchStart={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
        >
          <AccountCircleRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NavMenu;
