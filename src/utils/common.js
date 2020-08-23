export const getRandomInteger = (a, b) => {
  const low = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(low + Math.random() * (max - low + 1));
};

export const generateRandomValue = (arr) => arr[getRandomInteger(0, arr.length - 1)];

export const getRandomBoolen = () => Boolean(getRandomInteger(0, 1));
