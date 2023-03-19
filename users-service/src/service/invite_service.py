from datetime import datetime

from core.errors import ExceptionWithStatusCode
from core import Logger
from models import ProfileModel, InviteModel

from utils.time import get_timedelta_from_string
from utils.crypto import generate_random_invite_code

class InviteService:
    INVITE_CODE_LENGTH = 16

    def get_invite_by_id(invite_id: str) -> dict:
        if invite_id is None:
            raise ExceptionWithStatusCode('Invite ID is required', 400)

        invite = InviteModel().find({ 'invite_code': invite_id })
        if invite is None:
            raise ExceptionWithStatusCode('Invite does not exist', 404)

        return invite

    @staticmethod
    def get_all_invites(user_id: str, active: bool = True) -> list:
        if user_id is None:
            raise ExceptionWithStatusCode('User ID is required', 400)
        
        user_mongo_id = ProfileModel().find({ 'username': user_id })
        if user_mongo_id is None:
            raise ExceptionWithStatusCode('User does not exist', 404)

        user_mongo_id = user_mongo_id._id

        invites = InviteModel().find_many({ 'user_id': user_mongo_id, 'active': active }, {
            '_id': 0,
            'user_id': 0,
        })
        if invites is None:
            return []
        return list(invites)

    @staticmethod
    def create_invite_code(user_id: str, body: dict) -> dict:
        if user_id is None:
            raise ExceptionWithStatusCode('User ID is required', 400)
        
        if ProfileModel().find({ 'email': body.get('email', '') }) is not None:
            raise ExceptionWithStatusCode('User can\'t be invited to our platform.', 400)

        if InviteModel().find({ 
            'email': body.get('email', ''),
            'active': True
        }) is not None:
            raise ExceptionWithStatusCode('Email has already an active invite link.', 409)

        user_profile = ProfileModel().find({ 'username': user_id })

        if user_profile is None:
            raise ExceptionWithStatusCode('User does not exist', 404)

        user_email_already_exists = ProfileModel().find({ 'email': body.get('Email', '') })
        if user_email_already_exists is not None:
            raise ExceptionWithStatusCode('Email already exists', 409)
        
        expire_in = get_timedelta_from_string(body.get('expireIn', '1m'))
        if expire_in is None:
            raise ExceptionWithStatusCode('Invalid \'expireIn\' value', 400)

        invite_code = generate_random_invite_code(InviteService.INVITE_CODE_LENGTH)

        model = InviteModel(
            user_id=user_profile._id,
            email=body.get('email', ''),
            expire_date=expire_in,
            invite_code=invite_code,
        )

        model.save()

        return {
            'expireDate': str(expire_in),
            'inviteCode': invite_code,
        }
    
    @staticmethod
    def update_invite(user_id: str, invite_id: str, body: dict) -> dict:
        if len(body.keys()) == 0 or 'active' not in body.keys():
            raise ExceptionWithStatusCode('No values to update', 400)

        if user_id is None or invite_id is None:
            raise ExceptionWithStatusCode('User ID and Invite ID are required', 400)
        
        user_profile = ProfileModel().find({ 'username': user_id })

        if user_profile is None:
            raise ExceptionWithStatusCode('User does not exist', 404)
        
        invite = InviteModel().find({
            'user_id': user_profile._id,
            'invite_code': invite_id,
        })

        if invite is None:
            raise ExceptionWithStatusCode('Invite does not exist', 404)
        
        if invite.active is False and datetime.now() > invite.expire_date and body.get('active') is True:
            raise ExceptionWithStatusCode('Invite code is expired. Try to generate a new one!', 404)

        invite.active = body.get('active')
        invite.save()

        return {
            'active': invite.active,
            'email': invite.email,
            'expireDate': str(invite.expire_date),
        }
    
    @staticmethod
    def disable_invite_code(invite_id: str) -> dict:
        if invite_id is None:
            raise ExceptionWithStatusCode('Invite ID is required', 400)
        
        invite = InviteModel().find({ 'invite_code': invite_id })

        if invite is None:
            raise ExceptionWithStatusCode('Invite does not exist', 404)
        
        invite.active = False
        invite.save()

        return {
            'active': invite.active,
            'email': invite.email,
            'expireDate': str(invite.expire_date),
        }
    
    @staticmethod
    def delete_invite(user_id: str, invite_id: str) -> dict:
        if user_id is None or invite_id is None:
            raise ExceptionWithStatusCode('User ID and Invite ID are required', 400)
        
        user_profile = ProfileModel().find({ 'username': user_id })

        if user_profile is None:
            raise ExceptionWithStatusCode('User does not exist', 404)
        
        invite = InviteModel().find({
            'user_id': user_profile._id,
            'invite_code': invite_id,
        })

        if invite is None:
            raise ExceptionWithStatusCode('Invite does not exist', 404)
        
        invite.delete()

    @staticmethod
    def check_for_expired_codes() -> bool:
        Logger.get_logger().info(f'Checking for expired invite codes...')
        invites = InviteModel().find_many({ 'active': True })

        if invites is None:
            return False
        
        for invite in invites:
            invite = InviteModel(**invite)
            if datetime.now() > invite.expire_date:
                invite.active = False
                invite.save()
                Logger.get_logger().info(f'Invite code {invite.invite_code} has been disabled.')

        return True