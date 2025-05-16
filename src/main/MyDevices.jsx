import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Box, IconButton, Paper, Slide, Tooltip } from "@mui/material";
import MainToolbar from "./MainToolbar";
import DeviceList from "./DeviceList";
import { DynamicIconsComponent } from "../common/components/DynamicIcons.jsx";
import { useDevices } from "../Context/App.jsx";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  sidebar: {
    backgroundColor: "#ffff",
    pointerEvents: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "auto",
    position: "fixed",
    width: "auto",
    left: 12,
    top: "50%",
    borderRadius: "44px",
    transform: "translateY(-50%)",
    margin: 0,
    zIndex: 5,
    padding: "8px",
  },
  sidebarLayout: {
    pointerEvents: "auto",
    zIndex: 6,
  },
  allDevices: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    width: "28vw",
    minWidth: "336px",
    maxWidth: "480px",
    zIndex: "6",
    ["& h3"]: {
      margin: 0,
      padding: "0 1rem",
      fontSize: "1.6rem",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: ".5rem",
      ["& svg"]: {
        width: "32px",
        height: "32px",
        ["& path"]: {
          fill: "white",
        },
      },
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: "initial",
      zIndex: 60,
    },
  },
  devices: {
    display: "grid",
    maxHeight: "100% !important",
    height: "100% !important",
    overflow: "auto",
    width: "100%",
  },
  contentMap: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
  },
  contentList: {
    pointerEvents: "auto",
    gridArea: "1 / 1",
    maxHeight: "100%",
    zIndex: 4,
  },
  mediaButton: {
    color: "white",
  },
}));

const MyDevices = ({
  keyword,
  filter,
  filterSort,
  filterMap,
  filteredDevices,
  setKeyword,
  setFilter,
  setFilterSort,
  setFilterMap,
  desktop,
}) => {
  const phraseGroup = "OUTROS";
  const classes = useStyles();
  const {
    devicesOpen,
    heightMenuNavMobile,
    setDevicesOpen,
    setStatusCardOpen,
  } = useDevices();
  return (
    <Slide direction="right" in={devicesOpen} timeout={200}>
      <Paper
        square
        className={classes.allDevices}
        style={
          !desktop
            ? { height: `calc(100% - ${heightMenuNavMobile}px)` }
            : { height: "100%" }
        }
      >
        <Box
          component={"div"}
          sx={{
            backgroundColor: `#2C76AC`,
            padding: "1rem 0 .3rem 0 ",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Box
            component={"div"}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box component={"h3"}>
              <DynamicIconsComponent category={"carGroup"} />
              Meus Veículos
              <Badge
                  badgeContent={filteredDevices.length}
                  sx={{
                    top: 2,
                    right: -10,
                    "& .MuiBadge-badge": {
                      backgroundColor: "white",
                      color: "#2C76AC",
                      fontSize: ".75rem",
                      fontWeight: 500,
                      padding: 0,
                    },
                  }}
                />
            </Box>
            <Tooltip title="Fechar" arrow placement="right">
              <IconButton
                onClick={() => setDevicesOpen(!devicesOpen)}
                onTouchStart={() => setDevicesOpen(!devicesOpen)}
                sx={{ height: "2rem", width: "2rem", marginRight: ".5rem" }}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className={classes.mediaButton}
                  size="lg"
                />
              </IconButton>
            </Tooltip>
          </Box>
          <MainToolbar
            filteredDevices={filteredDevices}
            keyword={keyword}
            setKeyword={setKeyword}
            filter={filter}
            setFilter={setFilter}
            filterSort={filterSort}
            setFilterSort={setFilterSort}
            filterMap={filterMap}
            setFilterMap={setFilterMap}
            phraseGroup={phraseGroup}
          />
        </Box>
        <Box className={classes.devices}>
          <Paper square className={classes.contentList}>
            <DeviceList
              devices={filteredDevices}
              setStatusCardOpen={setStatusCardOpen}
              setDevicesOpen={setDevicesOpen}
              phraseGroup={phraseGroup}
            />
          </Paper>
        </Box>
      </Paper>
    </Slide>
  );
};

export default MyDevices;
