from core import MongoDb

class BaseModel:
    def __init__(self, collection_name: str):
        self.__collection = None
        self.set_database(collection_name)

    def to_json(self):
        data_dict = dict()
        for val in self.__dict__:
            if val is None:
                continue
            if val.startswith('_'):
                continue
            data_dict[val] = self.__dict__[val]
        return data_dict
    
    def set_database(self, collection_name: str):
        self.__collection = MongoDb.get_db()[collection_name]

    def save(self):
        if self._id is None:
            return self.create()
        return self.update()
    
    def create(self):
        return self.__collection.insert_one(self.to_json())

    def update(self):
        return self.__collection.update_one({'_id': self._id}, {'$set': self.to_json()})
    
    def delete(self):
        return self.__collection.delete_one({'_id': self._id})
    
    def find(self, query):
        collection = self.__collection.find_one(query)
        if collection is None:
            return None
        return self.__class__(**collection)
    
    def find_many(self, query, *args, **kwargs):
        return self.__collection.find(query, *args, **kwargs)