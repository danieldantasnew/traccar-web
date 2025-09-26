import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useFetchPositionsAndStops from "../../../hooks/useFetchPositionsAndStops";
import dayjs from "dayjs";
import { Button, Typography } from "@mui/material";
import SpinLoading from "../SpinLoading";
import { useDevices } from "../../../Context/App";
import { makeStyles } from "@mui/styles";
import {
  faLocationDot,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { map } from "../../../map/core/MapView";
import { formatNumericHours, formatTime } from "../../util/formatter";
import { useTranslation } from "../LocalizationProvider";
import { buildStops } from "../../util/buildStops";
import centerInMap from "../../util/centerInMap";

const textColor = "#444555";

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: "100%",
    width: "100%",
    flexShrink: 0,
  },
  box: {
    transition: "all .3s ease",
    display: "flex",
    flexDirection: "column",
    gap: ".4rem",
    borderRadius: ".5rem",
    overflow: "hidden",
    padding: "1rem 1rem 2rem 1rem",
    position: "relative",
    marginBottom: "1.5rem",
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
    fontSize: "1.4rem",
    color: "white",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    gap: ".4rem",
  },
  verticalLine: {
    backgroundColor: `${textColor}`,
    height: "100%",
    width: ".25rem",
    position: "absolute",
    left: "0",
    top: "0",
  },
}));

const Stops = ({ backgroundColor, text, secondary }) => {
  const styles = useStyles();
  const t = useTranslation();
  const devices = useSelector((state) => state.devices.items);
  const [cardSelected, setCardSelected] = useState(null);
  const selectedId = useSelector((state) => state.devices.selectedId);
  const groupIds = useSelector((state) => state.reports.groupIds);
  const { positions, setPositions, stops, setStops, setStopCard, hideRoutesTrips } = useDevices();
  const [loading, setLoading] = useState(false);
  const from = dayjs().startOf("day");
  const to = dayjs().endOf("day");
  const { handlePositionsAndStops } = useFetchPositionsAndStops({
    setPositions,
    setStops,
    setLoading,
  });

  const centerDevice = (position, index) => {
    setStopCard(position);
    setCardSelected(index);
    centerInMap(position, 20);
  };

  useEffect(() => {
    hideRoutesTrips();
    if (positions && positions.length == 0 && selectedId) {
      handlePositionsAndStops({
        deviceId: selectedId,
        groupIds,
        from: from.toISOString(),
        to: to.toISOString(),
      });
    }
  }, []);

  const stopsBuilded = useMemo(
    () => buildStops(stops, positions, devices),
    [stops, positions, devices]
  );

  if (loading) return <SpinLoading backgroundColor={backgroundColor} />;
  if (!stopsBuilded || stopsBuilded.length == 0)
    return <Typography>Sem paradas por hoje...</Typography>;
  return (
    <div className={styles.container}>
      {stopsBuilded.map((item, index) => (
        <div
          key={item + index}
          className={styles.box}
          style={{
            boxShadow: `${
              cardSelected === index
                ? `0px 0px 0px 2px ${backgroundColor}`
                : "0px 0px 4px 1px rgba(0,0,0,.1)"
            }`,
          }}
        >
          <div
            className={styles.verticalLine}
            style={{
              backgroundColor: `${
                cardSelected === index ? backgroundColor : textColor
              }`,
            }}
          ></div>
          <div className={styles.flex}>
            <span className={styles.span}>{item.stopped}</span>
            <h2>Resumo da Parada</h2>
          </div>
          <div className={styles.flex} style={{ marginTop: ".6rem" }}>
            <span>
              <FontAwesomeIcon color={`${textColor}`} icon={faLocationDot} />
            </span>
            <h3>{item.address ? item.address : "Não identificado"}</h3>
          </div>
          <div style={{ marginLeft: "1.15rem" }}>
            <div className={styles.flex}>
              <p>
                Início:{" "}
                <strong>
                  {" "}
                  {item.startTime
                    ? formatTime(item.startTime, "seconds")
                    : "Não identificado"}
                </strong>
              </p>
              <span
                style={{
                  height: "4px",
                  width: "4px",
                  borderRadius: "50%",
                  marginTop: "2px",
                  backgroundColor: `${textColor}`,
                }}
              ></span>
              <p>
                Fim:{" "}
                <strong>
                  {" "}
                  {item.startTime
                    ? formatTime(item.endTime, "seconds")
                    : "Não identificado"}
                </strong>
              </p>
            </div>
            <div className={styles.flex}>
              <p>
                Duração:{" "}
                <strong>
                  {" "}
                  {item.duration
                    ? formatNumericHours(item.duration, t)
                    : "Não identificado"}
                </strong>
              </p>
            </div>
            <div className={styles.flex}>
              <p>
                Dispositivo estava:{" "}
                <strong> {item.ignition ? "Ligado" : "Desligado"}</strong>
              </p>
            </div>
            {item.stopped === "INI" && (
              <div className={styles.flex}>
                <p style={{ color: 'green' }}>
                  <strong>Dispositivo estava na garagem*</strong>
                </p>
              </div>
            )}
          </div>

          <Button
            sx={{
              boxShadow: "0px 0px 4px 2px rgba(0,0,0,.1)",
              position: "absolute",
              right: "1rem",
              top: "1rem",
              height: "auto",
              backgroundColor,
              color: text,
              padding: ".4rem 1rem",
              fontSize: ".75rem",
              "&:hover": {
                backgroundColor: `${secondary}`,
              },
              display: "flex",
              gap: ".4rem",
            }}
            onClick={() => centerDevice(item, index)}
          >
            <FontAwesomeIcon icon={faMapLocationDot} size="lg" />
            Ver no mapa
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Stops;
