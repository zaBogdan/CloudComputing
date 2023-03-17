from pymongo import MongoClient

from .logger import Logger
from .settings import Settings

class MongoDb:
    __DB  = None

    def __init__(self):
        if MongoDb.__DB is not None:
            raise Exception("This class is a singleton!")

        self.settings = Settings.get_instance()
        uri = "mongodb://{}:{}@{}:{}/".format(
            self.settings.get_value('Mongo', 'username'),
            self.settings.get_value('Mongo', 'password'),
            self.settings.get_value('Mongo', 'host'),
            self.settings.get_value('Mongo', 'port'),
            )
        self.client = MongoClient(uri)
        Logger.get_logger().info('Successfully started a connection with MongoDB')
        MongoDb.__DB = self.client[self.settings.get_value('Mongo', 'collection')]

    @staticmethod
    def get_db():
        if MongoDb.__DB is None:
            MongoDb()
        return MongoDb.__DB
