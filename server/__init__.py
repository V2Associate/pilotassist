"""
 Controller
"""
from __future__ import absolute_import
from flask import Flask
import simplejson
from server.api.roster import ROSTER

pa_app = Flask(__name__)

pa_app.register_blueprint(ROSTER, url_prefix='/roster')

if __name__ == "__main__":
    pa_app.run(host="localhost", port=6001)
#run_simple('localhost', 6000, pa_app, use_reloader=False)
