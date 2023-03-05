from datetime import datetime
from .base_model import BaseModel

class InviteModel(BaseModel):
    def __init__(self,
        user_id: str = '',
        email: str = '',
        expire_date: str = '',
        invite_code: str = '',
        active: bool = True,
        created_at: datetime = None,
        _id=None
    ):
        super().__init__('invites')
        self._id = _id
        self.user_id = user_id
        self.email = email
        self.expire_date = expire_date
        self.created_at = created_at
        if created_at is None:
            self.created_at = datetime.now()
        self.active = active
        self.invite_code = invite_code
        