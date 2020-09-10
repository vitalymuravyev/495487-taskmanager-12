import BoardView from "../view/board";
import SortView from "../view/sort-list";
import TaskListView from "../view/task-list";
import LoadMoreButtonView from "../view/load-button";
import NoTaskView from "../view/no-task";

import TaskPresenter from "./task";

import {render, RenderPosition, remove} from "../utils/render";
import {sortTaskDown, sortTaskUp} from "../utils/task";
import {SortType, UpdateType, UserAction} from "../const";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, tasksModel) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._taskPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._tasksModel = tasksModel;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTaskView();

    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._onModeChange = this._onModeChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);

    this._tasksModel.addObserver(this._onModelEvent);
  }

  init() {
    render(this._boardComponent, this._boardContainer, RenderPosition.BEFORE_END);
    render(this._taskListComponent, this._boardComponent, RenderPosition.BEFORE_END);

    this._renderBoard();
  }

  _renderBoard() {
    const tasks = this._getTasks();
    const tasksCount = tasks.length;

    if (tasksCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    this._renderTasks(tasks.slice(0, Math.min(tasksCount, this._renderedTaskCount)));

    if (tasksCount > this._renderedTaskCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._onViewAction, this._onModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;

  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._sortComponent, this._boardComponent, RenderPosition.AFTER_BEGIN);
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);
  }

  _onLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);

    this._renderTasks(tasks);
    this._renderedTaskCount = newRenderedTaskCount;

    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreButtonView();

    render(this._loadMoreButtonComponent, this._boardComponent, RenderPosition.BEFORE_END);

    this._loadMoreButtonComponent.setOnButtonClick(this._onLoadMoreButtonClick);
  }

  _renderNoTasks() {
    render(this._noTaskComponent, this._boardComponent, RenderPosition.AFTER_BEGIN);
  }

  _onModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _getTasks() {
    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return this._tasksModel.getTasks().slice().sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return this._tasksModel.getTasks().slice().sort(sortTaskDown);
    }

    return this._tasksModel.getTasks();
  }

  _onViewAction(actionType, updateType, update) {

    switch (actionType) {
      case UserAction.ADD_TASK:
        this._tasksModel.addTasks(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, update);
        break;
      case UserAction.UPDATE_TASK:
        this._tasksModel.addTask(updateType, update);
        break;
    }
  }

  _onModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _clearBoard(resetRenderedTaskCount = false, resetSortType = false) {
    const taskCount = this._getTasks().length;

    Object.values(this._taskPresenter).forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortComponent);
    remove(this._noTaskComponent);
    remove(this._loadMoreButtonComponent);

    if (resetRenderedTaskCount) {
      this._renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
