import {createElement} from "../utils";

const createFilterItemTemplate = ({title, count}, isChecked) =>
  ` <input
    type="radio"
    id="filter__${title}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? `checked` : ``}
    ${count === 0 ? `disabled` : ``}
  />
  <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label
    >`;

export default class Filter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  _getTemplate(filterItems) {
    const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join(``);
    return (
      `<section class="main__filter filter container">
      ${filterItemsTemplate}
    </section>`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate(this._filters));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
