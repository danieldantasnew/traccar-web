import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  Slide,
  Snackbar,
} from "@mui/material";
import { devicesActions, sessionActions } from "./store";
import { useEffectAsync } from "./reactHelper";
import { useTranslation } from "./common/components/LocalizationProvider";
import { snackBarDurationLongMs } from "./common/util/duration";
import alarm from "./resources/alarm.mp3";
import { eventsActions } from "./store/events";
import useFeatures from "./common/util/useFeatures";
import { useAttributePreference } from "./common/util/preferences";
import BellOn from "./common/components/IconsAnimated/BellOn";
import translationsEvents from "./common/util/translationsEvents";

const logoutCode = 4000;

const convertMessages = (notification) => {
  const deviceName = notification.name || "";
  const action = translationsEvents[notification.type] || "";

  return `${deviceName} ${action}`;
};

const SocketController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const authenticated = useSelector((state) => !!state.session.user);
  const devices = useSelector((state) => state.devices.items);
  const includeLogs = useSelector((state) => state.session.includeLogs);

  const socketRef = useRef();

  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const soundEvents = useAttributePreference("soundEvents", "");
  const soundAlarms = useAttributePreference("soundAlarms", "sos");

  const features = useFeatures();

  const connectSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(
      `${protocol}//${window.location.host}/api/socket`
    );
    socketRef.current = socket;

    socket.onopen = () => {
      dispatch(sessionActions.updateSocket(true));
    };

    socket.onclose = async (event) => {
      dispatch(sessionActions.updateSocket(false));
      if (event.code !== logoutCode) {
        try {
          const devicesResponse = await fetch("/api/devices");
          if (devicesResponse.ok) {
            dispatch(devicesActions.update(await devicesResponse.json()));
            dispatch(devicesActions.loading(false));
          }
          const positionsResponse = await fetch("/api/positions");
          if (positionsResponse.ok) {
            dispatch(
              sessionActions.updatePositions(await positionsResponse.json())
            );
          }
          if (
            devicesResponse.status === 401 ||
            positionsResponse.status === 401
          ) {
            navigate("/login");
          }
        } catch (error) {
          // ignore errors
        }
        setTimeout(() => connectSocket(), 60000);
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.devices) {
        dispatch(devicesActions.update(data.devices));
      }
      if (data.positions) {
        dispatch(sessionActions.updatePositions(data.positions));
      }
      if (data.events) {
        if (!features.disableEvents) {
          dispatch(eventsActions.add(data.events));
        }
        setEvents(data.events);
      }
      if (data.logs) {
        dispatch(sessionActions.updateLogs(data.logs));
      }
    };
  };

  useEffect(() => {
    socketRef.current?.send(JSON.stringify({ logs: includeLogs }));
  }, [socketRef, includeLogs]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch("/api/devices");
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
        dispatch(devicesActions.loading(false));
      } else {
        throw Error(await response.text());
      }
      connectSocket();
      return () => {
        const socket = socketRef.current;
        if (socket) {
          socket.close(logoutCode);
        }
      };
    }
    return null;
  }, [authenticated]);

  useEffect(() => {
    setNotifications(
      events.map((event) => {
        return {
          id: event.id,
          message: event.attributes.message,
          show: true,
          deviceId: event.deviceId,
          type: event.type,
          name: devices[event.deviceId]?.name,
          timestamp: event.eventTime,
        };
      })
    );
  }, [events, devices, t]);

  useEffect(() => {
    events.forEach((event) => {
      if (
        soundEvents.includes(event.type) ||
        (event.type === "alarm" && soundAlarms.includes(event.attributes.alarm))
      ) {
        new Audio(alarm).play();
      }
    });
  }, [events, soundEvents, soundAlarms]);

  return (
    <>
      {notifications.map((notification) => {
        const notificationMessage = convertMessages(notification);

        return (
          <Snackbar
            key={notification.id}
            open={notification.show}
            message={notificationMessage}
            autoHideDuration={snackBarDurationLongMs}
            TransitionComponent={Slide}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            onClose={() =>
              setEvents(events.filter((e) => e.id !== notification.id))
            }
          >
            <Alert
              icon={<BellOn color="red" />}
              sx={{
                backgroundColor: "rgb(37, 37, 37)",
                color: "white",
                alignItems: "center",
              }}
            >
              <AlertTitle sx={{ margin: 0 }}>Nova Notificação</AlertTitle>
              {notificationMessage}
            </Alert>
          </Snackbar>
        );
      })}
    </>
  );
};
export default connect()(SocketController);
