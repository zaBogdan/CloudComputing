from core.errors import ExceptionWithStatusCode
from models import ProfileModel, InviteModel

from utils.time import get_timedelta_from_string
from utils.crypto import generate_random_invite_code

class InviteService:
    INVITE_CODE_LENGTH = 16

    @staticmethod
    def create_invite_code(user_id: str, body: dict) -> str:
        if user_id is None:
            raise ExceptionWithStatusCode('User ID is required', 400)
        
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
            user_id=user_profile.get('_id'),
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
    def check_for_expired_codes() -> bool:
        print(f'Checking for expired invite codes...')
        return True