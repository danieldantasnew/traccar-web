import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import { devicesActions } from "../store";
import { useEffectAsync } from "../reactHelper";
import DeviceRow from "./DeviceRow";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  accordion: {
    boxShadow: "none",
    margin: "0 !important",
  },
  summary: {
    backgroundColor: "#f3f3f3f3 !important",
    padding: "0 8px !important",
    minHeight: "1rem !important",
    maxHeight: "3.4rem",
  },
  accordionDetails: {
    width: "100%",
    padding: "8px 0 !important",
  },
  groupTitle: {
    fontSize: ".8rem",
    padding: "8px 16px",
    fontWeight: "600",
    margin: ".3rem 0",
    display: "flex",
    alignItems: "center",
    gap: ".4rem",
    width: "100%",
  },
  list: {
    maxHeight: "100%",
    height: "100%",
    overflow: "auto"
  },
  listInner: {
    position: "relative",
    margin: theme.spacing(1.5, 0),
  },
}));

const DeviceList = ({ devices, style, phraseGroup, setStatusCardOpen, setDevicesOpen }) => {
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
      const phrase = phraseGroup.toUpperCase();
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
    <div className={classes.list} style={style}>
      {deviceGroup.map((group) => (
        <Accordion
          key={group.name}
          className={classes.accordion}
          defaultExpanded
        >
          <AccordionSummary
            className={classes.summary}
            expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
          >
            <Box component={"h4"} className={classes.groupTitle}>
              <FontAwesomeIcon icon={faLayerGroup} size="lg" style={{ color: "#a9a9a9"}}/>
              {group.name}
            </Box>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            {group.devices.map((device) => (
              <DeviceRow key={device.id} device={device} setDevicesOpen={setDevicesOpen} setStatusCardOpen={setStatusCardOpen}/>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default DeviceList;
