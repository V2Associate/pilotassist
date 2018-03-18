"""
 Controller
"""
from __future__ import absolute_import
from flask import Flask
import simplejson
from server.api.roster import ROSTER
from server.api.route import ROUTE

pa_app = Flask(__name__)

pa_app.register_blueprint(ROSTER, url_prefix='/roster')
pa_app.register_blueprint(ROUTE, url_prefix="/route")

if __name__ == "__main__":
    pa_app.run(host="192.168.1.3", port=6001)
#run_simple('localhost', 6000, pa_app, use_reloader=False)
