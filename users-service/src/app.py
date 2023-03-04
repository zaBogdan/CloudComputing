import sys
import signal
from core import BaseApp, Settings, MongoDb

from controllers import ProfileController

settings = Settings.get_instance('dev')
server = BaseApp('0.0.0.0', 1337)

def signal_handler(sig, frame):
    print('Exiting now!')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# add all the routes here
server.post('/user/:userId/invite', ProfileController().get_profile)
server.get('/user/profile', lambda req: print('POST /user/profile'))
# end of routes

# add all the middlewares here

# end of middlewares

# connect to the database
mongo = MongoDb()

# add all the context here
server.add_to_ctx('settings', settings)
server.add_to_ctx('mongo', mongo)

# start the server
server.start()