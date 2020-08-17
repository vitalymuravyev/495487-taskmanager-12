export const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
};

export const render = (element, container, place) => {
  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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

export const generateRandomValue = (arr) => arr[getRandomInteger(0, arr.length - 1)];

export const getRandomBoolen = () => Boolean(getRandomInteger(0, 1));

export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

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

export const renderTemplate = (template, container, position) => {
  container.insertAdjacentHTML(position, template);
};
