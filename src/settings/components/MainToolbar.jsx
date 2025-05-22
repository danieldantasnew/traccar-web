import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Toolbar,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    paddingRight: "0 !important",
  },
  filterPanel: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
  },
}));

const MainToolbar = ({ keyword, setKeyword, filter, setFilter }) => {
  const classes = useStyles();
  const devices = useSelector((state) => state.devices.items);
  const inputRef = useRef();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  return (
    <Toolbar className={classes.toolbar} style={{ minHeight: 0 }}>
      <OutlinedInput
        sx={{
          "&:hover": { boxShadow: "0px 0px 0px 2px white" },
          "&:focus-within": {
            outline: "1px solid white",
            backgroundColor: "white",
            boxShadow: "0px 0px 0px 2px white",
          },
        }}
        ref={inputRef}
        placeholder={"Procurar dispositivos"}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              edge="end"
              onClick={() => setFilterAnchorEl(inputRef.current)}
            >
              <Badge color="info" variant="dot" invisible={!filter}>
                <FontAwesomeIcon
                  icon={faSliders}
                  style={{ color: "#b3b3b3" }}
                />
              </Badge>
            </IconButton>
          </InputAdornment>
        }
        size="small"
        fullWidth
      />
      <Popover
        open={!!filterAnchorEl}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={classes.filterPanel}>
          <FormControl>
            <InputLabel>Filtrar por</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="">Nenhum</MenuItem>
              <MenuItem value="devicesOn">Dispositivos ligados</MenuItem>
              <MenuItem value="devicesOff">Dispositivos desligados</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Popover>
    </Toolbar>
  );
};

export default MainToolbar;
