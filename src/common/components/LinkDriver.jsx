import { faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const box = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const boxInfo1 = {
  display: "flex",
  gap: '.5rem',
  alignItems: "center",
}

const boxInfo2 = {
  display: "flex",
  flexDirection: 'column',
  alignItems: "flex-start",
  justifyContent: 'space-between',
  '& span': {
    fontSize: '.8rem',
    fontWeight: '500',
    lineHeight: '1rem'
  }
}

const icon = { backgroundColor: "#E0E0E0", padding: '8px', borderRadius: '50%', height: '36px', width: '36px', display: 'grid', alignItems: 'center', justifyContent: 'center' }

const LinkDriver = ({ device, bgColor, color, subColor }) => {
  return (
    <Box sx={box}>
      <Box sx={boxInfo1}>
        <Box style={icon}>
          <FontAwesomeIcon icon={faUserSlash} color="#676767"/>
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
        sx={{
          padding: "6px 12px",
          backgroundColor: `${bgColor}`,
          color: `${color}`,
          fontSize: '.85rem',
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
