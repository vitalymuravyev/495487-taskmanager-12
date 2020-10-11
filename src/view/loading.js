import AbstractView from "./abstract";

const createNoTaskTemplate = () => {
  return `<p class="board__no-task">
  Loading....
  </p>`;
};

export default class Loading extends AbstractView {

  _getTemplate() {
    return createNoTaskTemplate();
  }
}
