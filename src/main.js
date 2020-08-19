import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort-list.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task";
import LoadMoreButtonView from "./view/load-button";
import TaskEditView from "./view/task-edit";
import NoTaskView from "./view/no-task";

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
    document.addEventListener(`keydown`, onEscapePress);
  };
  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscapePress = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscapePress);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, replaceCardToForm);

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscapePress);
  });

  render(taskComponent.getElement(), taskListElement, RenderPosition.BEFORE_END);
};

const renderBoard = (boardTasks, boardContainer) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardComponent.getElement(), boardContainer, RenderPosition.BEFORE_END);
  render(taskListComponent.getElement(), boardComponent.getElement(), RenderPosition.BEFORE_END);

  if (boardTasks.length === 0 || boardTasks.every((task) => task.isArchive)) {
    render(new NoTaskView().getElement(), boardComponent.getElement(), RenderPosition.AFTER_BEGIN);
    return;
  }

  render(new SortView().getElement(), boardComponent.getElement(), RenderPosition.AFTER_BEGIN);

  boardTasks
     .slice(0, Math.min(boardTasks.length, TASK_COUNT_PER_STEP))
     .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;
    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(loadMoreButtonComponent.getElement(), boardComponent.getElement(), RenderPosition.BEFORE_END);

    loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      boardTasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTask(taskListComponent.getElement(), task));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

render(new SiteMenuView().getElement(), siteHeader, RenderPosition.BEFORE_END);
render(new FilterView(filters).getElement(), siteMain, RenderPosition.BEFORE_END);

renderBoard(tasks, siteMain);
