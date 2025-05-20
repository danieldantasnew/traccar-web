import { makeStyles } from "@mui/styles";
import { DynamicIconsComponent } from "./DynamicIcons";
import {
  Box,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "./LocalizationProvider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nativePostMessage } from "./NativeInterface";
import { sessionActions } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCircleUser,
  faFileLines,
  faGear,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  iconsSideBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40px",
    gap: "1.5rem",
    ["& svg"]: {
      width: "",
      "&:hover": {
        color: "#2C76AC",
        transition: ".3s",
      },
    },
  },
  iconButton: {
    "&:hover": {
      color: "#2C76AC",
    },
  },
}));

const NavMenu = ({ setDevicesOpen }) => {
  const classes = useStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [accountPopOver, setAccountPopOver] = useState(false);

  const handleAccount = () => {
    setAccountPopOver(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAccountPopOver(null);

    const notificationToken = window.localStorage.getItem("notificationToken");
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem("notificationToken");
      const tokens = user.attributes.notificationTokens?.split(",") || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(",")
                : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch("/api/session", { method: "DELETE" });
    nativePostMessage("logout");
    navigate("/login");
    dispatch(sessionActions.updateUser(null));
  };

  return (
    <Box component={"div"} className={classes.iconsSideBar}>
      <Tooltip title="Meus veículos" placement="right" arrow>
        <IconButton
          size="medium"
          onClick={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
          onTouchStart={() => setDevicesOpen((devicesOpen) => !devicesOpen)}
          className={classes.iconButton}
        >
          <DynamicIconsComponent category={"carGroup"} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("reportTitle")} placement="right" arrow>
        <IconButton
          size="medium"
          onClick={() => navigate("/reports/route")}
          onTouchStart={() => navigate("/reports/route")}
          className={classes.iconButton}
        >
          <FontAwesomeIcon size="sm" icon={faFileLines} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("settingsTitle")} placement="right" arrow>
        <IconButton
          size="medium"
          onClick={() => navigate("/settings/preferences")}
          onTouchStart={() => navigate("/settings/preferences")}
          className={classes.iconButton}
        >
          <FontAwesomeIcon icon={faGear} size="sm" />
        </IconButton>
      </Tooltip>

      <Tooltip title={t("settingsUser")} placement="right" arrow>
        <IconButton
          size="medium"
          onClick={(event) => setAccountPopOver(event.currentTarget)}
          className={classes.iconButton}
        >
          <FontAwesomeIcon size="sm" icon={faCircleUser} />
        </IconButton>
      </Tooltip>
      <Popover
        id="Account"
        open={Boolean(accountPopOver)}
        onClose={() => setAccountPopOver(null)}
        anchorEl={accountPopOver}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuList>
          <MenuItem
            onClick={handleAccount}
            sx={{
              "&:hover": {
                "& svg": { color: "#2C76AC" },
                color: "#2C76AC",
              },
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faUserPen} />
            </ListItemIcon>
            Editar Conta
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/settings/devices/panel")}
            sx={{
              "&:hover": {
                "& svg": { color: "#2C76AC" },
                color: "#2C76AC",
              },
            }}
          >
            <ListItemIcon>
              <DynamicIconsComponent category={"cars"} />
            </ListItemIcon>
            Painel de Veículos
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "#ffe6e6",
                color: "red",
                "& svg": {
                  color: "red",
                },
              },
              "&:active": {
                backgroundColor: "#fffffc",
              },
            }}
          >
            <ListItemIcon>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
              />
            </ListItemIcon>
            Sair
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
};

export default NavMenu;
