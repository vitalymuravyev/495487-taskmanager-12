import TaskModel from "./model/task";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPstatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`}).then(Api.toJSON)
    .then((tasks) => tasks.map(TaskModel.adaptToClient));
  }

  updateTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(TaskModel.adaptToServer(task)),
      headers: new Headers({"Content-Type": `application/json`})
    }).then(Api.toJSON)
    .then(TaskModel.adaptToClient);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {

    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
            .then(Api.checkStatus)
            .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status < SuccessHTTPstatusRange.MIN &&
        response.status > SuccessHTTPstatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
