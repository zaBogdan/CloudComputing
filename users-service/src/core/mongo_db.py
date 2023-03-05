from pymongo import MongoClient

from .settings import Settings

class MongoDb:
    __DB  = None

    def __init__(self):
        if MongoDb.__DB is not None:
            raise Exception("This class is a singleton!")

        self.settings = Settings.get_instance()
        self.client = MongoClient(self.settings.get_value('Mongo', 'uri'))
        print('MongoDB connected')
        MongoDb.__DB = self.client[self.settings.get_value('Mongo', 'database_name')]

    @staticmethod
    def get_db():
        if MongoDb.__DB is None:
            MongoDb()
        return MongoDb.__DB
