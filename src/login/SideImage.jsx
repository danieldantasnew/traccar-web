import { Box, useMediaQuery, useTheme } from "@mui/material";
import Map from "/Map.svg";
import MapLarge from "/Maplarge.svg";
import { DynamicIconsComponent } from "../../src/common/components/DynamicIcons";

const SideImage = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          left: "1rem",
          top: "1rem",
          width: "160px",
          height: "auto",
          [theme.breakpoints.down("lg")]: {
            width: "100px !important",
            top: ".5rem",
            left: ".5rem",
          },
        }}
      >
        <DynamicIconsComponent
          category="logo"
          color="#2C76AC"
          style={{
            position: "absolute",
            left: ".2rem",
            top: ".2rem",
            width: "100px",
            height: "auto",
          }}
        />
      </Box>
      <img
        src={isTablet ? MapLarge : Map}
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
