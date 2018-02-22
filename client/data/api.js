// @flow
const baseUrl = "http://localhost:6001/roster";

export function status(response: Response): Promise<Response> {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

export function json(response: Response) {
  return response.json();
}

export function getRosterQueryURL(
  memberId: number,
  startTime: ?number,
  endTime: ?number
) {
  let url = `${baseUrl}/${memberId}`;
  if (startTime) {
    url = `${url}?start_time=${startTime}`;
  }
  if (endTime) {
    url = `${url}?start_time=${endTime}`;
  }
  console.log(`formed url = ${url}`);
  return url;
}

export function getRoster(
  memberId: number,
  startTime: ?number,
  endTime: ?number
): void {
  const url = getRosterQueryURL(memberId, startTime, endTime);
  fetch(url)
    .then(status)
    .then(json)
    .then(data => data)
    .catch(error => console.log("Request failed", error));
}

export function saveTrip() {}
