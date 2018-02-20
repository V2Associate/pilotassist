from __future__ import absolute_import

import pymysql
import time
from server.common import Roster, Trip
from server.db.db_connection import DBConnection

HOSTNAME = "localhost"
# TODO: Need to create a mysql user
USERNAME = "root"
PASSWORD = ""
DB_NAME = "pilotassist"
CHARSET = "utf8mb4"

connection = DBConnection(
    database=DB_NAME, username=USERNAME, password=PASSWORD, server=HOSTNAME)


# TODO does changing this to class will make things better
ALL_DB_PARAMS = {
    "TABLE_ROUTE": "route",
    "TABLE_MEMBER": "member",
    "TABLE_TRIP_DETAILS": "trip_details",
    "COL_ROUTE_NAME": "route_name",
    "COL_ROUTE_SOURCE": "source",
    "COL_ROUTE_DESTINATION": "destination",
    "COL_DEPARTURE_TIME": "departure_time",
    "COL_ARRIVAL_TIME": "arrival_time",
    "COL_FLEW_DATE": "flew_date",
    "COL_AIRCRAFT_MAKE": "aircraft_make",
    "COL_ACTUAL_DEPARTURE_TIME": "actual_departure_time",
    "COL_ACTUAL_ARRIVAL_TIME": "actual_arrival_time",
    "COL_INSTRUMENT_HRS": "instrument_hrs",
    "COL_NIGHT_HRS": "night_hrs",
    "COL_MEMBER_ID": "member_id",
    "COL_ROUTE_ID": "route_id",
    "COL_MEMBER_NAME": "name",
    "COL_ID": "id",
}

# select aircraft_make, flew_date, actual_departure_time, actual_arrival_time, instrument_hrs, night_hrs, route_name, source, destination, departure_time, arrival_time, name  from trip_details INNER JOIN route ON (trip_details.route_id = route.id) INNER JOIN member on trip_details.member_id = member.id where member_id=1;
QUERY_GET_ROSTER_FOR_DATE = "select {COL_AIRCRAFT_MAKE}, {COL_FLEW_DATE}, {COL_ACTUAL_DEPARTURE_TIME}, {COL_ACTUAL_ARRIVAL_TIME}, {COL_INSTRUMENT_HRS}, {COL_NIGHT_HRS}, {COL_ROUTE_NAME}, {COL_ROUTE_SOURCE}, {COL_ROUTE_DESTINATION}, {COL_DEPARTURE_TIME}, {COL_ARRIVAL_TIME}, {COL_MEMBER_NAME}  from {TABLE_TRIP_DETAILS} INNER JOIN {TABLE_ROUTE} ON ({TABLE_TRIP_DETAILS}.{COL_ROUTE_ID} = {TABLE_ROUTE}.{COL_ID}) INNER JOIN {TABLE_MEMBER} on {TABLE_TRIP_DETAILS}.{COL_MEMBER_ID} = {TABLE_MEMBER}.{COL_ID} where {COL_MEMBER_ID}={MEMBER_ID} and {COL_ACTUAL_DEPARTURE_TIME} between {DEPARTURE_START_TIME} and {DEPARTURE_END_TIME}"

SECONDS_IN_A_DAY = 24 * 60 * 60


class DB:
    def __init__(self):
        pass

    """
    Gets the roster for the passed in times. Times should be in unixtimestamp
    If no start_time, then get 2 days past
    if no end_time, get today
    """

    def get_roster_details(self, member_id, start_time=None, end_time=None):
        if (not start_time):
            start_time = self.get_current_time() - SECONDS_IN_A_DAY
        if (not end_time):
            end_time = self.get_current_time()
        arguments = ALL_DB_PARAMS
        arguments.update(
            {"DEPARTURE_START_TIME": start_time, "DEPARTURE_END_TIME": end_time, "MEMBER_ID": member_id})
        print "query ", QUERY_GET_ROSTER_FOR_DATE.format(**arguments)
        trips = connection.query_db(
            QUERY_GET_ROSTER_FOR_DATE.format(**arguments))
        print "Trips is", trips
        roster = Roster()
        roster.add_trips(trips)
        return roster
        # try:
        #     with connection.cursor() as cursor:
        #         print "query ", QUERY_GET_ROSTER_FOR_DATE.format(**arguments)
        #         cursor.execute(QUERY_GET_ROSTER_FOR_DATE.format(**arguments))
        #         results = cursor.fetchall()
        #         trips = [self.to_trip(trip) for trip in results]
        #         print "Trips is", trips
        #         return trips
        # finally:
        #     connection.close()

    # trip = Trip("AI-777", "BLR", 1518840246, "CCU", 1518847450)
    # roster = Roster([trip])
    # return

    def get_current_time(self):
        return int(time.time())

    def to_trip(self, trip):
        print trip
        return Trip(flight_number=trip[ALL_DB_PARAMS["COL_ROUTE_NAME"]], departure=trip[ALL_DB_PARAMS["COL_ROUTE_SOURCE"]],
                    arrival=trip[ALL_DB_PARAMS["COL_ROUTE_DESTINATION"]
                                 ], departure_time=trip[ALL_DB_PARAMS["COL_DEPARTURE_TIME"]],
                    arrival_time=trip[ALL_DB_PARAMS["COL_ARRIVAL_TIME"]])


# db = DB()
# db.get_roster_details()


# update  trip_details set actual_departure_time=1519056000,actual_arrival_time=1519056000 where actual_departure_time=1600 and actual_arrival_time=1700
# select aircraft_make, flew_date, actual_departure_time, actual_arrival_time, instrument_hrs, night_hrs, route_name, source, destination, departure_time, arrival_time, name  from trip_details INNER JOIN route ON (trip_details.route_id = route.id) INNER JOIN member on trip_details.member_id = member.id where member_id=1;
# select aircraft_make, flew_date, actual_departure_time, actual_arrival_time, instrument_hrs, night_hrs, route_name, source, destination, departure_time, arrival_time, name from trip_details INNER JOIN route ON(trip_details.route_id=route.id) INNER JOIN member on trip_details.member_id = member.id where member_id = 1 and actual_departure_time between 1518998400 and 1519084740
