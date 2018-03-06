
"""
All functionalities that are related to Roster entity
"""
from __future__ import absolute_import
import simplejson
from flask import Blueprint, request, Response
from server.db import DB
from server.common import Roster
from server.api.cross_domain import crossdomain

ROSTER = Blueprint('roster', __name__)


@ROSTER.route("/<int:member_id>", methods=['GET'])
@crossdomain(origin='*')
def roster_details(member_id):
    """Get the roster details for a particular member

    Decorators:
        ROSTER
    Arguments:
        member_id {[number]} -- [Id that uniquely identies this member]

    """
    _db = DB()
    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")
    result = _db.get_roster_details(
        member_id, start_time=start_time, end_time=end_time)
    output = simplejson.dumps(Roster.serialize(result))
    return Response(output, mimetype="application/json")


@ROSTER.route("/<int:member_id>", methods=['POST', 'OPTIONS'])
@crossdomain(origin='*',  headers={'content-type': 'application/json'})
def add_trip_to_roster(member_id):
    """Adds a new trip to the memberss roster
    Decorators:
        ROSTER
    Arguments:
        member_id {[number]} -- Id that uniquely identies this member
    """
    request_data = request.get_json()
    # TODO do the validation
    _db = DB()
    _db.add_trip_to_roster(request_data)
    return Response("", status=200)


@ROSTER.route("/<int:member_id>", methods=['DELETE', 'OPTIONS'])
@crossdomain(origin='*', headers={'content-type': 'application/json'})
def delete_trip_from_roster(member_id):
    request_data = request.get_json()
    # request_data = request.form
    flight_number = request_data.get("flight_number")
    date = request_data.get("date")
    if not flight_number or not date:
        return Response("", status=404)
    else:
        _db = DB()
        _db.delete_trip_from_roster(member_id, date, flight_number)
        return Response("", status=200)
