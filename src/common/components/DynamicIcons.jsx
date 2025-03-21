import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  svg: {
    height: "24px",
    width: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ["& svg"]: {
      height: "100%",
      width: "100%",
      ["& path"]: {
        fill: "currentColor",
      },
    },
  },
}));

export const DynamicIcons = (category) => {
  const icons = {
    car: `            
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512">
          <path fill="#ffffff" d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
        </svg>`,

    motorcycle: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24l57.7 0 16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7L64 128c-17.7 0-32 14.3-32 32l0 32 96 0c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32l70.4 0c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128l61.8 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-20.4 0c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21L280 32zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40l66.4 0C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104l-66.4 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>`,

    train: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 0C43 0 0 43 0 96L0 352c0 48 35.2 87.7 81.1 94.9l-46 46C28.1 499.9 33.1 512 43 512l39.7 0c8.5 0 16.6-3.4 22.6-9.4L160 448l128 0 54.6 54.6c6 6 14.1 9.4 22.6 9.4l39.7 0c10 0 15-12.1 7.9-19.1l-46-46c46-7.1 81.1-46.9 81.1-94.9l0-256c0-53-43-96-96-96L96 0zM64 128c0-17.7 14.3-32 32-32l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96zM272 96l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM64 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm288-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`,

    bus: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z"/></svg>`,

    animal: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5l0 1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3l0-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/></svg>`,

    bicycle: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M312 32c-13.3 0-24 10.7-24 24s10.7 24 24 24l25.7 0 34.6 64-149.4 0-27.4-38C191 99.7 183.7 96 176 96l-56 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l43.7 0 22.1 30.7-26.6 53.1c-10-2.5-20.5-3.8-31.2-3.8C57.3 224 0 281.3 0 352s57.3 128 128 128c65.3 0 119.1-48.9 127-112l49 0c8.5 0 16.3-4.5 20.7-11.8l84.8-143.5 21.7 40.1C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L375.4 48.8C369.8 38.4 359 32 347.2 32L312 32zM458.6 303.7l32.3 59.7c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-32.3-59.7c3.6-.6 7.4-.9 11.2-.9c39.8 0 72 32.2 72 72s-32.2 72-72 72s-72-32.2-72-72c0-18.6 7-35.5 18.6-48.3zM133.2 368l65 0c-7.3 32.1-36 56-70.2 56c-39.8 0-72-32.2-72-72s32.2-72 72-72c1.7 0 3.4 .1 5.1 .2l-24.2 48.5c-9 18.1 4.1 39.4 24.3 39.4zm33.7-48l50.7-101.3 72.9 101.2-.1 .1-123.5 0zm90.6-128l108.5 0L317 274.8 257.4 192z"/></svg>`,
    boat: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 16c0-7 4.5-13.2 11.2-15.3s13.9 .4 17.9 6.1l224 320c3.4 4.9 3.8 11.3 1.1 16.6s-8.2 8.6-14.2 8.6l-224 0c-8.8 0-16-7.2-16-16l0-320zM212.1 96.5c7 1.9 11.9 8.2 11.9 15.5l0 224c0 8.8-7.2 16-16 16L80 352c-5.7 0-11-3-13.8-8s-2.9-11-.1-16l128-224c3.6-6.3 11-9.4 18-7.5zM5.7 404.3C2.8 394.1 10.5 384 21.1 384l533.8 0c10.6 0 18.3 10.1 15.4 20.3l-4 14.3C550.7 473.9 500.4 512 443 512L133 512C75.6 512 25.3 473.9 9.7 418.7l-4-14.3z"/></svg>`,
    camper: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 112C0 67.8 35.8 32 80 32l336 0c88.4 0 160 71.6 160 160l0 160 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0-288 0c0 53-43 96-96 96s-96-43-96-96l-16 0c-44.2 0-80-35.8-80-80L0 112zM320 352l128 0 0-96-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l32 0 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 192zM96 128c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32L96 128zm96 336a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>`,
    ship: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M192 32c0-17.7 14.3-32 32-32L352 0c17.7 0 32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 128 44.4 14.8c23.1 7.7 29.5 37.5 11.5 53.9l-101 92.6c-16.2 9.4-34.7 15.1-50.9 15.1c-19.6 0-40.8-7.7-59.2-20.3c-22.1-15.5-51.6-15.5-73.7 0c-17.1 11.8-38 20.3-59.2 20.3c-16.2 0-34.7-5.7-50.9-15.1l-101-92.6c-18-16.5-11.6-46.2 11.5-53.9L96 240l0-128c0-26.5 21.5-48 48-48l48 0 0-32zM160 218.7l107.8-35.9c13.1-4.4 27.3-4.4 40.5 0L416 218.7l0-90.7-256 0 0 90.7zM306.5 421.9C329 437.4 356.5 448 384 448c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 501.7 417 512 384 512c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 437.2 165.1 448 192 448c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z"/></svg>`,
    helicopter: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M128 32c0-17.7 14.3-32 32-32L544 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L384 64l0 64 32 0c88.4 0 160 71.6 160 160l0 64c0 17.7-14.3 32-32 32l-160 0-64 0c-20.1 0-39.1-9.5-51.2-25.6l-71.4-95.2c-3.5-4.7-8.3-8.3-13.7-10.5L47.2 198.1c-9.5-3.8-16.7-12-19.2-22L5 83.9C2.4 73.8 10.1 64 20.5 64L48 64c10.1 0 19.6 4.7 25.6 12.8L112 128l208 0 0-64L160 64c-17.7 0-32-14.3-32-32zM384 320l128 0 0-32c0-53-43-96-96-96l-32 0 0 128zM630.6 425.4c12.5 12.5 12.5 32.8 0 45.3l-3.9 3.9c-24 24-56.6 37.5-90.5 37.5L256 512c-17.7 0-32-14.3-32-32s14.3-32 32-32l280.2 0c17 0 33.3-6.7 45.3-18.7l3.9-3.9c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`,
    person: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M160 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM126.5 199.3c-1 .4-1.9 .8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2s-25.8-23.7-20.2-40.5l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14c44.6 0 84.8 26.8 101.9 67.9L281 232.7l21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1L54.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z"/></svg>`,
    plane: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z"/></svg>`,
    trailer: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 32C21.5 32 0 53.5 0 80L0 336c0 26.5 21.5 48 48 48l17.1 0c7.8-54.3 54.4-96 110.9-96s103.1 41.7 110.9 96L488 384l8 0 112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-240c0-26.5-21.5-48-48-48L48 32zM80 96c8.8 0 16 7.2 16 16l0 131.2c-11.4 5.9-22.2 12.9-32 21L64 112c0-8.8 7.2-16 16-16zm96 128c-5.4 0-10.7 .2-16 .7L160 112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 112.7c-5.3-.5-10.6-.7-16-.7zm80 19.2L256 112c0-8.8 7.2-16 16-16s16 7.2 16 16l0 152.2c-9.8-8.1-20.6-15.2-32-21zM368 96c8.8 0 16 7.2 16 16l0 192c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-192c0-8.8 7.2-16 16-16zm112 16l0 192c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-192c0-8.8 7.2-16 16-16s16 7.2 16 16zM176 480a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-112a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>`,
    tram: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M86.8 48c-12.2 0-23.6 5.5-31.2 15L42.7 79C34.5 89.3 19.4 91 9 82.7S-3 59.4 5.3 49L18 33C34.7 12.2 60 0 86.8 0L361.2 0c26.7 0 52 12.2 68.7 33l12.8 16c8.3 10.4 6.6 25.5-3.8 33.7s-25.5 6.6-33.7-3.7L392.5 63c-7.6-9.5-19.1-15-31.2-15L248 48l0 48 40 0c53 0 96 43 96 96l0 160c0 30.6-14.3 57.8-36.6 75.4l65.5 65.5c7.1 7.1 2.1 19.1-7.9 19.1l-39.7 0c-8.5 0-16.6-3.4-22.6-9.4L288 448l-128 0-54.6 54.6c-6 6-14.1 9.4-22.6 9.4L43 512c-10 0-15-12.1-7.9-19.1l65.5-65.5C78.3 409.8 64 382.6 64 352l0-160c0-53 43-96 96-96l40 0 0-48L86.8 48zM160 160c-17.7 0-32 14.3-32 32l0 32c0 17.7 14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-128 0zm32 192a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>`,
    van: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 104l0 88 96 0 0-96L72 96c-4.4 0-8 3.6-8 8zm482 88L465.1 96 384 96l0 96 162 0zm-226 0l0-96-96 0 0 96 96 0zM592 384l-16 0c0 53-43 96-96 96s-96-43-96-96l-128 0c0 53-43 96-96 96s-96-43-96-96l-16 0c-26.5 0-48-21.5-48-48L0 104C0 64.2 32.2 32 72 32l120 0 160 0 113.1 0c18.9 0 36.8 8.3 49 22.8L625 186.5c9.7 11.5 15 26.1 15 41.2L640 336c0 26.5-21.5 48-48 48zm-64 0a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM160 432a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>`,
    truck: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L544 237.3l0 18.7-128 0 0-96zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>`,
    tractor: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 64c0-35.3 28.7-64 64-64L266.3 0c26.2 0 49.7 15.9 59.4 40.2L373.7 160 480 160l0-33.8c0-24.8 5.8-49.3 16.9-71.6l2.5-5c7.9-15.8 27.1-22.2 42.9-14.3s22.2 27.1 14.3 42.9l-2.5 5c-6.7 13.3-10.1 28-10.1 42.9l0 33.8 56 0c22.1 0 40 17.9 40 40l0 45.4c0 16.5-8.5 31.9-22.6 40.7l-43.3 27.1c-14.2-5.9-29.8-9.2-46.1-9.2c-39.3 0-74.1 18.9-96 48l-80 0c0 17.7-14.3 32-32 32l-8.2 0c-1.7 4.8-3.7 9.5-5.8 14.1l5.8 5.8c12.5 12.5 12.5 32.8 0 45.3l-22.6 22.6c-12.5 12.5-32.8 12.5-45.3 0l-5.8-5.8c-4.6 2.2-9.3 4.1-14.1 5.8l0 8.2c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-8.2c-4.8-1.7-9.5-3.7-14.1-5.8l-5.8 5.8c-12.5 12.5-32.8 12.5-45.3 0L40.2 449.1c-12.5-12.5-12.5-32.8 0-45.3l5.8-5.8c-2.2-4.6-4.1-9.3-5.8-14.1L32 384c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32l8.2 0c1.7-4.8 3.7-9.5 5.8-14.1l-5.8-5.8c-12.5-12.5-12.5-32.8 0-45.3l22.6-22.6c9-9 21.9-11.5 33.1-7.6l0-.6 0-32 0-96zm170.3 0L160 64l0 96 32 0 112.7 0L266.3 64zM176 256a80 80 0 1 0 0 160 80 80 0 1 0 0-160zM528 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm0 64c-48.6 0-88-39.4-88-88c0-29.8 14.8-56.1 37.4-72c14.3-10.1 31.8-16 50.6-16c2.7 0 5.3 .1 7.9 .3c44.9 4 80.1 41.7 80.1 87.7c0 48.6-39.4 88-88 88z"/></svg>`,
    scooter: `
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.8643 5.78336C13.5506 5.75093 13.1447 5.75 12.5279 5.75H12C11.5858 5.75 11.25 5.41422 11.25 5C11.25 4.58579 11.5858 4.25 12 4.25H12.5648H12.5648C13.1348 4.24998 13.6187 4.24997 14.0186 4.29132C14.4444 4.33534 14.8379 4.43094 15.2097 4.66071C15.5815 4.89048 15.843 5.19971 16.0728 5.56088C16.2754 5.87933 16.4785 6.2803 16.7135 6.75L17.8682 6.75C18.1521 6.74998 18.4127 6.74996 18.6298 6.76947C18.8645 6.79055 19.1203 6.83898 19.3679 6.98039C19.6395 7.13549 19.8645 7.36052 20.0196 7.63209C20.161 7.87968 20.2095 8.13549 20.2306 8.37017C20.2501 8.58733 20.25 8.84795 20.25 9.13178V9.16072L20.2501 9.22526C20.2507 9.48503 20.2514 9.76315 20.167 10.0271C20.1106 10.2039 20.0263 10.3706 19.9175 10.521C19.755 10.7454 19.5307 10.9098 19.3212 11.0634L19.2691 11.1016L18.9916 11.3061L19.4787 12.2803C21.3237 12.5153 22.75 14.0911 22.75 16C22.75 18.0711 21.0711 19.75 19 19.75C17.1858 19.75 15.6725 18.4617 15.325 16.75H10.175C9.82755 18.4617 8.31423 19.75 6.50002 19.75C4.68264 19.75 3.16722 18.4572 2.82323 16.7411C1.98372 16.6561 1.32191 15.9823 1.25541 15.1373C1.24992 15.0675 1.24996 14.992 1.25001 14.9193L1.25002 14.9L1.25001 14.8619C1.24999 14.5269 1.24998 14.3138 1.26466 14.1273C1.44798 11.798 3.29805 9.94796 5.62733 9.76464C5.81381 9.74997 6.02685 9.74998 6.36188 9.75H6.36191L6.40002 9.75L7.05201 9.75C7.95049 9.74997 8.69971 9.74995 9.29449 9.82991C9.92229 9.91432 10.4891 10.1 10.9446 10.5555C11.4 11.0109 11.5857 11.5777 11.6701 12.2055C11.7501 12.8003 11.75 13.5495 11.75 14.448V14.448L11.75 15.25H15.325C15.5973 13.9089 16.5851 12.8277 17.8727 12.4224L15.4348 7.54656C15.1589 6.99487 14.9766 6.6322 14.8073 6.36612C14.6473 6.1147 14.5326 6.00562 14.4211 5.93669C14.3096 5.86776 14.1608 5.81401 13.8643 5.78336Z"
            fill="black" />
        </svg>`,
    crane: `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M40-280v-160h328L120-636v116H40v-240h40l440 242v-282h200l200 240v280H820q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35q-50 0-85-35t-35-85H40Zm200 60q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm460 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM600-560h216L682-720h-82v160Z"/></svg>`,
    carGroup: `<svg width="32" height="32" viewBox="0 0 266 213" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.6143 0.769543C41.3477 2.50288 26.281 6.90288 15.2143 12.1029C-1.05233 19.5695 0.0143387 13.4362 0.0143387 95.0362V164.636L3.08101 168.236C5.48101 171.036 7.74767 171.97 13.081 172.503L20.0143 173.17V182.236C20.0143 189.836 20.5477 191.836 23.2143 195.036C26.1477 198.503 27.2143 198.77 36.0143 198.77C44.8143 198.77 45.881 198.503 48.8143 195.036C51.481 191.836 52.0143 189.836 52.0143 181.97V172.77H65.2143H78.281L78.9477 155.036C79.6143 134.503 81.881 127.836 91.2143 118.103C95.3477 113.836 97.881 109.57 99.881 103.57C101.348 98.7695 102.681 94.3695 102.681 93.8362C102.681 93.3029 98.8143 92.7695 94.0143 92.7695H85.3477V66.1029V39.4362H106.014C129.614 39.4362 131.214 40.1029 132.814 50.1029C133.481 54.5029 134.148 55.4362 135.881 54.6362C137.081 54.2362 142.681 53.4362 148.414 53.0362L158.681 52.3695V38.9029C158.681 21.1695 157.081 18.2362 143.081 11.8362C125.214 3.56954 110.548 0.63621 84.681 0.102876C72.281 -0.16379 58.281 0.102876 53.6143 0.769543ZM73.3477 66.1029V92.7695H53.2143C42.1477 92.7695 32.0143 92.2362 30.681 91.4362C29.3477 90.7695 27.6143 88.2362 26.8143 85.9695C24.9477 80.6362 24.9477 51.4362 26.681 46.5029C29.2143 39.9695 30.9477 39.4362 52.9477 39.4362H73.3477V66.1029ZM48.5477 129.036C51.6143 137.703 43.881 145.036 35.3477 141.57C27.6143 138.37 27.3477 127.303 35.081 124.103C40.5477 121.836 46.8143 124.103 48.5477 129.036Z" fill="black"/>
        <path d="M139.881 67.8359C133.481 70.2359 127.481 74.6359 124.014 79.4359C122.548 81.5692 118.281 91.9692 114.548 102.369C108.814 118.503 107.081 121.969 103.214 125.169C93.881 132.903 93.3477 135.436 93.3477 171.969C93.3477 204.503 93.3477 204.636 96.5477 208.369C99.481 211.836 100.548 212.103 109.348 212.103C118.148 212.103 119.214 211.836 122.148 208.369C124.814 205.169 125.348 203.169 125.348 195.303V186.103H179.348H233.348V195.303C233.348 203.169 233.881 205.169 236.548 208.369C239.481 211.836 240.548 212.103 249.348 212.103C258.148 212.103 259.214 211.836 262.148 208.369C265.348 204.636 265.348 204.503 265.348 171.969C265.348 135.436 264.814 132.903 255.481 125.169C251.614 121.969 249.881 118.503 244.148 102.236C236.548 80.9025 233.481 75.8359 224.281 70.5025L218.014 66.7692L181.348 66.5025C153.614 66.2359 143.481 66.6359 139.881 67.8359ZM212.014 94.1025C213.614 94.9025 215.748 99.5692 217.881 106.636C219.748 112.769 221.348 118.236 221.348 118.636C221.348 119.036 202.414 119.436 179.348 119.436C156.281 119.436 137.348 119.036 137.348 118.503C137.348 115.569 144.548 96.5025 146.281 94.7692C147.881 93.1692 153.481 92.7692 178.814 92.7692C196.814 92.7692 210.548 93.3025 212.014 94.1025ZM135.214 149.036C138.281 157.703 130.548 165.036 122.014 161.569C114.281 158.369 114.014 147.303 121.748 144.103C127.214 141.836 133.481 144.103 135.214 149.036ZM241.881 149.036C244.948 157.703 237.214 165.036 228.681 161.569C220.948 158.369 220.681 147.303 228.414 144.103C233.881 141.836 240.148 144.103 241.881 149.036Z" fill="black"/>
        </svg>`,
    copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"/></svg>`,
    bellExclamation: `<svg width="233" height="267" viewBox="0 0 233 267" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M108.193 2.10528C102.459 4.90528 99.9262 9.97195 99.9262 19.0386V26.2386L90.9928 29.0386C77.9262 33.0386 66.1928 40.5053 56.0595 51.3053C40.7261 67.7053 33.2595 86.5053 33.2595 108.639C33.2595 139.572 26.1928 161.439 9.52614 181.972C5.79281 186.505 2.19281 191.439 1.39281 192.905C-0.60719 196.772 -0.473856 203.305 1.92614 207.839C6.19281 216.105 1.65948 215.839 115.926 215.839C230.193 215.839 225.659 216.105 229.926 207.839C234.059 199.705 232.726 194.639 223.126 182.505C205.793 160.505 200.593 145.039 198.726 111.172C197.126 81.3053 192.193 68.5053 175.659 51.1719C165.793 40.7719 155.393 33.8386 143.393 29.8386C132.059 25.9719 131.926 25.8386 131.926 18.3719C131.926 9.83861 128.993 4.10528 123.259 1.70528C117.393 -0.694722 113.659 -0.561388 108.193 2.10528ZM123.526 60.5053C125.126 61.7053 127.126 64.7719 127.926 67.5719C129.659 73.9719 129.659 117.705 127.793 124.105C125.793 131.705 117.659 135.172 110.193 131.705C103.926 128.905 103.259 126.239 102.859 99.3053C102.326 70.5053 102.859 66.1053 107.259 61.7053C110.993 57.9719 118.993 57.3053 123.526 60.5053ZM126.859 153.305C131.926 156.905 134.193 164.905 132.059 171.705C129.926 179.039 124.059 183.039 115.659 183.039C109.926 183.039 108.593 182.372 104.326 178.239C100.193 173.972 99.6595 172.772 99.6595 166.505C99.6595 160.505 100.193 159.039 103.926 155.172C106.326 152.639 109.526 150.372 111.126 150.105C115.793 149.039 122.993 150.639 126.859 153.305Z" fill="black"/>
      <path d="M83.3928 238.105C85.3928 249.305 93.1261 258.772 103.926 263.705C110.859 266.905 116.193 267.172 124.993 264.905C136.193 262.105 149.259 246.239 149.259 235.305C149.259 233.439 145.926 233.172 115.926 233.172H82.4595L83.3928 238.105Z" fill="black"/>
      </svg>
        `,
    bellRing: `<svg width="267" height="267" viewBox="0 0 267 267" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M124.965 1.81706C119.365 4.21706 116.565 9.9504 116.565 19.0171V26.2171L107.631 29.0171C79.7648 37.4171 56.9648 62.8837 51.8982 91.1504C50.8315 97.0171 49.3648 110.484 48.6982 121.15C48.0315 132.484 46.5648 143.284 45.2315 147.15C41.2315 159.15 33.8981 172.617 26.6981 181.417C22.8315 186.084 18.9648 191.284 18.0315 192.75C16.0315 196.75 16.1648 203.284 18.5648 207.817C22.8315 216.084 18.2982 215.817 132.565 215.817C246.431 215.817 242.298 216.084 246.431 208.084C250.965 199.417 249.765 194.884 239.765 182.217C229.231 169.017 221.498 153.817 218.698 140.617C217.498 135.417 216.031 121.817 215.365 110.484C214.431 93.9504 213.498 88.0837 210.831 80.8837C201.498 55.1504 181.231 35.6837 156.298 28.4837L148.565 26.3504V19.0171C148.565 9.81706 145.765 4.21706 139.898 1.68373C134.298 -0.582938 130.431 -0.582938 124.965 1.81706Z" fill="black"/>
      <path d="M45.2316 5.28358C40.9649 7.68358 32.8316 15.8169 26.5649 23.9502C9.89822 45.4169 0.298223 71.9502 0.0315565 97.5503C-0.101777 108.884 0.0315564 109.55 3.63156 112.617C9.63156 117.817 18.6982 116.617 22.0316 110.084C22.9649 108.484 24.1649 101.684 24.6982 95.1503C25.3649 88.4836 26.6982 79.5503 27.8982 75.1503C31.2316 61.9502 40.9649 44.2169 52.0316 31.2836C61.0982 20.6169 62.0316 18.8836 61.3649 15.2836C59.7649 7.55025 50.9649 2.08358 45.2316 5.28358Z" fill="black"/>
      <path d="M211.898 5.01688C208.165 6.61688 204.965 10.4835 204.031 14.4835C203.098 18.3502 204.698 21.1502 215.498 34.0835C230.298 51.9502 237.765 70.0836 241.098 96.3502C242.565 108.617 243.365 111.417 245.898 113.417C250.565 117.284 257.365 116.484 262.165 111.684L266.298 107.684L265.498 95.4169C264.565 80.8836 259.765 61.1502 254.165 49.0169C246.298 31.5502 228.165 8.35021 220.165 5.28355C215.898 3.55021 215.498 3.55021 211.898 5.01688Z" fill="black"/>
      <path d="M99.8982 238.084C102.698 253.55 117.632 266.35 132.565 266.484C145.098 266.484 160.698 254.75 164.298 242.75C167.365 232.484 169.765 233.15 132.432 233.15H98.9648L99.8982 238.084Z" fill="black"/>
      </svg>
      `,
    bellOn: `<svg width="333" height="267" viewBox="0 0 333 267" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M158.602 1.81715C153.002 4.21715 150.202 9.95048 150.202 19.0172V26.3505L142.602 28.4838C124.869 33.5505 105.135 48.7505 95.6688 64.3505C87.0021 78.7505 84.7355 87.5505 83.5355 111.15C82.8688 122.884 81.8021 135.15 81.0021 138.484C77.0021 155.95 69.1355 171.417 57.0021 185.817C51.4021 192.35 50.2021 194.617 50.2021 198.884C50.2021 201.684 51.1355 205.684 52.2021 207.817C56.4688 216.084 51.9355 215.817 166.202 215.817C280.469 215.817 275.935 216.084 280.202 207.817C284.335 199.817 283.002 195.017 273.002 181.95C255.802 159.55 251.135 145.684 249.002 111.15C248.202 97.6838 246.869 88.3505 245.002 82.4838C237.135 57.5505 216.069 36.6171 191.269 29.0171L182.202 26.2171V19.0172C182.202 9.81715 179.269 4.21715 173.535 1.68382C167.935 -0.582848 164.069 -0.582848 158.602 1.81715Z" fill="black"/>
      <path d="M25.0018 7.41706C21.0018 10.7504 19.9352 18.7504 22.7352 23.1504C25.8018 27.8171 60.6018 45.1504 66.8685 45.1504C76.2018 45.1504 81.5352 34.4837 76.0685 26.7504C75.0018 25.0171 65.6685 19.5504 55.4018 14.4837C35.8018 4.61706 30.0685 3.28372 25.0018 7.41706Z" fill="black"/>
      <path d="M276.602 14.4837C266.602 19.5504 257.402 25.0171 256.335 26.7504C251.268 33.9504 257.002 45.1504 265.668 45.1504C270.602 45.1504 303.268 29.6837 308.602 24.7504C312.735 20.8837 312.602 12.7504 308.202 8.48372C302.868 3.01706 297.402 4.08372 276.602 14.4837Z" fill="black"/>
      <path d="M5.802 93.2838C4.602 93.9505 2.602 96.4838 1.402 98.6171C-1.26467 103.817 -0.0646693 109.55 4.46866 113.15C7.66866 115.55 9.802 115.817 33.002 115.817C57.5353 115.817 58.0687 115.684 61.802 112.617C67.002 108.084 67.002 99.5505 61.802 95.0171C58.0687 91.9505 57.5353 91.8171 33.1353 91.8171C18.7353 91.8171 7.26866 92.4838 5.802 93.2838Z" fill="black"/>
      <path d="M272.469 93.2838C271.269 93.9505 269.269 96.4838 268.069 98.6171C265.402 103.817 266.602 109.55 271.135 113.15C274.335 115.55 276.469 115.817 299.669 115.817C324.202 115.817 324.735 115.684 328.469 112.617C331.402 110.084 332.202 108.35 332.202 103.817C332.202 99.2838 331.402 97.5505 328.469 95.0171C324.735 91.9505 324.202 91.8171 299.802 91.8171C285.402 91.8171 273.935 92.4838 272.469 93.2838Z" fill="black"/>
      <path d="M132.869 234.617C132.869 240.084 136.602 248.617 141.135 253.817C155.002 269.55 173.802 270.484 189.135 256.084C195.135 250.484 199.535 241.417 199.535 234.884C199.535 233.55 192.869 233.15 166.202 233.15C143.669 233.15 132.869 233.55 132.869 234.617Z" fill="black"/>
      </svg>
      `,
    withoutPhoto: `<svg width="1017" height="1017" viewBox="0 0 1017 1017" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M729.38 819.36L197.64 287.62C153.146 349.792 127.125 426.067 127.125 508.5C127.125 719.051 297.949 889.875 508.5 889.875C590.933 889.875 667.208 863.854 729.38 819.36ZM819.36 729.38C863.854 667.208 889.875 590.933 889.875 508.5C889.875 297.949 719.051 127.125 508.5 127.125C426.067 127.125 349.792 153.146 287.62 197.64L819.36 729.38ZM0 508.5C0 373.637 53.574 244.298 148.936 148.936C244.298 53.574 373.637 0 508.5 0C643.363 0 772.702 53.574 868.064 148.936C963.426 244.298 1017 373.637 1017 508.5C1017 643.363 963.426 772.702 868.064 868.064C772.702 963.426 643.363 1017 508.5 1017C373.637 1017 244.298 963.426 148.936 868.064C53.574 772.702 0 643.363 0 508.5Z" fill="black"/>
      <path d="M401.1 286.8L390.7 318H316C280.7 318 252 346.7 252 382V638C252 673.3 280.7 702 316 702H700C735.3 702 764 673.3 764 638V382C764 346.7 735.3 318 700 318H625.3L614.9 286.8C608.4 267.2 590.1 254 569.4 254H446.6C425.9 254 407.6 267.2 401.1 286.8ZM508 414C533.461 414 557.879 424.114 575.882 442.118C593.886 460.121 604 484.539 604 510C604 535.461 593.886 559.879 575.882 577.882C557.879 595.886 533.461 606 508 606C482.539 606 458.121 595.886 440.118 577.882C422.114 559.879 412 535.461 412 510C412 484.539 422.114 460.121 440.118 442.118C458.121 424.114 482.539 414 508 414Z" fill="black"/>
      </svg>
      `,
  };
  return (
    icons[category] ||
    `        
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>`
  );
};

export const DynamicIconsComponent = ({ category, style }) => {
  const icon = DynamicIcons(category);
  const defaultStyles = useStyles();
  return (
    <span
      className={defaultStyles.svg}
      style={style}
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
};
