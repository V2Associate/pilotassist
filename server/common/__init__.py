from json import JSONEncoder
from collections import defaultdict
import datetime
import time

# TODO check is this the right place for get_date method
# TODO this won't work if the local box is not in UTC, due to time.mktime


def get_date_as_timestamp(timestamp):
    given_timestamp = datetime.datetime.utcfromtimestamp(timestamp)
    return int(time.mktime(datetime.datetime(given_timestamp.year,
                                             given_timestamp.month, given_timestamp.day, 0, 0).utctimetuple()))


class Trip:
    def __init__(self,
                 flight_number="",
                 departure="",
                 departure_time=0,
                 arrival="",
                 arrival_time=0):
        self.flight_number = flight_number
        self.departure = departure
        self.departure_time = departure_time
        self.arrival = arrival
        self.arrival_time = arrival_time
    #  TODO Write __str__ method

    @staticmethod
    def serialize(obj):
        return {
            "flightNumber":   obj.flight_number,
            "departure": obj.departure,
            "arrival": obj.arrival,
            "departureTime": obj.departure_time,
            "arrivalTime": obj.arrival_time
        }


class Roster:
    def __init__(self):
        self.trips = defaultdict(list)

    # def add_trip(self, trip, date_as_unixtimestamp):
    #     self.trips[date_as_unixtimestamp].append(trip)
    # TODO: Reuse the constant
    def add_trips(self, trips):
        for trip in trips:
            self.trips[get_date_as_timestamp(trip["actual_departure_time"])].append(
                Trip(
                    flight_number=trip["route_name"],
                    departure=trip["source"],
                    departure_time=trip["actual_departure_time"],
                    arrival=trip["destination"],
                    arrival_time=trip["actual_arrival_time"]
                )
            )

    @staticmethod
    def serialize(obj):
        result = {}
        for time, trips in obj.trips.iteritems():
            result[time] = [Trip.serialize(trip) for trip in trips]
        return {
            "trips": result
        }
    #  TODO Write __str__ method
