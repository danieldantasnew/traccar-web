import { Box, Skeleton } from '@mui/material'
import React from 'react'

const SkeletonStatusCard = ({classes}) => {
  return (
    <Box className={classes.contentCardTop}>
    <Box className={classes.media} sx={{ backgroundColor: "#cacaca !important" }}>
      <Box component={"div"} className={classes.infoTop}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={102.78}
          height={40}
          sx={{ borderRadius: "8px" }}
        />
        <Skeleton animation="wave" variant="circular" width={30} height={30} />
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
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: ".3rem",
        padding: ".4rem .5rem",
        backgroundColor: "#f3f3f3",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: ".4rem" }}
      >
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: ".4rem",
          }}
        >
          <Skeleton animation="wave" variant="rounded" width={90} height={20} />
          <Skeleton animation="wave" variant="rounded" width={60} height={20} />
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
    <Box>
      <Skeleton animation="wave" variant="rectangular" sx={{width: '100%', height: '52px'}} />
    </Box>
  </Box>
  )
}

export default SkeletonStatusCard