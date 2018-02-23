// @flow

import type { RosterType } from "../flow-typed/types";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export function formatTime(unixtimestamp: number): string {
  const date = new Date(unixtimestamp * 1000);
  const hours = date.getHours();
  const minutes = `0${date.getMinutes()}`;
  //   const seconds = `0${date.getSeconds()}`;
  const formattedTime = `${hours}:${minutes.substr(-2)}`;
  return formattedTime;
}

export function formatDate(unixtimestamp: number): string {
  const date = new Date(unixtimestamp * 1000);
  /* 11-Dec-2016 Thursday */
  return `${date.getDate()}-${months[date.getMonth()].slice(
    0,
    3
  )}-${date.getFullYear()} ${days[date.getDay()]}`;
}

/*
* first param - second param
*/
export function timeDifference(
  latertUnixtimestamp: number,
  olderUnixtimestamp: number
): string {
  let difference =
    new Date(latertUnixtimestamp * 1000) - new Date(olderUnixtimestamp * 1000);
  const hh = Math.floor(difference / 1000 / 60 / 60);
  difference -= hh * 1000 * 60 * 60;
  const mm = Math.floor(difference / 1000 / 60);
  difference -= mm * 1000 * 60;
  //   const ss = Math.floor(difference / 1000);
  //   difference -= ss * 1000;
  return `${hh}hrs ${mm}min`;
}

export function dateInEpoch(date: Date): number {
  // All the timestamps for dates should be in unixtimestamp
  return (
    new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    ).getTime() / 1000
  );
}

export function todayTimeInEpoch(): number {
  return dateInEpoch(new Date());
}

export function convertToEpoch(
  year: number,
  month: number,
  date: number,
  hours: number,
  minutes: number
): number {
  const today = new Date();
  return (
    new Date(
      year < 0 ? today.getFullYear() : year,
      month < 0 ? today.getMonth() : month,
      date < 0 ? today.getDate() : date,
      hours < 0 ? today.getHours() : hours,
      minutes < 0 ? today.getMinutes() : minutes
    ).getTime() / 1000
  );
}

export function getDateFromUnixTimeStamp(unixtimestamp: number) {
  return dateInEpoch(new Date(unixtimestamp * 1000));
}

export function mergeRosterUpdate(
  currentData: RosterType,
  updateData: RosterType
): RosterType {
  const roster = currentData;
  Object.keys(updateData.trips).forEach(timestamp => {
    // if (timestamp in roster.trips) {
    //   // this will come when we query for more than 1 day and there is a overlap
    //   console.log("Me updating...");
    //   roster.trips[timestamp].push(updateData.trips[timestamp]);
    // } else {
    // always doing the update assuming that DB will be latest
    console.log("Me adding new...");
    roster.trips[timestamp] = updateData.trips[timestamp];
    // }
  });
  return roster;
}
