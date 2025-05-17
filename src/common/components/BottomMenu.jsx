import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  Typography,
  Badge,
  ListItemIcon,
} from "@mui/material";

import { sessionActions } from "../../store";
import { useTranslation } from "./LocalizationProvider";
import { useRestriction } from "../util/permissions";
import { nativePostMessage } from "./NativeInterface";
import { DynamicIconsComponent } from "./DynamicIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCircleUser,
  faFileLines,
  faGear,
  faMap,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { useDevices } from "../../Context/App";

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const { devicesOpen, setDevicesOpen, setHeightMenuNavMobile } = useDevices();
  const paperRef = useRef(null);
  const readonly = useRestriction("readonly");
  const disableReports = useRestriction("disableReports");
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (devicesOpen) return "deviceGroup";
    if (location.pathname === `/settings/user/${user.id}`) {
      return "account";
    }
    if (location.pathname.startsWith("/settings")) {
      return "settings";
    }
    if (location.pathname.startsWith("/reports")) {
      return "reports";
    }
    if (location.pathname === "/") {
      return "map";
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

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

  const handleSelection = (event, value) => {
    switch (value) {
      case "map":
        navigate("/");
        break;
      case "deviceGroup":
        navigate("/");
        break;
      case "reports":
        navigate("/reports/route");
        break;
      case "settings":
        navigate("/settings/preferences");
        break;
      case "account":
        setAnchorEl(event.currentTarget);
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (paperRef.current) {
      setHeightMenuNavMobile(paperRef.current.clientHeight);
    }
  }, []);

  return (
    <Paper square elevation={0} ref={paperRef}>
      <BottomNavigation
        value={currentSelection()}
        onChange={handleSelection}
        showLabels
      >
        <BottomNavigationAction
          sx={{ minWidth: "initial", maxWidth: "160px", padding: "0px 4px" }}
          onClick={() => setDevicesOpen(false)}
          label={t("mapTitle")}
          icon={
            <Badge
              color="error"
              variant="dot"
              overlap="circular"
              invisible={socket !== false}
            >
              <FontAwesomeIcon icon={faMap} size="lg" />
            </Badge>
          }
          value="map"
        />
        <BottomNavigationAction
          sx={{ minWidth: "initial", maxWidth: "160px", padding: "0px 4px" }}
          onClick={() => setDevicesOpen((state) => !state)}
          label={"Veículos"}
          icon={<DynamicIconsComponent category={"carGroup"} />}
          value="deviceGroup"
        />

        {!disableReports && (
          <BottomNavigationAction
            sx={{ minWidth: "initial", maxWidth: "160px", padding: "0px 4px" }}
            onClick={() => setDevicesOpen(false)}
            label={t("reportTitle")}
            icon={<FontAwesomeIcon icon={faFileLines} size="xl" />}
            value="reports"
          />
        )}
        <BottomNavigationAction
          sx={{ minWidth: "initial", maxWidth: "160px", padding: "0px 4px" }}
          onClick={() => setDevicesOpen(false)}
          label={t("settingsTitle")}
          icon={<FontAwesomeIcon icon={faGear} size="xl" />}
          value="settings"
        />
        {readonly ? (
          <BottomNavigationAction
            sx={{ minWidth: "initial", maxWidth: "160px", padding: "0px 4px" }}
            onClick={() => setDevicesOpen(false)}
            label={t("loginLogout")}
            icon={<FontAwesomeIcon icon={faArrowRightFromBracket} size="xl" />}
            value="logout"
          />
        ) : (
          <BottomNavigationAction
            sx={{ minWidth: "initial", maxWidth: "160px", padding: "0px 4px" }}
            onClick={() => setDevicesOpen(false)}
            label={t("settingsUser")}
            icon={<FontAwesomeIcon icon={faCircleUser} size="xl" />}
            value="account"
          />
        )}
      </BottomNavigation>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleAccount}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faUserPen} />
          </ListItemIcon>
          <Typography color="textPrimary">Editar Conta</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate("/settings/devices")}>
          <ListItemIcon>
            <DynamicIconsComponent category={"cars"} />
          </ListItemIcon>
          Painel de Veículos
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              style={{ color: "red" }}
              color="red"
            />
          </ListItemIcon>
          <Typography color="error">{t("loginLogout")}</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BottomMenu;
