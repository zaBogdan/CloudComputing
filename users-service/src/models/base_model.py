class BaseModel:
    def to_json(self):
        print(self.__dict__)
        return self.__dict__