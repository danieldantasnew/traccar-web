import { Box, Tooltip } from "@mui/material";
import InfoCar from "../../common/components/InfoCar";
import AddressComponent from "../../common/components/AddressComponent";
import LinkDriver from "../../common/components/LinkDriver";
import AttributesOfDevice from "../../common/components/AttributesOfDevice";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  allDevices: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    rowGap: "2rem",
    columnGap: "1rem",
    paddingBottom: "1rem",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(1,1fr)",
    },
    [theme.breakpoints.up("xl")]: {
      gridTemplateColumns: "repeat(3,1fr)",
    },
  },
  device: {
    boxShadow: "0px 0px 4px 0px rgba(0,0,0,.5)",
    borderRadius: ".5rem",
    position: "relative",
    display: "flex",
    flexDirection: "column"
  },
  infoInDevice: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    gap: "2rem",
    padding: "1rem",
  },
  infoCar: {
    padding: "1.4rem 1rem",
    "& h2": {
      fontSize: ".8rem !important",
    },
    "& p": {
      fontSize: ".82rem !important",
    },
  },
  avatarCSS: {
    "& > div:first-of-type": {
      "& div": {
        height: "3.1rem",
        width: "3.1rem",
      },
      "& span": {
        height: "2rem",
        width: "2rem",
      },
    },
  },
  powers: {
    position: "absolute",
    top: -12,
    right: -6,
    height: "2rem",
    width: "2rem",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
}));

const DevicesInPanel = ({ filteredDevices, filteredPositions }) => {
  const classes = useStyles();

  if (
    !Array.isArray(filteredDevices) ||
    filteredDevices.length == 0 ||
    !Array.isArray(filteredPositions) ||
    filteredPositions.length == 0
  )
    return null;

  return (
    <Box className={classes.allDevices}>
      {filteredDevices.map((device) => {
        if(device.status === "offline") return null;
        return (
          <Box key={device.id} className={classes.device}>
            <InfoCar
              device={device}
              className={classes.infoCar}
              avatarCSS={classes.avatarCSS}
            />
            <Box className={classes.infoInDevice}>
              <Box>
                {filteredPositions.map((position) => {
                  if (device.id === position.deviceId) {
                    return (
                      <Box key={`${device.id + position.deviceId}`}>
                        {position?.attributes?.ignition ||
                        position?.attributes?.motion ? (
                          <Tooltip
                            title="Dispositivo está ligado"
                            arrow
                            placement="top"
                          >
                            <Box
                              className={classes.powers}
                              sx={{ backgroundColor: "#4CAF50" }}
                            >
                              <FontAwesomeIcon
                                icon={faPowerOff}
                                color="white"
                              />
                            </Box>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title="Dispositivo está desligado"
                            arrow
                            placement="top"
                          >
                            <Box
                              className={classes.powers}
                              sx={{ backgroundColor: "#FF0000" }}
                            >
                              <FontAwesomeIcon
                                icon={faPowerOff}
                                color="white"
                              />
                            </Box>
                          </Tooltip>
                        )}
                        <AddressComponent
                          position={position}
                          style={{ margin: 0 }}
                        />
                        <AttributesOfDevice position={position} />
                      </Box>
                    );
                  }
                  return null;
                })}
              </Box>
              <LinkDriver device={device} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default DevicesInPanel;
