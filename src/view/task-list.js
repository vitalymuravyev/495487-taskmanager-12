import {createElement} from "../utils";

export default class TaskList {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return `<div class="board__tasks"></div>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
