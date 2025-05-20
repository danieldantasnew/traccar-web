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
import SaveButton from "./SaveButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCatch } from "../../reactHelper";
import { devicesActions } from "../../store";

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

const LinkDriver = ({ device }) => {
  const dispatch = useDispatch();
  const [modalSelectDriver, setModalSelectDriver] = useState(false);
  const [driverSelect, setDriverSelect] = useState("");
  const drivers = useSelector((state) => state.drivers.items);
  const [currentDriver, setCurrentDriver] = useState(null);
  const attributes = device?.attributes || {};
  const { background, text, secondary } = attributes?.deviceColors || {
    background: "black",
    icon: "red",
    text: "white",
    secondary: "blue",
  };

  const handleChange = (e) => {
    setDriverSelect(e.target.value);
  };

  const handleUpdateDevice = async () => {
    const response = await fetch(`/api/devices/${device.id}`);
    if (response.ok) {
      dispatch(devicesActions.updateUniqueItem(await response.json()));
    } else {
      throw Error(await response.text());
    }
  };

  const handleLink = useCatch(async () => {
    setModalSelectDriver(false);
    try {
      const selectedDriver = drivers[driverSelect];
      if (!selectedDriver || !device) return;

      const responsePermission = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: device.id,
          driverId: selectedDriver.id,
        }),
      });

      if (!responsePermission.ok) {
        const errorText = await responsePermission.text();
        throw new Error(
          errorText || `Erro na permissão: ${responsePermission.status}`
        );
      }

      const responseUpdate = await fetch(`/api/devices/${device.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...device,
          attributes: {
            ...(device.attributes || {}),
            driverUniqueId: Number(selectedDriver.uniqueId),
          },
        }),
      });

      if (!responseUpdate.ok) {
        const errorText = await responseUpdate.text();
        throw new Error(
          errorText || `Erro ao atualizar device: ${responseUpdate.status}`
        );
      }
      handleUpdateDevice();
    } catch (error) {
      console.error("Erro ao associar motorista:", error);
      throw error;
    }
  });

  const handleRemove = useCatch(async () => {
    setModalSelectDriver(false);
    try {
      if (!device) return;

      const responseUpdate = await fetch(`/api/devices/${device.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...device,
          attributes: {
            ...(device.attributes || {}),
            driverUniqueId: null,
          },
        }),
      });

      if (!responseUpdate.ok) {
        const errorText = await responseUpdate.text();
        throw new Error(
          errorText || `Erro ao atualizar device: ${responseUpdate.status}`
        );
      }
      handleUpdateDevice();
    } catch (error) {
      console.error("Erro ao desassociar motorista:", error);
      throw error;
    }
  });

  useEffect(() => {
    const uniqueId = device?.attributes?.driverUniqueId;
    const driver = uniqueId ? drivers?.[uniqueId] : null;

    if (driver) {
      setCurrentDriver(driver);
      setDriverSelect(driver.uniqueId);
    } else {
      setCurrentDriver(null);
      setDriverSelect("");
    }
  }, [drivers, device]);

  useEffect(() => {
    if (currentDriver) setDriverSelect(currentDriver.uniqueId);
  }, [currentDriver]);

  return (
    <Box sx={box}>
      <Box sx={boxInfo1}>
        <Box style={icon}>
          <FontAwesomeIcon
            icon={currentDriver ? faUser : faUserSlash}
            color="#676767"
          />
        </Box>
        <Box sx={boxInfo2}>
          <Typography component={"span"} color="#676767">
            Motorista
          </Typography>
          <Typography component={"span"} color="#989898">
            {currentDriver ? `${currentDriver.name}` : "Não informado"}
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
        {currentDriver ? `Desvincular motorista` : "Vincular Motorista"}
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
                onChange={(e) => handleChange(e)}
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
                onClick={currentDriver ? handleRemove : handleLink}
                className={{
                  marginTop: "2rem",
                  backgroundColor: background,
                  color: text,
                  "&:hover": {
                    backgroundColor: secondary,
                  },
                }}
              >
                {currentDriver ? `Desvincular` : "Vincular"}
              </SaveButton>
            </FormControl>
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
};

export default LinkDriver;
