import configparser

from .logger import Logger

class Settings:
    __INSTANCE = None

    def __init__(self, config_file):
        if Settings.__INSTANCE is not None:
            raise Exception('This class is a singleton!')
        
        self.logger = Logger.get_logger()
        self.__configuration = {}

        self.config = self.__load_config(config_file)

        Settings.__INSTANCE = self

    @staticmethod
    def get_instance(config_file = 'dev'):
        if Settings.__INSTANCE is None:
            Settings(config_file)
        return Settings.__INSTANCE
    
    def get_value(self, category: str, name: str) -> str:
        if category not in self.__configuration:
            return None
        if name not in self.__configuration[category]:
            return None
        return self.__configuration[category][name]

    def __load_config(self, config_file: str):
        self.logger.debug('Starting to load config file')
        
        config = configparser.ConfigParser(converters={"any": lambda x: str(x)})

        fileName = f"config/{config_file}.ini"

        config.read(fileName)
        for section in config.sections():
            section_n = config[section]
            self.__configuration[section] = {}
            for key in section_n:
                self.__configuration[section][key] = config.getany(section, key)
