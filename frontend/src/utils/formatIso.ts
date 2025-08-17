import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const formatIso = (isoTime: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const utcDate = new Date(`${isoTime}Z`); // добавляем Z, чтобы указать, что это UTC

  // преобразуем в локальное время
  const localDate = toZonedTime(utcDate, userTimeZone);

  // форматируем в локальном времени
  return format(localDate, "yyyy-MM-dd HH:mm:ss");
};

export default formatIso;
