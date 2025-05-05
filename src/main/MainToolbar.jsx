import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Badge,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "../common/components/LocalizationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSliders } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    flexDirection: "column",
    gap: '1rem',
    padding: "0 16px",
  },
  filterPanel: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
  },
  buttonStyle: {
    border: "1px solid white",
    ["&:hover"]: {
      backgroundColor: 'rgba(255, 255, 255, 0.58)'
    }
  },
}));

const MainToolbar = ({
  keyword,
  setKeyword,
  filter,
  setFilter,
  filterSort,
  setFilterSort,
  filterMap,
  setFilterMap,
  phraseGroup,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();
  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const inputRef = useRef();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const deviceStatusCount = (status) =>
    Object.values(devices).filter((d) => d.status === status).length;

  return (
    <Toolbar className={classes.toolbar}>
      <OutlinedInput
        sx={{
          "&:focus-within": { outline: "1px solid white" },
        }}
        ref={inputRef}
        placeholder={t("sharedSearchDevices")}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              edge="end"
              onClick={() => setFilterAnchorEl(inputRef.current)}
            >
              <Badge
                color="info"
                variant="dot"
                invisible={!filter.statuses.length && !filter.groups.length}
              >
                <FontAwesomeIcon icon={faSliders} style={{color: '#b3b3b3'}}/>
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
            <InputLabel>{t("deviceStatus")}</InputLabel>
            <Select
              label={t("deviceStatus")}
              value={filter.statuses}
              onChange={(e) =>
                setFilter({ ...filter, statuses: e.target.value })
              }
              multiple
            >
              <MenuItem value="online">{`${t(
                "deviceStatusOnline"
              )} (${deviceStatusCount("online")})`}</MenuItem>
              <MenuItem value="offline">{`${t(
                "deviceStatusOffline"
              )} (${deviceStatusCount("offline")})`}</MenuItem>
              <MenuItem value="unknown">{`${t(
                "deviceStatusUnknown"
              )} (${deviceStatusCount("unknown")})`}</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>{t("settingsGroups")}</InputLabel>
            <Select
              label={t("settingsGroups")}
              value={filter.groups}
              onChange={(e) => setFilter({ ...filter, groups: e.target.value })}
              multiple
            >
              <MenuItem key="no-group" value="no-group">
                {phraseGroup}
              </MenuItem>
              {Object.values(groups)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>{t("sharedSortBy")}</InputLabel>
            <Select
              label={t("sharedSortBy")}
              value={filterSort}
              onChange={(e) => setFilterSort(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">{"\u00a0"}</MenuItem>
              <MenuItem value="name">{t("sharedName")}</MenuItem>
              <MenuItem value="lastUpdate">{t("deviceLastUpdate")}</MenuItem>
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterMap}
                  onChange={(e) => setFilterMap(e.target.checked)}
                />
              }
              label={t("sharedFilterMap")}
            />
          </FormGroup>
        </div>
      </Popover>
      <Button
        className={classes.buttonStyle}
        onClick={() => navigate("/settings/device")}
        variant="contained"
        endIcon={<FontAwesomeIcon size="xs" icon={faPlus} />}
      >
        Adicionar Veículo
      </Button>
    </Toolbar>
  );
};

export default MainToolbar;
