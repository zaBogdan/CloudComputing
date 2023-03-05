import json
from .server import Server
from .http_handler import HttpHandler

class BaseApp:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.__routes = {
            'GET': [],
            'POST': [],
            'PUT': [],
            'DELETE': []
        }
        self.__middleware = []
        self.ctx = {
            'settings': None,
            'mongo': None,
        }
        self.server = None

    @property
    def routes(self):
        return self.__routes

    @property
    def middleware(self):
        return self.__middleware
    
    def start(self):
        self.server = Server(self.host, self.port)
        self.server.start(self.__http_handler_closure)

    def close(self):
        self.server.close()

    def post(self, path, handler):
        self.__add_route('POST', path, handler)
    
    def get(self, path, handler):
        self.__add_route('GET', path, handler)
    
    def put(self, path, handler):
        self.__add_route('PUT', path, handler)

    def patch(self, path, handler):
        self.__add_route('PATCH', path, handler)
    
    def delete(self, path, handler):
        self.__add_route('DELETE', path, handler)

    def add_middleware(self, middleware):
        self.__middleware.append(middleware)
    
    def add_to_ctx(self, key, value):
        self.ctx[key] = value

    def __add_route(self, method, path, handler):
        self.routes[method].append(self.__get_transformed_route(path, handler))
    
    def __get_transformed_route(self, path, handler):
        params = []
        for component in path.split('/'):
            if not component.startswith(':'):
                continue
            path = path.replace(component, f'(?P<{component[1:]}>[a-zA-Z0-9]+)')
            params.append(component[1:])
        
        path = f'^{path}$'
        
        return {
            'path': path,
            'handler': handler,
            'params': params,
        }

    def __http_handler_closure(self, *args, **kwargs):
        return HttpHandler(self.ctx, self.routes, self.middleware, *args, **kwargs)

    def invite_user(self, request):
        """
        TEMPORARY
        """
        request.send_response(200)
        request.send_header('Content-type', 'application/json')
        request.end_headers()
        request.wfile.write(json.dumps({
            'success': True,
            'message': 'Invited user'
        }).encode('utf-8'))