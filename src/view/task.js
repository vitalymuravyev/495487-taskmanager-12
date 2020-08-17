import {isTaskRepeating, isTaskExpired, createElement} from "../utils";

export default class Task {
  constructor(task) {
    this._element = null;
    this._task = task;
  }

  _getTemplate(task) {
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

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate(this._task));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
