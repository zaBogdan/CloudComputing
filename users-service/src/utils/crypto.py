import string
import secrets

def generate_random_invite_code(length: int = 8):
    characters = string.ascii_uppercase + string.ascii_lowercase + string.digits
    code = ''.join(secrets.choice(characters) for i in range(length))
    return code
