import AbstractView from "./abstract";

export default class TaskList extends AbstractView {

  _getTemplate() {
    return `<div class="board__tasks"></div>`;
  }

}
