import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort-list.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task";
import LoadMoreButtonView from "./view/load-button";
import TaskEditView from "./view/task-edit";
import {generateFilter} from "./mock/filter";
import {render, RenderPosition} from "./utils";

import {tasks} from "./mock/task";

const TASK_COUNT_PER_STEP = 8;
const filters = generateFilter(tasks);

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };
  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, replaceCardToForm);

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskComponent.getElement(), taskListElement, RenderPosition.BEFORE_END);
};

render(new SiteMenuView().getElement(), siteHeader, RenderPosition.BEFORE_END);
render(new FilterView(filters).getElement(), siteMain, RenderPosition.BEFORE_END);

const boardComponent = new BoardView();
render(boardComponent.getElement(), siteMain, RenderPosition.BEFORE_END);

render(new SortView().getElement(), boardComponent.getElement(), RenderPosition.AFTER_BEGIN);

const taskListComponent = new TaskListView();
render(taskListComponent.getElement(), boardComponent.getElement(), RenderPosition.BEFORE_END);

// render(new TaskEditView(tasks[0]).getElement(), taskListComponent.getElement(), RenderPosition.BEFORE_END);

for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTask(taskListComponent.getElement(), tasks[i]);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  const loadMoreButtonComponent = new LoadMoreButtonView();
  render(loadMoreButtonComponent.getElement(), boardComponent.getElement(), RenderPosition.BEFORE_END);

  loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
    .forEach((task) => renderTask(taskListComponent.getElement(), task));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}
