import pymysql


class DBConnection(object):

    def __init__(
        self,
        database,
        username,
        password,
        server="",
    ):
        self.server = server
        self.database = database
        self.username = username
        self.password = password

        self.connection = None
    # TODO implement retry

    def query_db(self, query):
        """
        Connects to teradata, gets the data and returns result
        """
        cursor = None
        if self.connection is None:
            self.connection = self.get_connection(
                server=self.server,
                database=self.database,
                username=self.username,
                password=self.password)
        try:
            cursor = self.connection.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
        except:
            self.connection = self.get_connection(server=self.server,
                                                  database=self.database,
                                                  username=self.username,
                                                  password=self.password)
            raise
        finally:
            if cursor:
                cursor.close()
                del cursor
        return rows

    def get_connection(self, **dbargs):
        return pymysql.connect(host=dbargs['server'],
                               user=dbargs['username'],
                               password=dbargs['password'],
                               db=dbargs['database'],
                               cursorclass=pymysql.cursors.DictCursor, autocommit=True)
