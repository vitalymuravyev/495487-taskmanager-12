import BoardView from "../view/board";
import SortView from "../view/sort-list";
import TaskListView from "../view/task-list";
import LoadMoreButtonView from "../view/load-button";
import NoTaskView from "../view/no-task";

import TaskPresenter from "./task";

import {render, RenderPosition, remove} from "../utils/render";
import {updateItem} from "../utils/common";
import {sortTaskDown, sortTaskUp} from "../utils/task";
import {SortType} from "../const";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._taskPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._onTaskChange = this._onTaskChange.bind(this);
    this._onModeChange = this._onModeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    this._sourcedBoardTasks = boardTasks.slice(); // for backup

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
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);
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

  _clearTaskList() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());

    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  _onTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _onModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }
}
