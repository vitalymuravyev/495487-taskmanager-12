import {COLORS} from "../const";
import {getRandomInteger, generateRandomValue, getRandomBoolen} from "../utils/common";

const DESCRIPTIONS = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const MAX_DATE_GAP = 7;
export const TASK_COUNT = 22;

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateRandomDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }

  const dateGap = getRandomInteger(-MAX_DATE_GAP, MAX_DATE_GAP);

  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + dateGap);

  // return new Date(currentDate) на всякий случай?
  return currentDate;
};

const generateRepeating = () => ({
  mo: getRandomBoolen(),
  tu: false,
  we: getRandomBoolen(),
  th: false,
  fr: getRandomBoolen(),
  sa: false,
  su: false,
});


const generateTask = () => {
  const description = generateRandomValue(DESCRIPTIONS);
  const color = generateRandomValue(COLORS);
  const dueDate = generateRandomDate();
  const repeatingDays = dueDate === null ? generateRepeating() : {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  };
  const id = generateId();

  return {
    id,
    description,
    dueDate,
    repeatingDays,
    color,
    isFavorite: getRandomBoolen(),
    isArchive: getRandomBoolen(),
  };
};

export const tasks = Array(TASK_COUNT).fill().map(generateTask);
