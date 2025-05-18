import { Box } from "@mui/material";
import Map from "/Map.svg";
import { DynamicIconsComponent } from "../../src/common/components/DynamicIcons";

const SideImage = () => {
  return (
    <Box sx={{ width: "100%", height: "100%", position: 'relative' }}>
      <DynamicIconsComponent
        category="logo"
        color="#2C76AC"
        style={{
          position: "absolute",
          left: '2.6rem',
          top: '2rem',
          width: "160px",
          height: "auto",
        }}
      />
      <img
        src={Map}
        alt=""
        style={{
          objectFit: "cover",
          objectPosition: "top",
          width: "100%",
          height: "100%",
          borderRadius: "12px",
        }}
      />
    </Box>
  );
};

export default SideImage;
