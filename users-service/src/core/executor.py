from time import sleep
from threading import Thread, Event

class Executor(Thread):
    def __init__(self, name = 'Executor', interval = 10, cb = None):
        super().__init__()
        self.name = name
        self.cb = cb
        self.interval = interval
        self._stop_event = Event()
    
    def run(self):
        if self.cb is None:
            print('Failed to start executor thread')
            return
        print(f'Started {self.name} thread')
        
        counter = 0
        while not self._stop_event.is_set():
            if counter >= self.interval:
                self.cb()
                counter = 0
                continue

            counter += 1
            sleep(1)


    def stop(self):
        print(f'Exiting {self.name} thread')
        self._stop_event.set()