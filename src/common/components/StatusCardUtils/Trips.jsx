import {
  faCircleStop,
  faFlagCheckered,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useCatch, useEffectAsync } from "../../../reactHelper";
import dayjs from "dayjs";
import SpinLoading from "../SpinLoading";
import {
  formatDistance,
  formatNumericHours,
  formatSpeed,
  formatTime,
} from "../../util/formatter";
import { speedToKnots } from "../../util/converter";
import { useAttributePreference } from "../../util/preferences";
import { useTranslation } from "../LocalizationProvider";
import { useDevices } from "../../../Context/App";

const textColor = "#444555";

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: "100%",
    width: "100%",
    flexShrink: 0,
  },
  box: {
    display: "flex",
    flexDirection: "column",
    gap: ".4rem",
    borderRadius: ".5rem",
    overflow: "hidden",
    boxShadow: "0px 0px 4px 1px rgba(0,0,0,.1)",
    padding: "1rem 1rem 2rem 1rem",
    position: "relative",
    marginBottom: "1rem",
    "& h2": {
      color: `${textColor}`,
      fontSize: "1.2rem",
      fontWeight: 700,
      margin: 0,
    },
    "& h3": {
      color: `${textColor}`,
      fontWeight: 600,
      fontSize: ".8rem",
      margin: 0,
    },
    "& p": {
      color: `${textColor}`,
      fontSize: ".8rem",
      margin: 0,
    },
    "& strong": {
      fontWeight: 600,
    },
  },
  span: {
    backgroundColor: `${textColor}`,
    padding: ".5rem",
    borderRadius: "100%",
    height: "40px",
    width: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    gap: ".4rem",
  },
  verticalLine: {
    height: "100%",
    width: ".25rem",
    position: "absolute",
    left: "0",
    top: "0",
  },
  dataTrip: {
    display: "flex",
    gap: ".5rem",
    position: "relative",
  },
  containerTimeLine: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeLine: {
    height: "100%",
    width: "3px",
    backgroundColor: `${textColor}`,
    borderRadius: "2px",
  },
}));

const Trips = ({ backgroundColor, text, secondary, device }) => {
  const [trips, setTrips] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    hideRoutes,
    selectedItemOnTrip,
    setConfigsOnTrip,
    setSelectedItemOnTrip,
    setRouteTrips,
  } = useDevices();
  const styles = useStyles();
  const t = useTranslation();
  const distanceUnit = useAttributePreference("distanceUnit");
  const speedUnit = useAttributePreference("speedUnit");
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");

  const searchTrips = useCatch(async ({ deviceId, from, to, type }) => {
    const query = new URLSearchParams({ deviceId, from, to });
    if (type === "export") {
      window.location.assign(`/api/reports/trips/xlsx?${query.toString()}`);
    } else if (type === "mail") {
      const response = await fetch(
        `/api/reports/trips/mail?${query.toString()}`
      );
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/trips?${query.toString()}`, {
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          setTrips(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const createMarkersTrip = () => {
    setConfigsOnTrip((item) => ({
      ...item,
      markers: [
        {
          latitude: selectedItemOnTrip.startLat,
          longitude: selectedItemOnTrip.startLon,
          image: "start-success",
        },
        {
          latitude: selectedItemOnTrip.endLat,
          longitude: selectedItemOnTrip.endLon,
          image: "finish-error",
        },
      ],
    }));
  };

  useEffectAsync(async () => {
    if (selectedItemOnTrip) {
      const query = new URLSearchParams({
        deviceId: selectedItemOnTrip.deviceId,
        from: selectedItemOnTrip.startTime,
        to: selectedItemOnTrip.endTime,
      });
      const response = await fetch(`/api/reports/route?${query.toString()}`, {
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        hideRoutes();
        setRouteTrips(await response.json());
        createMarkersTrip();
      } else {
        throw Error(await response.text());
      }
    } else {
      setRouteTrips(null);
    }
  }, [selectedItemOnTrip]);

  useEffect(() => {
    searchTrips({
      deviceId: device.id,
      from: from.toISOString(),
      to: to.toISOString(),
    });
  }, []);

  if (loading) return <SpinLoading backgroundColor={backgroundColor} />;
  return (
    <div className={styles.container}>
      {trips && trips.length > 0
        ? trips.map((item, index) => (
            <div key={item + index} className={styles.box}>
              <div
                className={styles.verticalLine}
                style={{ backgroundColor }}
              ></div>
              <div className={styles.flex}>
                <span className={styles.span}>
                  <FontAwesomeIcon
                    icon={faFlagCheckered}
                    style={{ height: "24px", width: "24px" }}
                    color={`white`}
                  />
                </span>
                <h2>Dados da Viagem</h2>
              </div>
              <div className={styles.dataTrip}>
                <div className={styles.containerTimeLine}>
                  <span>
                    <FontAwesomeIcon
                      style={{
                        height: "14px",
                        width: "14px",
                        padding: ".2rem 0",
                      }}
                      color={`${textColor}`}
                      icon={faLocationDot}
                    />
                  </span>
                  <div className={styles.timeLine}></div>
                  <span>
                    <FontAwesomeIcon
                      style={{
                        height: "14px",
                        width: "14px",
                        padding: ".3rem 0",
                      }}
                      color={`${textColor}`}
                      icon={faCircleStop}
                    />
                  </span>
                </div>
                <div>
                  <div>
                    <h3>
                      {item.startAddress
                        ? item.startAddress
                        : "Não identificado"}
                    </h3>
                    <p>
                      {item.startTime
                        ? formatTime(item.startTime, "seconds")
                        : "Não identificado"}
                    </p>
                  </div>
                  <div style={{ margin: ".5rem 0", paddingBottom: "2rem" }}>
                    <p>
                      Vel. Média:{" "}
                      <strong>
                        {item.averageSpeed
                          ? formatSpeed(
                              speedToKnots(item.averageSpeed, "kmh"),
                              speedUnit,
                              t
                            )
                          : "Não identificado"}
                      </strong>
                    </p>
                    <p>
                      Vel. Máxima:{" "}
                      <strong>
                        {item.maxSpeed
                          ? formatSpeed(
                              speedToKnots(item.maxSpeed, "kmh"),
                              speedUnit,
                              t
                            )
                          : "Não identificado"}
                      </strong>
                    </p>
                    <p>
                      Distância:{" "}
                      <strong>
                        {item.distance
                          ? formatDistance(item.distance, distanceUnit, t)
                          : "Não identificado"}
                      </strong>
                    </p>
                    <p>
                      Duração:{" "}
                      <strong>
                        {item.duration
                          ? formatNumericHours(item.duration, t)
                          : "Não identificado"}
                      </strong>
                    </p>
                  </div>
                  <div style={{ position: "absolute", bottom: "-12px" }}>
                    <h3>
                      {item.endAddress ? item.endAddress : "Não identificado"}
                    </h3>
                    <p>
                      {item.endTime
                        ? formatTime(item.endTime, "seconds")
                        : "Não identificado"}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                sx={{
                  position: "absolute",
                  right: "1rem",
                  bottom: "1rem",
                  backgroundColor,
                  color: text,
                  padding: "0 1rem",
                  fontSize: ".75rem",
                  "&:hover": {
                    backgroundColor: `${secondary}`,
                  },
                }}
                onClick={() => setSelectedItemOnTrip(item)}
              >
                Ver rotas
              </Button>
            </div>
          ))
        : "Sem viagens por hoje..."}
    </div>
  );
};

export default Trips;
