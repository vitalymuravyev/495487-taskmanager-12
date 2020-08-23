import AbstractView from "./abstract";

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();
    this._buttonClick = this._buttonClick.bind(this);
  }
  _getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

  _buttonClick(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }

  setOnButtonClick(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener(`click`, this._buttonClick);
  }
}
