import { Box, Typography } from "@mui/material";
import DeviceEvent from "./DeviceEvent";
import { useSelector } from "react-redux";

const Events = ({ events, classes, t, colorIcon }) => {
  const reads = useSelector((state) => state.events.reads);
  const unreads = useSelector((state) => state.events.unreads);

  return (
    <>
      {Array.isArray(events) && events.length > 0 ? (
        <Box
          component={"section"}
          className={`${classes.drawer} ${classes.flexColumn}`}
        >
          {events.map((event) => {
            return (
              <DeviceEvent
                key={event.id}
                event={event}
                t={t}
                reads={reads}
                unreads={unreads}
                colorIcon={colorIcon}
                classes={classes}
              />
            );
          })}
        </Box>
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "1.1rem",
          }}
        >
          Sem notificações
        </Typography>
      )}
    </>
  );
};

export default Events;
