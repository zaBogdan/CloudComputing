from core.responses import ErrorResponse

def validate_auth_middleware(request):
    if request.headers.get('Authorization') is None:
        return request.send_json(401, ErrorResponse('Authorization header is missing'))
    
    authorization = request.headers.get('Authorization')
    if authorization.split(' ')[0] != 'Bearer':
        return request.send_json(401, ErrorResponse('Authorization header is missing'))
    
    token = authorization.split(' ')[1]
    print('Token: ', token)
    return True