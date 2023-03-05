from time import sleep
from threading import Thread, Event

from .logger import Logger

class Executor(Thread):
    def __init__(self, name = 'Executor', interval = 10, cb = None):
        super().__init__()
        self.logger = Logger.get_logger()
        self.name = name
        self.cb = cb
        self.interval = interval
        self._stop_event = Event()
    
    def run(self):
        if self.cb is None:
            self.logger.error('Failed to start executor thread')
            return
        self.logger.info('Started \'%s\' thread with a timeout of %d seconds', self.name, self.interval)
        
        counter = 0
        while not self._stop_event.is_set():
            if counter >= self.interval:
                self.cb()
                counter = 0
                continue

            counter += 1
            sleep(1)
        self.logger.info('Successfully exited thread \'%s\'', self.name)

    def stop(self):
        self.logger.info('Exiting \'%s\' thread', self.name)
        self._stop_event.set()