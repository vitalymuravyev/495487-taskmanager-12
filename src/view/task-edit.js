import {COLORS} from "../const";
import {isTaskRepeating, formatTaskDueDate} from "../utils/task";
import SmartView from "./smart";
import flatpickr from "flatpickr";
import he from "he";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const EMPTY_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeatingDays: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};

const createTaskEditDateTemplate = (dueDate, isDueDate) => {
  return (
    `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${formatTaskDueDate(dueDate)}"
        />
      </label>
    </fieldset>` : ``}`
  );
};

const createTaskEditRepeatingTemplate = (repeatingDays, isRepeating) => {
  return (
    `<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
    </button>

    ${isRepeating ? `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${Object.entries(repeatingDays).map(([day, repeat]) =>
      `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join(``)}
      </div>
    </fieldset>` : ``}`
  );
};

const createTaskEditColorsTemplate = (currentColor) => {
  return COLORS.map((color) => `
  <input
    type="radio"
    id="color-${color}-4"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
  />
  <label
    for="color-${color}-4"
    class="card__color card__color--${color}"
    >${color}</label
  >`).join(``);
};

export default class TaskEdit extends SmartView {
  constructor(task = EMPTY_TASK) {
    super();
    this._data = TaskEdit.parseTaskToData(task);
    this._datepicker = null;

    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDueDateToggle = this._onDueDateToggle.bind(this);
    this._onRepeatingDaysToggle = this._onRepeatingDaysToggle.bind(this);
    this._onDescriptionInput = this._onDescriptionInput.bind(this);
    this._onRepeatingChange = this._onRepeatingChange.bind(this);
    this._onColorChange = this._onColorChange.bind(this);
    this._onDueDateChange = this._onDueDateChange.bind(this);
    this._onFormDeleteClick = this._onFormDeleteClick.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  _getTemplate() {
    return this._createTemplate(this._data);

  }

  _createTemplate({color, dueDate, repeatingDays, description, isDueDate, isRepeating}) {
    const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);
    const repeatingClassName = isRepeating ? `card--repeat` : ``;
    const repeatingTemplate = createTaskEditRepeatingTemplate(repeatingDays, isRepeating);
    const colorTemplate = createTaskEditColorsTemplate(color);
    const isSubmitDisabled = (isDueDate && dueDate === null) || (isRepeating && !isTaskRepeating(repeatingDays));

    return (
      `<article class="card card--edit card--${color} ${repeatingClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${he.encode(description)}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}
                ${repeatingTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${colorTemplate}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSubmitDisabled ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
    );
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _onFormSubmit(evt) {
    evt.preventDefault();
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data));
  }

  _onDueDateToggle(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false,
    });
  }

  _onRepeatingDaysToggle(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false,
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onDueDateToggle);
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onRepeatingDaysToggle);
    this.getElement().querySelector(`.card__text`).addEventListener(`input`, this._onDescriptionInput);
    this.getElement().querySelector(`.card__colors-wrap`).addEventListener(`change`, this._onColorChange);

    if (this._data.isRepeating) {
      this.getElement()
        .querySelector(`.card__repeat-days-inner`)
        .addEventListener(`change`, this._onRepeatingChange);
    }
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.isDueDate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._data.dueDate,
            onChange: this._onDueDateChange,
          }
      );
    }
  }

  _onDescriptionInput(evt) {
    evt.preventDefault();
    this.updateData({description: evt.target.value}, true);
  }

  _onRepeatingChange(evt) {
    evt.preventDefault();
    this.updateData({
      repeatingDays: Object.assign(
          {},
          this._data.repeatingDays,
          {[evt.target.value]: evt.target.checked}
      )
    });
  }

  _onColorChange(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value
    });
  }

  _onDueDateChange([userDate]) {
    userDate.setHours(23, 59, 59, 999);

    this.updateData({dueDate: userDate});
  }

  _onFormDeleteClick(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TaskEdit.parseDataToTask(this._data));
  }

  setOnFormSubmit(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._onFormSubmit);
  }

  setOnDeleteClick(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._onFormDeleteClick);
  }

  static parseTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isDueDate: task.dueDate !== null,
          isRepeating: isTaskRepeating(task.repeatingDays)
        }
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeatingDays = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setOnFormSubmit(this._callback.formSubmit);
    this.setOnDeleteClick(this._callback.deleteClick);
  }

  reset(task) {
    this.updateData(
        TaskEdit.parseTaskToData(task)
    );
  }
}
