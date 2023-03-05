import logging

from typing import List

class Logger:
    _instance = None

    def __init__(self, file_name: str = 'users.log', logger_name: str = 'users-service'):
        if Logger._instance is not None:
            raise Exception('Logger is a singleton')
        
        self.__file_name = file_name 
        self.__logger_name = logger_name
        self.__handlers = []
        self.logger = None

        handlers = ['file', 'syslog'] # TODO: Get this from config
        self.__add_handlers(handlers)

        self.__build_logger()

        Logger._instance = self
    
    @staticmethod
    def get_logger():
        if Logger._instance is None:
            Logger()
        return Logger._instance.logger

    def __build_logger(self):
        """
        Build the logger. 
        """
        self.logger = logging.getLogger(self.__logger_name)
        self.logger.setLevel(logging.DEBUG)

        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(filename)s:%(lineno)s - %(message)s')

        self.__setup_handlers(formatter)

        for handler in self.__handlers:
            self.logger.addHandler(handler)

    def __setup_handlers(self, formatter: logging.Formatter):
        """
        Setup the handlers. 
        """
        for handler in self.__handlers:
            handler.setLevel(logging.DEBUG)
            handler.setFormatter(formatter)

    def __add_handlers(self, handlers: List[str]) -> None:
        """
        Add handlers to the logger. 
        """
        handler_mapping = {
            'file': logging.FileHandler(self.__file_name, 'w'),
            'syslog': logging.StreamHandler()       
        }

        for handler in handlers:
            h = handler_mapping.get(handler, None)
            if h is None:
                print(f'Warning: Handler {handler} not found')
                continue
            
            self.__handlers.append(h)