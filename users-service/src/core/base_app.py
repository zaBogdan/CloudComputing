import json
from .server import Server
from .http_handler import HttpHandler
from .logger import Logger

class BaseApp:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.__routes = {
            'GET': [],
            'POST': [],
            'PUT': [],
            'PATCH': [],
            'DELETE': []
        }
        self.__middleware = []
        self.ctx = {
            'settings': None,
            'mongo': None,
            'logger': Logger.get_logger()
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

    def post(self, path, handler, *args):
        self.__add_route('POST', path, handler, *args)
    
    def get(self, path, handler, *args):
        self.__add_route('GET', path, handler, *args)
    
    def put(self, path, handler, *args):
        self.__add_route('PUT', path, handler, *args)

    def patch(self, path, handler, *args):
        self.__add_route('PATCH', path, handler, *args)
    
    def delete(self, path, handler, *args):
        self.__add_route('DELETE', path, handler, *args)

    def add_middleware(self, middleware):
        self.__middleware.append(middleware)
    
    def add_to_ctx(self, key, value):
        self.ctx[key] = value

    def __add_route(self, method, path, handler, *args):
        self.routes[method].append(self.__get_transformed_route(path, handler, *args))
    
    def __get_transformed_route(self, path, handler, *args):
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
            'middleware': list(args)
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