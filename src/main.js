import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";

import BoardPresenter from "./presenter/board";

import TasksModel from "./model/task";

import {generateFilter} from "./mock/filter";
import {render, RenderPosition} from "./utils/render";

import {tasks} from "./mock/task";

const tasksModel = new TasksModel();

tasksModel.setTasks(tasks);

const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMain, tasksModel);

render(new SiteMenuView(), siteHeader, RenderPosition.BEFORE_END);
render(new FilterView(filters), siteMain, RenderPosition.BEFORE_END);

boardPresenter.init();
