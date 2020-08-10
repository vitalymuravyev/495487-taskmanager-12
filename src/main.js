import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortListTemplate} from "./view/sort-list.js";
import {createTaskTemplate} from "./view/task";
import {createLoadButtonTemplate} from "./view/load-button";
import {createTaskEditTemplate} from "./view/task-edit";
import {generateFilter} from "./mock/filter";

import {tasks} from "./mock/task";

const TASK_COUNT_PER_STEP = 8;
const filter = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const render = (template, container, position) => {
  container.insertAdjacentHTML(position, template);
};

render(createSiteMenuTemplate(), siteHeader, `beforeend`);
render(createFilterTemplate(filter), siteMain, `beforeend`);
render(createBoardTemplate(), siteMain, `beforeend`);

const board = siteMain.querySelector(`.board`);
const sortList = board.querySelector(`.board__filter-list`);
const taskList = board.querySelector(`.board__tasks`);

render(createSortListTemplate(), sortList, `afterbegin`);

render(createTaskEditTemplate(tasks[0]), taskList, `beforeend`);

for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(createTaskTemplate(tasks[i]), taskList, `beforeend`);
}


if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  render(createLoadButtonTemplate(), board, `beforeend`);

  const loadMoreButton = board.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
    .forEach((task) => render(createTaskTemplate(task), taskList, `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
