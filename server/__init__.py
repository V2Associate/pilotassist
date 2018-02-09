from flask import Flask, Blueprint
import simplejson

pa_app = Flask(__name__)

profiles = {}
profiles['chandu'] = {'name': 'chandu', 'dob': '25-aug-1985', 'flowhours': 1040, 'company': 'indigo', 'Doj': '12-Aug-2014'}
profiles['veera'] = {'name': 'veera', 'dob': '25-aug-1980', 'flowhours': 1500, 'company': 'indigo', 'Doj': '12-Aug-2010'}
profiles['guru'] = {'name': 'guru', 'dob': '25-aug-1982', 'flowhours': 1200, 'company': 'air India', 'Doj': '12-Aug-2012'}
profiles['nanda'] = {'name': 'nanda', 'dob': '25-Dec-1982', 'flowhours': 1210, 'company': 'air India', 'Doj': '12-Aug-2011'}

leaves_summary = {}
leaves_summary['chandu'] = {'Earn': 10, 'Earn_Availed':2, "SickLeave": 3, "SickLeave_Availed": 6}
leaves_summary['veera'] = {'Earn': 40, 'Earn_Availed':2, "SickLeave": 3, "SickLeave_Availed": 6}
leaves_summary['guru'] = {'Earn': 40, 'Earn_Availed':20, "SickLeave": 3, "SickLeave_Availed": 6}
leaves_summary['nanda'] = {'Earn': 40, 'Earn_Availed':2, "SickLeave": 0, "SickLeave_Availed": 6}


roster_info = {}

roster_info['chandu'] = [ {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'BANGALORE(BLR)', 'TO': 'VISAKHAPATNAM(VSKP)', 'ETD': '08:15(IST)', 'ETD': '09:45(IST)', 'EstDuration': '1h 30m', 'ATD': '08:20(IST)', 'ATA': '9:45(IST)', 'ActDuration': '1h 25m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'VISAKHAPATNAM(VSKP)', 'TO': 'BHUVANESHWAR(BHU)', 'ETD': '10:45(IST)', 'ETD': '13:10(IST)', 'EstDuration': '2h 25m', 'ATD': '10:45(IST)', 'ATA': '13:45(IST)', 'ActDuration': '3h 00m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'BHUVANESHWAR(BHU)', 'TO': 'CHENNAI(CHN)', 'ETD': '15:15(IST)', 'ETD': '18:45(IST)', 'EstDuration': '3h 30m', 'ATD': '15:20(IST)', 'ATA': '18:30(IST)', 'ActDuration': '2h 50m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'CHENNAI(BLR)', 'TO': 'BANGALORE(BLR)', 'ETD': '10::15(IST)', 'ETD': '11:45(IST)', 'EstDuration': '1h 30m'}]

roster_info['veera'] = [ {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'BANGALORE(BLR)', 'TO': 'VISAKHAPATNAM(VSKP)', 'ETD': '08:15(IST)', 'ETD': '09:45(IST)', 'EstDuration': '1h 30m', 'ATD': '08:20(IST)', 'ATA': '9:45(IST)', 'ActDuration': '1h 25m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'VISAKHAPATNAM(VSKP)', 'TO': 'BHUVANESHWAR(BHU)', 'ETD': '10:45(IST)', 'ETD': '13:10(IST)', 'EstDuration': '2h 25m', 'ATD': '10:45(IST)', 'ATA': '13:45(IST)', 'ActDuration': '3h 00m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'BHUVANESHWAR(BHU)', 'TO': 'CHENNAI(CHN)', 'ETD': '15:15(IST)', 'ETD': '18:45(IST)', 'EstDuration': '3h 30m', 'ATD': '15:20(IST)', 'ATA': '18:30(IST)', 'ActDuration': '2h 50m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'CHENNAI(BLR)', 'TO': 'BANGALORE(BLR)', 'ETD': '10::15(IST)', 'ETD': '11:45(IST)', 'EstDuration': '1h 30m'}]

roster_info['guru'] = [ {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'BANGALORE(BLR)', 'TO': 'VISAKHAPATNAM(VSKP)', 'ETD': '08:15(IST)', 'ETD': '09:45(IST)', 'EstDuration': '1h 30m', 'ATD': '08:20(IST)', 'ATA': '9:45(IST)', 'ActDuration': '1h 25m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'VISAKHAPATNAM(VSKP)', 'TO': 'BHUVANESHWAR(BHU)', 'ETD': '10:45(IST)', 'ETD': '13:10(IST)', 'EstDuration': '2h 25m', 'ATD': '10:45(IST)', 'ATA': '13:45(IST)', 'ActDuration': '3h 00m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'BHUVANESHWAR(BHU)', 'TO': 'CHENNAI(CHN)', 'ETD': '15:15(IST)', 'ETD': '18:45(IST)', 'EstDuration': '3h 30m', 'ATD': '15:20(IST)', 'ATA': '18:30(IST)', 'ActDuration': '2h 50m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'CHENNAI(BLR)', 'TO': 'BANGALORE(BLR)', 'ETD': '10::15(IST)', 'ETD': '11:45(IST)', 'EstDuration': '1h 30m'}]

roster_info['nanda'] = [ {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'BANGALORE(BLR)', 'TO': 'VISAKHAPATNAM(VSKP)', 'ETD': '08:15(IST)', 'ETD': '09:45(IST)', 'EstDuration': '1h 30m', 'ATD': '08:20(IST)', 'ATA': '9:45(IST)', 'ActDuration': '1h 25m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE123', 'FROM': 'VISAKHAPATNAM(VSKP)', 'TO': 'BHUVANESHWAR(BHU)', 'ETD': '10:45(IST)', 'ETD': '13:10(IST)', 'EstDuration': '2h 25m', 'ATD': '10:45(IST)', 'ATA': '13:45(IST)', 'ActDuration': '3h 00m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'BHUVANESHWAR(BHU)', 'TO': 'CHENNAI(CHN)', 'ETD': '15:15(IST)', 'ETD': '18:45(IST)', 'EstDuration': '3h 30m', 'ATD': '15:20(IST)', 'ATA': '18:30(IST)', 'ActDuration': '2h 50m'}, {'date': '27-Dec-2017', 'AircraftModel': 'AE1234', 'FROM': 'CHENNAI(BLR)', 'TO': 'BANGALORE(BLR)', 'ETD': '10::15(IST)', 'ETD': '11:45(IST)', 'EstDuration': '1h 30m'}]

@pa_app.route('/rosterInfo/<profile>/', methods=['GET'])
def get_pilot_roster_info(profile):
  return simplejson.dumps(roster_info[profile])

@pa_app.route('/profileDetails/<profile>/', methods=['GET'])
def get_pilot_details(profile):
  return simplejson.dumps(profiles[profile])

@pa_app.route('/leavesummary/<profile>/', methods=['GET'])
def get_pilot_leave_summary(profile):
  return simplejson.dumps(leaves_summary[profile])

@pa_app.route('/FTDL/<profile>/', methods=['GET'])
def is_FTDL_reached(profile):
  return 'chandu is pilot'

pa_app.run()

