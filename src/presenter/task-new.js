import TaskEditView from "../view/task-edit";

import {RenderPosition, render, remove} from "../utils/render";
import {generateId} from "../utils/task";
import {UserAction, UpdateType} from "../const";

export default class TaskNew {
  constructor(taskListContainer, changeData) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;

    this._taskEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init() {
    if (this._taskEditComponent !== null) {
      return;
    }

    this._taskEditComponent = new TaskEditView();
    this._taskEditComponent.setOnFormSubmit(this._handleFormSubmit);
    this._taskEditComponent.setOnDeleteClick(this._handleDeleteClick);
    render(this._taskEditComponent, this._taskListContainer, RenderPosition.AFTER_BEGIN);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  destroy() {
    if (this._taskEditComponent === null) {
      return;
    }

    remove(this._taskEditComponent);
    this._taskEditComponent = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _handleFormSubmit(task) {
    this._changeData(
        UserAction.ADD_TASK,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, task)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
