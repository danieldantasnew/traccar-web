import { Box, InputLabel } from "@mui/material";
import React, { useEffect, useState } from "react";

const ColorPicker = ({ label, value, setValue }) => {
    const [temporaryColor, setTemporaryColor] = useState(value);

    const handleChange = (event) => {
      setTemporaryColor(event.target.value);
    };
  
    const handleBlur = () => {
      setValue(temporaryColor);
    };

  useEffect(() => {
    setTemporaryColor(value);
  }, [value]);
  
  return (
    <Box component={"div"} key={label+'uniq329102'}>
      <InputLabel>{label}</InputLabel>
      <input
        type="color"
        name={label}
        id={label}
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </Box>
  );
};

export default ColorPicker;
