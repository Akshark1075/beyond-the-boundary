function getTimeAgo(timestamp: string | number | undefined): string {
  const now = new Date();
  const past = new Date(Number(timestamp)); // Convert timestamp to a number and create a Date object
  const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(secondsAgo / value);
    if (count >= 1) {
      return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export default getTimeAgo;
