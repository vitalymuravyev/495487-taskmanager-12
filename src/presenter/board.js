import BoardView from "../view/board";
import SortView from "../view/sort-list";
import TaskListView from "../view/task-list";
import LoadMoreButtonView from "../view/load-button";
import NoTaskView from "../view/no-task";

import TaskPresenter from "./task";

import {render, RenderPosition, remove} from "../utils/render";
import {updateItem} from "../utils/common";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onTaskChange = this._onTaskChange.bind(this);
    this._onModeChange = this._onModeChange.bind(this);
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
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._onTaskChange, this._onModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;

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
  // понадобится при выполнении задания 5.2
  _clearTaskList() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());

    this._taskPresenter = {};
  }

  _onTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    // this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _onModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }
}
