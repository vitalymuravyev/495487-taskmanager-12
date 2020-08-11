const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return currentDate;
};

export const getRandomInteger = (a, b) => {
  const low = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(low + Math.random() * (max - low + 1));
};

export const generateRandomValue = (arr) => {
  return arr[getRandomInteger(0, arr.length - 1)];
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return dueDate < currentDate;
};

export const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate === dueDate;
};
