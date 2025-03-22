import React, { useState } from "react";
import AddressComponent from "./AddressComponent";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faMapPin,
  faRoute,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import StatusCardDetails from "./StatusCardDetails";
import { Box, Slide, Tab } from "@mui/material";
import LinkDriver from "./LinkDriver";

const TabsDevice = ({ device, position, t }) => {
  if (!device) return null;

  const [tabValue, setTabValue] = useState("1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const attributes = device.attributes || {};
  const reportColor = attributes["web.reportColor"]
    ? attributes["web.reportColor"].split(";")
    : ["rgb(189, 12, 18)", "rgb(189, 12, 18)"];

  const bgColor = reportColor[0];
  const color = reportColor[1];
  const subColor = reportColor[2];

  return (
    <TabContext value={tabValue}>
      <Box sx={{ maxWidth: "100%", backgroundColor: `${bgColor}` }}>
        <TabList
          onChange={handleChange}
          indicatorColor="primary"
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontSize: ".8rem",
              textTransform: "none",
              color: `${subColor}`,
              minHeight: "initial",
            },
            "& .MuiTab-root.Mui-selected": {
              color: `${color}`,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: `${color}`,
            },
            "& button": {
              padding: ".5rem 0",
            },
          }}
        >
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faFileLines} />}
            iconPosition="top"
            label="Resumo"
            value="1"
          />
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faRoute} />}
            iconPosition="top"
            label="Rota"
            value="2"
          />
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faMapPin} />}
            iconPosition="top"
            label="Destinos Próximos"
            value="3"
          />
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faTerminal} />}
            iconPosition="top"
            label="Comandos"
            value="4"
          />
        </TabList>
      </Box>
      <Slide direction="left" in={tabValue === "1"} mountOnEnter unmountOnExit>
        <TabPanel value="1" sx={{ padding: "0 .5rem", marginTop: ".5rem" }}>
          {position && (
            <Box>
              <AddressComponent position={position} t={t} />
              <StatusCardDetails position={position} device={device} />
              <LinkDriver device={device} bgColor={bgColor} subColor={subColor} />
            </Box>
          )}
        </TabPanel>
      </Slide>
      <Slide direction="left" in={tabValue === "2"} mountOnEnter unmountOnExit>
        <TabPanel value="2" sx={{ padding: "0 .5rem", marginTop: ".8rem" }}>
          Nada por aqui...
        </TabPanel>
      </Slide>
      <Slide direction="left" in={tabValue === "3"} mountOnEnter unmountOnExit>
        <TabPanel value="3" sx={{ padding: "0 .5rem", marginTop: ".8rem" }}>
          Nada por aqui...
        </TabPanel>
      </Slide>
      <Slide direction="left" in={tabValue === "4"} mountOnEnter unmountOnExit>
        <TabPanel value="4" sx={{ padding: "0 .5rem", marginTop: ".8rem" }}>
          Nada por aqui...
        </TabPanel>
      </Slide>
    </TabContext>
  );
};

export default TabsDevice;
