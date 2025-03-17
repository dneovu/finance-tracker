//  форматируем для `min` в `datetime-local`
const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // коррекция на часовой пояс
  return now.toISOString().slice(0, 16); // формат "YYYY-MM-DDTHH:MM"
};

export default getMinDateTime;
