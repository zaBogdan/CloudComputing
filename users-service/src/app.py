import sys
import signal
from core import BaseApp, Settings, MongoDb, Executor

from controllers import ProfileController, InviteController
from service import InviteService

settings = Settings.get_instance('dev')
server = BaseApp('0.0.0.0', 1337)
auto_invalidate_codes = Executor('Auto Invalide Codes', 10, InviteService.check_for_expired_codes)

def signal_handler(sig, frame):
    auto_invalidate_codes.stop()
    auto_invalidate_codes.join()
    print('Exiting now!')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# add all the routes here
# profile
server.get('/user/:userId/profile', ProfileController().get_profile)
server.post('/user/:userId/profile', ProfileController().post_create_profile)
server.put('/user/:userId/profile', ProfileController().put_update_profile)
server.delete('/user/:userId/profile', ProfileController().delete_profile)

# invite
server.get('/user/:userId/invites/:inviteId', InviteController().get_specific_invite)
server.get('/user/:userId/invites', InviteController().get_all_invites_for_user)
server.post('/user/:userId/invites', InviteController().post_new_invite)
server.put('/user/:userId/invites/:inviteId', InviteController().put_update_invite)
server.delete('/user/:userId/invites/:inviteId', InviteController().delete_invite)

# end of routes

# add all the middlewares here
# empty for now, might add authentication & authorization later
# end of middlewares

# connect to the database
mongo = MongoDb()

# add all the context here
server.add_to_ctx('settings', settings)
server.add_to_ctx('mongo', mongo)

# start the server
auto_invalidate_codes.start()
server.start()