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
