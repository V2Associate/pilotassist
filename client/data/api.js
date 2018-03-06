// @flow
const baseUrl = "http://172.23.244.89:6001/roster";

export function status(response: Response): Promise<Response> {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

export function showError(error: any) {
  console.log("Request failed", error);
}
export function json(response: Response) {
  return response.json();
}

export function getRosterDeleteURL(memberId: number) {
  return `${baseUrl}/${memberId}`;
}

export function getRosterAddURL(memberId: number) {
  return `${baseUrl}/${memberId}`;
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
    if (startTime) {
      url = `${url}&end_time=${endTime}`;
    } else {
      url = `${url}?end_time=${endTime}`;
    }
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
