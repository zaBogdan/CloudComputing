import re
from datetime import timedelta, datetime

def get_timedelta_from_string(expires_in: str):
    match = re.match(r'(\d+)([dhms])', expires_in)

    if not match:
        return None
    
    quantity, unit = match.groups()
    delta = timedelta(**{{
        'd': 'days',
        'h': 'hours',
        'm': 'minutes',
        's': 'seconds',
    }.get(unit, 'minutes'): int(quantity)})
    max_expire_in = timedelta(weeks=1)
    
    if delta > max_expire_in:
        raise ValueError(f'Expires in value must be less than 1 week')

    return datetime.now() + delta