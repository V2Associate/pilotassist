
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
@crossdomain(origin='http://localhost:5000')
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


@ROSTER.route("/<int:memberid>", methods=['POST'])
def add_trip_to_roster(member_id, trip):
    """Adds a new trip to the memberss roster
    Decorators:
        ROSTER
    Arguments:
        member_id {[number]} -- Id that uniquely identies this member
        trip: {[Trip]} -- Details about the trip
    """

    print member_id
