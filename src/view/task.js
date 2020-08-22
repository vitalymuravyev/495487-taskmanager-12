import {isTaskRepeating, isTaskExpired} from "../utils/task";
import AbstractView from "./abstract";

export default class Task extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
    this._onEditClick = this._onEditClick.bind(this);
  }

  _getTemplate() {
    return this._createTemplate(this._task);

  }

  _createTemplate(task) {
    const {color, description, dueDate, isArchive, isFavorite, repeatingDays} = task;

    const date = dueDate !== null ? dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`}) : ``;
    const deadlineClassName = isTaskExpired(dueDate) ? `card--deadline` : ``;
    const archiveClassName = isArchive ? `card__btn--archive card__btn--disabled` : `card__btn--archive`;
    const favoriteClassName = isFavorite ? `card__btn--favorites card__btn--disabled` : `card__btn--favorites`;
    const repeatClassName = isTaskRepeating(repeatingDays) ? `card--repeat` : ``;

    return (
      `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn ${archiveClassName}">
                archive
              </button>
              <button
                type="button"
                class="card__btn ${favoriteClassName}"
              >
                favorites
              </button>
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <p class="card__text">${description}</p>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">${date}</span>
                      <span class="card__time">16:15</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>`
    );
  }

  _onEditClick(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setOnEditClick(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditClick);
  }
}
