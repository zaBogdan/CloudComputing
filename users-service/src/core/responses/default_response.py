class DefaultResponse:
    def __json__(self):
        return self.__dict__