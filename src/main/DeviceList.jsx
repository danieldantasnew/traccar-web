import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import { devicesActions } from "../store";
import { useEffectAsync } from "../reactHelper";
import DeviceRow from "./DeviceRow";
import { Box } from "@mui/material";
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';

const useStyles = makeStyles((theme) => ({
  groupTitle: {
    fontSize: ".8rem",
    padding: "8px 16px",
    backgroundColor: "#e3e3e3",
    fontWeight: "600",
    margin: ".3rem 0",
    display: "flex",
    alignItems: "center",
    gap: ".2rem",
  },
  list: {
    maxHeight: "100%",
  },
  listInner: {
    position: "relative",
    margin: theme.spacing(1.5, 0),
  },
}));

const DeviceList = ({ devices, filteredPositions }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const listInnerEl = useRef(null);
  const groups = useSelector((state) => state.groups.items);
  const [deviceGroup, setDeviceGroup] = useState(null);

  if (listInnerEl.current) {
    listInnerEl.current.className = classes.listInner;
  }

  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffectAsync(async () => {
    const response = await fetch("/api/devices");
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, []);

  useEffect(() => {
    if (devices) {
      const phrase = "Sem Grupo".toUpperCase();
      const groupedDevices = devices.reduce((acc, device) => {
        const nameGroup = groups[device.groupId]
          ? groups[device.groupId].name.toUpperCase()
          : phrase;

        if (!acc[nameGroup]) {
          acc[nameGroup] = [];
        }

        acc[nameGroup].push({ ...device, nameGroup });

        return acc;
      }, {});

      const groupedDevicesArray = Object.entries(groupedDevices).map(
        ([name, devices]) => ({
          name,
          devices,
        })
      );

      const newArray = groupedDevicesArray.sort((prev, current) => {
        if (current.name !== phrase) {
          return 1;
        }
        return -1;
      });

      setDeviceGroup(newArray);
    }
  }, [devices]);

  if (!deviceGroup) return null;

  return (
    <div className={classes.list}>
      {deviceGroup.map((group) => (
        <div key={group.name}>
          <Box component={"h4"} className={classes.groupTitle}>
            <LayersRoundedIcon sx={{ color: "#a9a9a9" }}/>
            {group.name}
          </Box>
          <div className={classes.deviceList}>
            {group.devices.map((device) => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceList;
