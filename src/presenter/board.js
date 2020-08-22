import BoardView from "../view/board";
import SortView from "../view/sort-list";
import TaskListView from "../view/task-list";
import TaskView from "../view/task";
import LoadMoreButtonView from "../view/load-button";
import TaskEditView from "../view/task-edit";
import NoTaskView from "../view/no-task";

import {render, RenderPosition, remove, replace} from "../utils/render";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardComponent, this._boardContainer, RenderPosition.BEFORE_END);
    render(this._taskListComponent, this._boardComponent, RenderPosition.BEFORE_END);

    this._renderBoard();
  }

  _renderBoard() {
    if (this._boardTasks.length === 0 || this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    this._renderTaskList();
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderTask(task) {
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
      document.addEventListener(`keydown`, onEscapePress);
    };
    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };

    const onEscapePress = (evt) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscapePress);
      }
    };

    taskComponent.setOnEditClick(() => {
      replaceCardToForm();
    });

    taskEditComponent.setOnFormSubmit(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscapePress);
    });


    render(taskComponent, this._taskListComponent, RenderPosition.BEFORE_END);
  }

  _renderTasks(from, to) {
    this._boardTasks
    .slice(from, to)
    .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderSort() {
    render(this._sortComponent, this._boardComponent, RenderPosition.AFTER_BEGIN);
  }

  _onLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;
    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {

    render(this._loadMoreButtonComponent, this._boardComponent, RenderPosition.BEFORE_END);

    this._loadMoreButtonComponent.setOnButtonClick(this._onLoadMoreButtonClick);
  }

  _renderNoTasks() {
    render(this._noTaskComponent, this._boardComponent, RenderPosition.AFTER_BEGIN);
  }
}
