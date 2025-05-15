import { Button } from "@mui/material";
import { useDevices } from "../../Context/App";

const SaveButton = ({ children, onClick, className, ...props }) => {
  const { setAlert } = useDevices();
  return (
    <Button
      onClick={(e) => {
        onClick(e);
        setAlert(true);
      }}
      sx={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SaveButton;
