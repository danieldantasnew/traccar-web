import { useDevices } from "../../Context/App";
import { Alert, Snackbar } from "@mui/material";

const SnackbarAlert = () => {
  const { alert, setAlert } = useDevices();
  return (
    <Snackbar
      open={alert}
      autoHideDuration={3000}
      onClose={() => setAlert(false)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ mr: 4 }}
    >
      <Alert
        variant="filled"
        severity="success"
        style={{ backgroundColor: "#388e3c", color: "white" }}
        size="md"
        onClose={() => setAlert(false)}
      >
        As alterações foram salvas
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
