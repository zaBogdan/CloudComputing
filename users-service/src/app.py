import sys
import signal
from core import BaseApp, Settings, MongoDb, Executor, Logger

from controllers import ProfileController, InviteController
from service import InviteService
from middleware import validate_body_middleware

from validators import create_profile_schema, update_profile_schema, create_invite_link, update_invite_link

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
server.get('/user/:userId/profile', ProfileController().get_profile)
server.post(
    '/user/:userId/profile',
    ProfileController().post_create_profile,
    validate_body_middleware(create_profile_schema)
)
server.put(
    '/user/:userId/profile',
    ProfileController().put_update_profile,
    validate_body_middleware(update_profile_schema)
)
server.delete('/user/:userId/profile', ProfileController().delete_profile)

# invite
server.get('/user/:userId/invites/:inviteId', InviteController().get_specific_invite)
server.get('/user/:userId/invites', InviteController().get_all_invites_for_user)
server.post(
    '/user/:userId/invites', 
    InviteController().post_new_invite,
    validate_body_middleware(create_invite_link)
)
server.put(
    '/user/:userId/invites/:inviteId',
    InviteController().put_update_invite,
    validate_body_middleware(update_invite_link)
)
server.delete('/user/:userId/invites/:inviteId', InviteController().delete_invite)

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