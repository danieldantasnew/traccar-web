export default function durationOfStop(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
  
    const seconds = `${Math.floor((diffMs / 1000) % 60)}`.padStart(2, "0");
    const minutes = `${Math.floor((diffMs / (1000 * 60)) % 60)}`.padStart(2, "0");
    const hours = `${Math.floor((diffMs / (1000 * 60 * 60)))}`.padStart(2, "0");
  
    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours}:${minutes}:${seconds}`
    };
  }
  