from __future__ import absolute_import
import simplejson
from flask import Blueprint, request, Response
from server.db import RouteDB
from server.api.cross_domain import crossdomain

ROUTE = Blueprint('route', __name__)


@ROUTE.route("/<int:member_id>", methods=['GET'])
@crossdomain(origin='*')
def get_all_routes(member_id):
    # This method queries route table and gives the output in format
    # consumable by UI
    # Format :{
    #  "routename": [
    #   {
    #      source:
    #      destination:
    #      source_time:
    #      destination_time
    #   }
    # ],
    #  "routename1": [
    #   {
    #      source:
    #      destination:
    #      source_time:
    #      destination_time
    #   }
    # ]
    #}
    _db = RouteDB()
    result = _db.get_routes(member_id)
    return simplejson.dumps(result)
