export const convertDurationToString = (
  duration: string | null,
): string | undefined => {
  if (duration !== null && duration !== undefined) {
    if (duration == "00:00:00") return undefined;

    const [hours, minutes, seconds] = duration.split(":");

    if (hours) {
      const hoursInt = parseInt(hours);
      const hoursToMinutes = hoursInt * 60;

      const minutesInt = parseInt(minutes!);
      const totalMinutes = hoursToMinutes + minutesInt;
      if (totalMinutes == 1) {
        return `${totalMinutes} minute`;
      } else {
        return `${totalMinutes} minutes`;
      }
    }
  }
};
export const convertDurationToNumberOfMinutes = (duration: string): number => {
  const [hours, minutes] = duration.split(":");
  let hoursToMinutes = 0;
  let minutesInt = 0;

  if (hours) {
    hoursToMinutes = parseInt(hours) * 60;
  }
  if (minutes) {
    minutesInt = parseInt(minutes);
  }
  return hoursToMinutes + minutesInt;
};

export const convertNumberOfMinutesToDuration = (
  numberOfMinutes: number,
): string => {
  const hours = Math.floor(numberOfMinutes / 60);
  const minutes = numberOfMinutes % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes}:00`;
};
