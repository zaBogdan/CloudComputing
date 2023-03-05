import sys
import signal
from core import BaseApp, Settings, MongoDb, Executor, Logger

from service import InviteService
from routes import InviteRoutes, ProfileRoutes

settings = Settings.get_instance('dev')
server = BaseApp('127.0.0.1', 1337)
auto_invalidate_codes = Executor('Auto Invalidate Invite Codes', int(settings.get_value('Threads', 'aiic_timeout')) , InviteService.check_for_expired_codes)

def signal_handler(sig, frame):
    auto_invalidate_codes.stop()
    auto_invalidate_codes.join()
    Logger.get_logger().info('Successfully shutdown the application! Bye bye...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# add all the routes here
# profile
ProfileRoutes(server).add_routes()
# invite
InviteRoutes(server).add_routes()
# end of routes

# connect to the database
mongo = MongoDb()

# add all the context here
server.add_to_ctx('settings', settings)
server.add_to_ctx('mongo', mongo)

# start the server
try:
    auto_invalidate_codes.start()
    server.start()
except Exception as e:
    Logger.get_logger().critical('Error while starting the server: %s', e)
    signal_handler(None, None)
    sys.exit(1)