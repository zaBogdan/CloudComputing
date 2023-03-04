from pymongo import MongoClient

from .settings import Settings

class MongoDb:
    def __init__(self):
        self.settings = Settings.get_instance()
        self.client = MongoClient(self.settings.get_value('Mongo', 'uri'))
        self.db = self.client[self.settings.get_value('Mongo', 'database_name')]