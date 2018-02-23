import pymysql
import time
import random
import datetime
import calendar
from server.common import get_date_as_timestamp


connection = pymysql.connect(host="localhost",
                             user="root",
                             password="",
                             db="pilotassist",
                             cursorclass=pymysql.cursors.DictCursor, autocommit=True)


def populate(populate_for):
    cur_datetime = datetime.datetime.utcnow()
    cur_time = calendar.timegm(datetime.datetime(
        cur_datetime.year, cur_datetime.month, cur_datetime.day+populate_for).utctimetuple()) + (3600 * random.randint(1, 6))

    query = "insert into trip_details values(%s,'Boeing-8',%s,%s, 0,0,1,%s)"
    try:
        with connection.cursor() as cursor:
            for i in range(0, 4):
                start_time = cur_time + 3600  # 1 hr rest from previous
                end_time = cur_time + ((i+random.randint(1, 4))*3600)
                cursor.execute(
                    query, (get_date_as_timestamp(start_time), start_time, end_time, random.randint(1, 14)))
                cur_time = end_time
            connection.commit()
    finally:
        pass
        # connection.close()


for i in (-2, -1, 0, 1, 2):
    populate(i)
