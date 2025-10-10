export const insertDaySeparators = (messages: { timestamp: number }[], outPreviousDay: number | null = null) => {
  const result: unknown[] = [];
  let previousDay: string | null = null;

  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const now = new Date();
  const todayStart = startOfDay(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = startOfDay(yesterday);

  const getDayLabel = (timestamp: number) => {
    const messageDate = new Date(timestamp * 1000);
    const messageStart = startOfDay(messageDate);

    if (messageStart === todayStart) {
      return 'Сегодня';
    } else if (messageStart === yesterdayStart) {
      return 'Вчера';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (outPreviousDay !== null) {
    previousDay = getDayLabel(outPreviousDay);
  }

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const currentDay = getDayLabel(message.timestamp);

    if (currentDay !== previousDay) {
      result.push({
        isSeparator: true,
        day: currentDay,
        text: currentDay,
        type: 'system.date',
      });
      previousDay = currentDay;
    }
    result.push(message);
  }
  return result;
};


