import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import AddressValue from "./AddressValue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStreetView } from "@fortawesome/free-solid-svg-icons";
import { DynamicIconsComponent } from "./DynamicIcons";

const handleCopyAddress = (copiedAddress, setAlertCopied, timeOutAlert) => {
  if (copiedAddress) {
    navigator.clipboard.writeText(copiedAddress);
    setAlertCopied(true);
    if (timeOutAlert.current) {
      clearTimeout(timeOutAlert.current);
    }
    timeOutAlert.current = setTimeout(() => {
      setAlertCopied(false);
    }, 3000);
  }
};

const AddressComponent = ({ position, t, labelAdress="Endereço atual" }) => {
  const timeOutAlert = useRef();
  const [copiedAddress, setAddress] = useState(null);
  const [alertCopied, setAlertCopied] = useState(false);

  return (
    <Box style={{ margin: ".8rem 0" }}>
      <Snackbar
        open={alertCopied}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mr: 4 }}
      >
        <Alert
          variant="filled"
          severity="success"
          style={{ backgroundColor: "#0288d1", color: "white" }}
          size="md"
          onClose={() => setAlertCopied(false)}
        >
          Endereço copiado para área de transferência
        </Alert>
      </Snackbar>
      <h4 style={{ fontSize: ".75rem", fontWeight: 500, margin: 0 }}>
        {labelAdress}
      </h4>
      {position && (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            style={{
              maxWidth: "340px",
              margin: 0,
              fontSize: ".95rem",
              fontWeight: 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <AddressValue
              latitude={position.latitude}
              longitude={position.longitude}
              originalAddress={position.address}
              setStateAddress={setAddress}
            />
          </Typography>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip
              arrow
              title={"Copiar endereço"}
              onClick={() =>
                handleCopyAddress(copiedAddress, setAlertCopied, timeOutAlert)
              }
            >
              <IconButton component="a">
                <DynamicIconsComponent
                  category={"copy"}
                  style={{
                    border: "1px solid transparent",
                    color: "#6D6D6D",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("linkStreetView")} arrow>
              <IconButton
                component="a"
                target="_blank"
                href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}
                style={{ border: "1px solid transparent" }}
              >
                <FontAwesomeIcon icon={faStreetView} color="orange" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AddressComponent;
