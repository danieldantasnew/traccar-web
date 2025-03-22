import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const box = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const LinkDriver = ({ device, bgColor, subColor }) => {
  return (
    <Box sx={box}>
      <Box>
        <div style={{ backgroundColor: "#E0E0E0", padding: '6px', borderRadius: '50%' }}>
          <FontAwesomeIcon icon={faUserSlash} />
        </div>
        <Box>
            <Typography component={"h2"}>
                Motorista
            </Typography>
            <Typography component={"span"}>
                Não informado
            </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        sx={{
          padding: "6px",
          backgroundColor: `${bgColor}`,
          color: `#e0e0e0`,
          "&:hover": {
            color: "white",
            backgroundColor: `${subColor}`,
          },
        }}
        variant="contained"
      >
        Vincular Motorista
      </Button>
    </Box>
  );
};

export default LinkDriver;
