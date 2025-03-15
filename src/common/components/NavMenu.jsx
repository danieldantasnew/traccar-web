import { makeStyles } from "@mui/styles";
import { DynamicIconsComponent } from "./DynamicIcons";
import { Box, IconButton, ListItemIcon, MenuItem, MenuList, Popover, Tooltip, Typography } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./LocalizationProvider";
import { useState } from "react";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const useStyles = makeStyles((theme) => ({
  iconsSideBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40px",
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
  const [accountPopOver, setAccountPopOver] = useState(false);
  return (
    <Box component={"div"} className={classes.iconsSideBar}>
      <Tooltip title="Meus veículos" placement="right" arrow>
        <IconButton
          size="medium"
          onClick={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
          onTouchStart={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
        >
          <DynamicIconsComponent category={"carGroup"} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("reportTitle")} placement="right" arrow>
        <IconButton
          size="medium"
          onClick={() => navigate("/reports/combined")}
          onTouchStart={() => navigate("/reports/combined")}
        >
          <DescriptionRoundedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("settingsTitle")} placement="right" arrow>
        <IconButton
          size="medium"
          onClick={() => navigate("/settings/preferences")}
          onTouchStart={() => navigate("/settings/preferences")}
        >
          <SettingsRoundedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={t("settingsUser")}
        placement="right"
        arrow
      >
        <IconButton size="medium" onClick={(event) => setAccountPopOver(event.currentTarget)}>
          <AccountCircleRoundedIcon />
        </IconButton>
      </Tooltip>
      <Popover
        id="Account"
        open={Boolean(accountPopOver)}
        onClose={() => setAccountPopOver(null)}
        anchorEl={accountPopOver}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <EditRoundedIcon/>
            </ListItemIcon>
           Editar Conta
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <ExitToAppRoundedIcon fontSize="medium" color="error"/>
            </ListItemIcon>
            <Typography >
              Sair
            </Typography>
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
};

export default NavMenu;
