import SiteMenuView from "./view/site-menu.js";

import BoardPresenter from "./presenter/board";
import FilterPresenter from "./presenter/filter";

import TasksModel from "./model/task";
import FilterModel from "./model/filter";

// import {generateFilter} from "./mock/filter";
import {render, RenderPosition} from "./utils/render";
import Api from "./api";
import {UpdateType} from "./const.js";

// import {tasks} from "./mock/task";

const AUTHORIZATION = `Basic dbaY4kO9OO0dsnaqw3`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const api = new Api(END_POINT, AUTHORIZATION);

// console.log(api.getTasks());
// api.getTasks().then((tasks1) => console.log(tasks1));

const tasksModel = new TasksModel();
// tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMain, tasksModel, filterModel, api);
const filterPresenter = new FilterPresenter(siteMain, filterModel, tasksModel);


filterPresenter.init();
boardPresenter.init();

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(UpdateType.INIT, tasks);
    render(new SiteMenuView(), siteHeader, RenderPosition.BEFORE_END);
  })
  .catch(() => {
    tasksModel.setTasks(UpdateType.INIT, []);
    render(new SiteMenuView(), siteHeader, RenderPosition.BEFORE_END);
  });

// document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) =>{
//   evt.preventDefault();
//   boardPresenter.createTask();
// });
