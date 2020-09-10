import TaskView from "../view/task";
import TaskEditView from "../view/task-edit";

import {render, RenderPosition, replace, remove} from "../utils/render";
import {isDatesEqual, isTaskRepeating} from "../utils/task";
import {UserAction, UpdateType} from "../const";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Task {
  constructor(taskListContainer, changeData, changeMode) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._taskComponent = null;
    this._taskEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscapePress = this._onEscapePress.bind(this);
    this._onEditClick = this._onEditClick.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onArchiveClick = this._onArchiveClick.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
  }

  init(task) {
    this._task = task;

    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskView(this._task);
    this._taskEditComponent = new TaskEditView(this._task);

    this._taskComponent.setOnEditClick(this._onEditClick);
    this._taskComponent.setOnFavotiteClick(this._onFavoriteClick);
    this._taskComponent.setOnArchiveClick(this._onArchiveClick);

    this._taskEditComponent.setOnFormSubmit(this._onFormSubmit);
    this._taskEditComponent.setOnDeleteClick(this._onDeleteClick);

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this._taskComponent, this._taskListContainer, RenderPosition.BEFORE_END);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._taskComponent, prevTaskComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._taskEditComponent, prevTaskEditComponent);
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener(`keydown`, this._onEscapePress);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._onEscapePress);
    this._mode = Mode.DEFAULT;
  }

  _onEscapePress(evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      this._taskEditComponent.reset(this._task);
      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._onEscapePress);
    }
  }

  _onEditClick() {
    this._replaceCardToForm();
  }

  _onFormSubmit(update) {
    const isMinorUpdate = isDatesEqual(this._task.dueDate, update.dueDate)
    || isTaskRepeating(this._task.repeatingDays) !== isTaskRepeating(update.repeatingDays);

    this._changeData(
        UserAction.UPDATE_TASK,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );
    this._replaceFormToCard();
  }

  _onFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_TASK,
        UpdateType.MINOR,
        Object.assign({}, this._task, {isFavorite: !this._task.isFavorite})
    );
  }

  _onArchiveClick() {
    this._changeData(
        UserAction.UPDATE_TASK,
        UpdateType.MINOR,
        Object.assign({}, this._task, {isArchive: !this._task.isArchive})
    );
  }

  _onDeleteClick(task) {
    this._changeData(
        UserAction.DELETE_TASK,
        UpdateType.MINOR,
        task
    );
  }
}
