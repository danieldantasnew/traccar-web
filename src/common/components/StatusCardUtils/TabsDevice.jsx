import React, { useState } from "react";
import AddressComponent from "../AddressComponent";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faMapPin,
  faRoute,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import StatusCardDetails from "./StatusCardDetails";
import { Box, Slide, Tab, Typography } from "@mui/material";
import LinkDriver from "./LinkDriver";

const TabsDevice = ({ device, position, t }) => {
  if (!device) return null;

  const [tabValue, setTabValue] = useState("tab1");
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const attributes = device?.attributes || {};
  const { background, text, secondary } = attributes?.deviceColors || {background: "black", icon: "red", text: "white", secondary: "blue"};
  
  return (
    <TabContext value={tabValue}>
      <Box sx={{ maxWidth: "100%", backgroundColor: `${background}` }}>
        <TabList
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontSize: ".75rem",
              textTransform: "none",
              color: `${secondary}`,
              minHeight: "initial",
            },
            "& .MuiTab-root.Mui-selected": {
              color: `${text}`,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: `${text}`,
            },
            "& button": {
              padding: ".5rem 0",
            },
          }}
        >
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faFileLines} />}
            iconPosition="top"
            label="Resumo do Dia"
            value="tab1"
          />
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faRoute} />}
            iconPosition="top"
            label="Rota"
            value="tab2"
          />
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faMapPin} />}
            iconPosition="top"
            label="Destinos Próximos"
            value="tab3"
          />
          <Tab
            icon={<FontAwesomeIcon size="lg" icon={faTerminal} />}
            iconPosition="top"
            label="Comandos"
            value="tab4"
          />
        </TabList>
      </Box>
      <Slide direction="right" in={tabValue === "tab1"} mountOnEnter unmountOnExit>
        <TabPanel value="tab1" sx={{ padding: ".7rem .5rem", height: '100%' }}>
          {position ?(
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '.8rem', justifyContent: 'space-between',  height: '100%'}}>
              <Box sx={{maxHeight: "264px", overflow: 'auto'}}>
                <AddressComponent position={position} t={t} />
                <StatusCardDetails position={position} device={device} />
              </Box>
              <LinkDriver device={device} background={background} secondary={secondary} text={text} />
            </Box>
          ): <Typography>Nada por aqui...</Typography>}
        </TabPanel>
      </Slide>
      <Slide direction="left" in={tabValue === "tab2"} mountOnEnter unmountOnExit>
        <TabPanel value="tab2" sx={{ padding: "0 .7rem", marginTop: ".8rem" }}>
          Nada por aqui...
        </TabPanel>
      </Slide>
      <Slide direction="left" in={tabValue === "tab3"} mountOnEnter unmountOnExit>
        <TabPanel value="tab3" sx={{ padding: "0 .7rem", marginTop: ".8rem" }}>
          Nada por aqui...
        </TabPanel>
      </Slide>
      <Slide direction="left" in={tabValue === "tab4"} mountOnEnter unmountOnExit>
        <TabPanel value="tab4" sx={{ padding: "0 .7rem", marginTop: ".8rem" }}>
          Nada por aqui...
        </TabPanel>
      </Slide>
    </TabContext>
  );
};

export default TabsDevice;
