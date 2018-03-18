// @flow
const baseUrl = "http://192.168.1.3:6001";
const rosterBaseUrl = `${baseUrl}/roster`;
const routeBaseUrl = `${baseUrl}/route`;

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
  return `${rosterBaseUrl}/${memberId}`;
}

export function getRosterAddURL(memberId: number) {
  return `${rosterBaseUrl}/${memberId}`;
}
export function getRosterQueryURL(
  memberId: number,
  startTime: ?number,
  endTime: ?number
) {
  let url = `${rosterBaseUrl}/${memberId}`;
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

export function getRouteQueryURL(memberId: number): string {
  return `${routeBaseUrl}/${memberId}`;
}
export function saveTrip() {}
