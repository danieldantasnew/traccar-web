import { Button } from "@mui/material";
import { useDevices } from "../../Context/App";

const SaveButton = ({ children, onClick, ...props }) => {
  const { setAlert } = useDevices();
  return (
    <Button
      onClick={(e) => {
        onClick(e);
        setAlert(true);
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SaveButton;
