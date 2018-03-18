// @flow

export type Trip = {
  flightNumber: string,
  departure: string,
  departureTime: number,
  arrival: string,
  arrivalTime: number
};

// I can't think of a better name now ;)
export type RosterType = {
  trips: {
    [date: string]: Array<Trip>
  }
};
export type RouteType = {
  source: string,
  destination: string,
  departure_time: string,
  arrival_time: string
};
export type RouteDetailsType = {
  string: Array<RouteType>
};
