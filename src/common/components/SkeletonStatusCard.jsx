import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const SkeletonStatusCard = ({ classes, onClose }) => {
  const spacing = `.4rem .5rem`;
  return (
    <Box className={classes.contentCardTop}>
      <Box
        id="skeleton-media-card"
        className={classes.media}
        sx={{ backgroundColor: "#cacaca !important" }}
      >
        <Box component={"div"} className={classes.infoTop}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={102.78}
            height={40}
            sx={{ borderRadius: "8px" }}
          />
          <Tooltip
            title="Fechar"
            arrow
            placement="right"
            onClick={onClose}
            onTouchStart={onClose}
            className={classes.closeButton}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Tooltip>
        </Box>
        <Skeleton
          animation="wave"
          variant="rounded"
          width={103.97}
          height={40}
          sx={{
            position: "absolute",
            right: ".5rem",
            bottom: "1rem",
          }}
        />
      </Box>

      <Box
        id="skeleton-info-card"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: ".3rem",
          padding: spacing,
          backgroundColor: "#f3f3f3",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: ".4rem",
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              width={90}
              height={20}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={60}
              height={20}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: ".4rem",
          }}
        >
          <Skeleton animation="wave" variant="rounded" width={80} height={20} />
          <Skeleton animation="wave" variant="rounded" width={60} height={20} />
        </Box>
      </Box>
      <Box id="skeleton-tabs-card">
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{ width: "100%", height: "52px" }}
        />
      </Box>

      <Box
        id="skeleton-bottom-card"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box id="skeleton-statusCardDetails">
          <Box
            sx={{
              padding: spacing,
              display: "flex",
              flexDirection: "column",
              gap: ".4rem",
              marginTop: '.85rem',
            }}
          >
            <Typography
              component={"h2"}
              sx={{ fontSize: ".75rem", fontWeight: 500, margin: 0 }}
            >
              Endereço atual:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: ".4rem",
              }}
            >
              <Skeleton
                animation="wave"
                variant="rounded"
                width={260}
                height={20}
              />
              <Box sx={{ display: "flex", gap: ".3rem" }}>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={36}
                  height={36}
                />
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={36}
                  height={36}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              padding: spacing,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={"key" + index}
                animation="wave"
                variant="rounded"
                height={36}
              />
            ))}
          </Box>
        </Box>
        <Box
          id="skeleton-link-driver"
          sx={{
            padding: spacing,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ".3rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <Box>
              <Skeleton
                animation="wave"
                variant="circular"
                width={36}
                height={36}
              />
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: ".3rem" }}
            >
              <Skeleton
                animation="wave"
                variant="rounded"
                width={75}
                height={16}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width={90}
                height={16}
              />
            </Box>
          </Box>
          <Skeleton
            sx={{ padding: "6px 12px" }}
            variant="rounded"
            animation="wave"
            width={170}
            height={38}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonStatusCard;
