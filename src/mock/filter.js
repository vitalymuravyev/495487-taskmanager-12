import {isTaskRepeating, isTaskExpired, isTaskExpiringToday} from "../utils.js";

const taskToFilterMap = {
  all: (tasks) => tasks.filter((task) => !task.isArchive).length,
  overdue: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => isTaskExpired(task.dueDate)).length,
  today: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => isTaskExpiringToday(task.dueDate)).length,
  favorite: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => task.isFavorite).length,
  repeating: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => isTaskRepeating(task.repeatingDays)).length,
  archive: (tasks) => tasks.filter((task) => task.isArchive).length,
};

export const generateFilter = (tasks) => {
  return Object.entries(taskToFilterMap).map(([filterName, countTasks]) => {
    return {
      title: filterName,
      count: countTasks(tasks),
    };
  });
};
