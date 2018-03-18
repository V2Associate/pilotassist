from __future__ import absolute_import

import pymysql
import time
import itertools
from collections import defaultdict
from server.common import Roster, Trip
from server.db.db_connection import DBConnection
from server.common import get_date_as_timestamp

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
    "TABLE_COMPANY": "company",
    "COL_COMPANY_ID": "company_id",
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
QUERY_GET_ROSTER_FOR_DATE = "select {COL_AIRCRAFT_MAKE}, {COL_FLEW_DATE}, {COL_ACTUAL_DEPARTURE_TIME}, {COL_ACTUAL_ARRIVAL_TIME}, {COL_INSTRUMENT_HRS}, {COL_NIGHT_HRS}, {COL_ROUTE_NAME}, {COL_ROUTE_SOURCE}, {COL_ROUTE_DESTINATION}, {COL_DEPARTURE_TIME}, {COL_ARRIVAL_TIME}, {COL_MEMBER_NAME}  from {TABLE_TRIP_DETAILS} INNER JOIN {TABLE_ROUTE} ON ({TABLE_TRIP_DETAILS}.{COL_ROUTE_ID} = {TABLE_ROUTE}.{COL_ID}) INNER JOIN {TABLE_MEMBER} on {TABLE_TRIP_DETAILS}.{COL_MEMBER_ID} = {TABLE_MEMBER}.{COL_ID} where {COL_MEMBER_ID}={MEMBER_ID} and {COL_FLEW_DATE} between {DEPARTURE_START_TIME} and {DEPARTURE_END_TIME}"
QUERY_DELETE_TRIP_FROM_ROSTER = "delete from {TABLE_TRIP_DETAILS} where {COL_MEMBER_ID}={MEMBER_ID} and {COL_FLEW_DATE}={FLEW_DATE} and {COL_ROUTE_ID} in (select {COL_ID} from {TABLE_ROUTE} where {COL_ROUTE_NAME}='{ROUTE_NAME}')"
QUERY_ADD_TRIP_TO_ROSTER = "insert into {TABLE_TRIP_DETAILS}({COL_FLEW_DATE}, {COL_AIRCRAFT_MAKE}, {COL_ACTUAL_DEPARTURE_TIME}, {COL_ACTUAL_ARRIVAL_TIME}, {COL_MEMBER_ID}, {COL_ROUTE_ID}) SELECT {FLEW_DATE}, '{AIRCRAFT_MAKE}', {ACTUAL_DEPARTURE_TIME}, {ACTUAL_ARRIVAL_TIME}, {MEMBER_ID}, {COL_ID} from {TABLE_ROUTE} where {COL_ROUTE_NAME}='{ROUTE_NAME}';"
QUERY_GET_ALL_ROUTE = "select {COL_ROUTE_NAME}, {COL_ROUTE_SOURCE}, {COL_ROUTE_DESTINATION}, {COL_DEPARTURE_TIME}, {COL_ARRIVAL_TIME} from {TABLE_ROUTE} where {COL_COMPANY_ID} in (select {COL_COMPANY_ID} from {TABLE_MEMBER} where {COL_ID}={MEMBER_ID}) "

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
        start_time = int(
            start_time) if start_time else self.get_current_time() - SECONDS_IN_A_DAY
        end_time = int(end_time) if end_time else start_time + SECONDS_IN_A_DAY
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

    def delete_trip_from_roster(self, member_id, date, flight_number):
        arguments = ALL_DB_PARAMS
        arguments.update(
            {"FLEW_DATE": date, "ROUTE_NAME": flight_number, "MEMBER_ID": member_id})
        print "query", QUERY_DELETE_TRIP_FROM_ROSTER.format(**arguments)
        rows_delted = connection.execute(
            QUERY_DELETE_TRIP_FROM_ROSTER.format(**arguments))
        print "Number of rows deleted ", rows_delted
        return rows_delted

    def add_trip_to_roster(self, trip):
        # TODO: AI-777 will be flying from BLR to HYD, then HYD to DEL. SO flight_number is not unique
        # Need to fix this
        arguments = ALL_DB_PARAMS
        date_as_timestamp = get_date_as_timestamp(trip['departureTime'])
        arguments.update(
            {"FLEW_DATE": date_as_timestamp, "AIRCRAFT_MAKE": trip['flightNumber'], "ACTUAL_DEPARTURE_TIME": trip['departureTime'],
                "ACTUAL_ARRIVAL_TIME": trip['arrivalTime'], "MEMBER_ID": 1, "ROUTE_NAME": trip['flightNumber']}
        )
        print "query", QUERY_ADD_TRIP_TO_ROSTER.format(**arguments)
        rows_added = connection.execute(
            QUERY_ADD_TRIP_TO_ROSTER.format(**arguments))
        print "Number of rows added ", rows_added
        return rows_added

    def get_current_time(self):
        return int(time.time())

    def to_trip(self, trip):
        print trip
        return Trip(flight_number=trip[ALL_DB_PARAMS["COL_ROUTE_NAME"]], departure=trip[ALL_DB_PARAMS["COL_ROUTE_SOURCE"]],
                    arrival=trip[ALL_DB_PARAMS["COL_ROUTE_DESTINATION"]
                                 ], departure_time=trip[ALL_DB_PARAMS["COL_DEPARTURE_TIME"]],
                    arrival_time=trip[ALL_DB_PARAMS["COL_ARRIVAL_TIME"]])


class RouteDB:

    def get_routes(self, member_id):
        arguments = ALL_DB_PARAMS
        arguments.update({"MEMBER_ID": member_id})
        print QUERY_GET_ALL_ROUTE.format(**arguments)
        db_results = connection.query_db(
            QUERY_GET_ALL_ROUTE.format(**arguments))
        # db_results = sorted(db_results, key=lambda x: x[self.COL_ROUTE_NAME])
        # for route_name, routes in itertools.groupby(db_results, lambda x: x[self.COL_ROUTE_NAME]):
        #     print route_name, list(routes)
        result = defaultdict(list)
        for db_result in db_results:
            result[db_result[ALL_DB_PARAMS["COL_ROUTE_NAME"]]].append({
                ALL_DB_PARAMS["COL_ROUTE_SOURCE"]: db_result[ALL_DB_PARAMS["COL_ROUTE_SOURCE"]],
                ALL_DB_PARAMS["COL_ROUTE_DESTINATION"]: db_result[ALL_DB_PARAMS["COL_ROUTE_DESTINATION"]],
                ALL_DB_PARAMS["COL_DEPARTURE_TIME"]: db_result[ALL_DB_PARAMS["COL_DEPARTURE_TIME"]],
                ALL_DB_PARAMS["COL_ARRIVAL_TIME"]: db_result[ALL_DB_PARAMS["COL_ARRIVAL_TIME"]],
            })
        return result


if __name__ == "__main__":
    db = RouteDB()
    db.get_routes(2)
