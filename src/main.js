import SiteMenuView from "./view/site-menu.js";

import BoardPresenter from "./presenter/board";
import FilterPresenter from "./presenter/filter";

import TasksModel from "./model/task";
import FilterModel from "./model/filter";

// import {generateFilter} from "./mock/filter";
import {render, RenderPosition} from "./utils/render";

import {tasks} from "./mock/task";

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMain, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMain, filterModel, tasksModel);

render(new SiteMenuView(), siteHeader, RenderPosition.BEFORE_END);

filterPresenter.init();
boardPresenter.init();

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) =>{
  evt.preventDefault();
  boardPresenter.createTask();
});
