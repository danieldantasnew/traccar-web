import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, Slide, Snackbar } from "@mui/material";
import { devicesActions, sessionActions } from "./store";
import { useEffectAsync } from "./reactHelper";
import { useTranslation } from "./common/components/LocalizationProvider";
import { snackBarDurationLongMs } from "./common/util/duration";
import alarm from "./resources/alarm.mp3";
import { eventsActions } from "./store/events";
import useFeatures from "./common/util/useFeatures";
import { useAttributePreference } from "./common/util/preferences";
import BellOn from "./common/components/IconsAnimated/BellOn";
import { formatTime } from "./common/util/formatter";

const logoutCode = 4000;
const translations = {
  ["moving"]: "em movimento",
  ["stopped"]: "está parado",
  ["ignition on"]: "está ligado",
  ["ignition off"]: "está desligado",
  ["alarm"]: "alarme",
  ["commandResult"]: "resultado do comando",
  ["deviceExpiration"]: "expiração do dispositivo",
  ["deviceExpirationReminder"]: "lembrete de expiração do dispositivo",
  ["deviceFuelDrop"]: "queda de combustível do dispositivo",
  ["deviceFuelIncrease"]: "aumento de combustível do dispositivo",
  ["deviceInactive"]: "dispositivo inativo",
  ["deviceMoving"]: "dispositivo em movimento",
  ["deviceOffline"]: "dispositivo offline",
  ["deviceOnline"]: "dispositivo online",
  ["deviceOverspeed"]: "dispositivo em alta velocidade",
  ["deviceUnknown"]: "dispositivo desconhecido",
  ["driverChanged"]: "motorista alterado",
  ["geofenceEnter"]: "entrada na cerca virtual",
  ["geofenceExit"]: "saída da cerca virtual",
  ["maintenance"]: "manutenção",
  ["media"]: "mídia",
  ["passwordReset"]: "redefinição de senha",
  ["queuedCommandSent"]: "comando enfileirado enviado",
  ["test"]: "teste",
  ["textMessage"]: "mensagem de texto",
  ["userExpiration"]: "expiração do usuário",
  ["userExpirationReminder"]: "lembrete de expiração do usuário",
};

const convertMessages = (message) => {
  if (message) {
    const regex = /^(.+?)\s+(\w+)\s+at\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/;
    const match = message.trim().match(regex);
    if (match) {
      const device = match[1];
      const action = translations[match[2].toLowerCase()];
      console.log(action)
      const date = formatTime(match[3], "seconds");
      return `${device} ${action} ${date.toLowerCase()}`;
    } else {
      return "Mensagem de teste";
    }
  }
  return null;
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
      events.map((event) => ({
        id: event.id,
        message: event.attributes.message,
        show: true,
      }))
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
        console.log(notifications)
        const notificationMessage = convertMessages(notification.message);

        return (
          <Snackbar
            key={notification.id}
            open={notification.show}
            message={notificationMessage}
            autoHideDuration={snackBarDurationLongMs}
            TransitionComponent={Slide}
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
