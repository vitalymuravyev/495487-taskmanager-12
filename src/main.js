import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortListTemplate} from "./view/sort-list.js";
import {createTaskTemplate} from "./view/task";
import {createLoadButtonTemplate} from "./view/load-button";
import {createTaskEditTemplate} from "./view/task-edit";

const TASK_COUNT = 3;

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const render = (template, container, position) => {
  container.insertAdjacentHTML(position, template);
};

render(createSiteMenuTemplate(), siteHeader, `beforeend`);
render(createFilterTemplate(), siteMain, `beforeend`);
render(createBoardTemplate(), siteMain, `beforeend`);

const board = siteMain.querySelector(`.board`);
const sortList = board.querySelector(`.board__filter-list`);
const taskList = board.querySelector(`.board__tasks`);

render(createSortListTemplate(), sortList, `afterbegin`);

render(createTaskEditTemplate(), taskList, `beforeend`);

for (let i = 0; i < TASK_COUNT; i++) {
  render(createTaskTemplate(), taskList, `beforeend`);
}

render(createLoadButtonTemplate(), board, `beforeend`);

