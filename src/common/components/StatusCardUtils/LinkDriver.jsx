import {
  faClose,
  faUser,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import SaveButton from "../SaveButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCatch } from "../../../reactHelper";

const box = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const boxInfo1 = {
  display: "flex",
  gap: ".5rem",
  alignItems: "center",
};

const boxInfo2 = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  "& span": {
    fontSize: ".8rem",
    fontWeight: "500",
    lineHeight: "1rem",
  },
};

const icon = {
  backgroundColor: "#E0E0E0",
  padding: "8px",
  borderRadius: "50%",
  height: "36px",
  width: "36px",
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
};

const LinkDriver = ({ device, background, text, secondary }) => {
  const [modalSelectDriver, setModalSelectDriver] = useState(false);
  const [driverSelect, setDriverSelect] = useState("");
  const drivers = useSelector((state) => state.drivers.items);

  const handleChange = (e, key) => {
    setDriverSelect(key);
  };

  const handleLink = useCatch(async () => {
    try {
      if (drivers[driverSelect] && device) {
        const response = await fetch("/api/permissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: device.id,
            driverId: drivers[driverSelect].id,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Erro: ${response.status}`);
        }

      }
    } catch (error) {
      console.error("Erro ao associar:", error);
      throw error;
    }
  });

  return (
    <Box sx={box}>
      <Box sx={boxInfo1}>
        <Box style={icon}>
          <FontAwesomeIcon icon={faUserSlash} color="#676767" />
        </Box>
        <Box sx={boxInfo2}>
          <Typography component={"span"} color="#676767">
            Motorista
          </Typography>
          <Typography component={"span"} color="#989898">
            Não informado
          </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        onClick={() => setModalSelectDriver(true)}
        sx={{
          padding: "6px 12px",
          backgroundColor: `${background}`,
          color: `${text}`,
          fontSize: ".85rem",
          "&:hover": {
            color: `${text}`,
            backgroundColor: `${secondary}`,
          },
        }}
        variant="contained"
      >
        Vincular Motorista
      </Button>
      <Modal
        open={modalSelectDriver}
        onClose={() => setModalSelectDriver(false)}
        aria-describedby="Selecionar motorista"
      >
        <Card
          sx={{
            maxWidth: "400px",
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: ".5rem",
              padding: "1rem",
              backgroundColor: `${background}`,
              color: `${text}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: ".5rem",
                color: "white",
                flex: 1,
              }}
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
              <Box component={"h3"} sx={{ margin: 0 }}>
                Vincular Motorista
              </Box>
            </Box>
            <IconButton
              onClick={() => setModalSelectDriver(false)}
              aria-label="Fechar janela de vincular motorista"
              sx={{ width: "1rem", height: "1rem", padding: "1rem" }}
            >
              <FontAwesomeIcon icon={faClose} color="white" />
            </IconButton>
          </Box>
          <CardContent>
            <FormControl fullWidth variant="standard">
              <InputLabel id="select-driver-label">Motorista</InputLabel>
              <Select
                labelId="select-driver-label"
                value={driverSelect}
                onChange={(e) => handleChange(e, e.target.value)}
                sx={{
                  borderRadius: "4px",
                  paddingY: "6px",
                  paddingX: "6px",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "black",
                  "& .MuiSelect-select": {
                    padding: "10px 12px",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${background}`,
                  },
                }}
              >
                <MenuItem value="">Selecionar motorista</MenuItem>
                {Object.entries(drivers).map(([key, driver]) => (
                  <MenuItem key={driver.id} value={key}>
                    {driver.name}
                  </MenuItem>
                ))}
              </Select>

              <SaveButton
                onClick={handleLink}
                className={{
                  marginTop: "2rem",
                  backgroundColor: background,
                  color: text,
                  "&:hover": {
                    backgroundColor: secondary,
                  },
                }}
              >
                Vincular
              </SaveButton>
            </FormControl>
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
};

export default LinkDriver;
