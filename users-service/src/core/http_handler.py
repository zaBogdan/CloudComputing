import re
import json
import datetime
from bson.objectid import ObjectId

from .responses.default_response import DefaultResponse
from http.server import SimpleHTTPRequestHandler

class HttpHandler(SimpleHTTPRequestHandler):
    def __init__(self, ctx, custom_routes, custom_middleware, *args, **kwargs):
        self.routes = custom_routes
        self.middleware = custom_middleware
        self.ctx = ctx

        super().__init__(*args, **kwargs)

    def do_GET(self):
        path_handler = self.__build_request('GET')
        if not path_handler:
            return self.default_handler_404()
        return path_handler(self)

    def do_POST(self):
        path_handler = self.__build_request('POST')
        if not path_handler:
            return self.default_handler_404()
        return path_handler(self)
    
    def do_PUT(self):
        path_handler = self.__build_request('PUT')
        if not path_handler:
            return self.default_handler_404()
        return path_handler(self)

    def do_DELETE(self):
        path_handler = self.__build_request('DELETE')
        if not path_handler:
            return self.default_handler_404()
        return path_handler(self)
    
    def do_PATCH(self):
        path_handler = self.__build_request('PATCH')
        if not path_handler:
            return self.default_handler_404()
        return path_handler(self)

    def __build_request(self, method):
        found_route = None

        for route in self.routes[method]:
            match = re.match(route.get('path', ''), self.path.split('?')[0], re.IGNORECASE)
            if match is not None:
                found_route = route
                break

        if not found_route:
            return None

        # building url params
        self.params = {}
        for param in found_route.get('params', []):
            self.params[param] = match.group(param)
        
        # building query params
        self.query_params = {}
        if '?' in self.path:
            query_params = self.path.split('?')[1].split('&')
            for query_param in query_params:
                query_param = query_param.split('=')
                self.query_params[query_param[0]] = query_param[1]

        if method in ['POST', 'PUT', 'PATCH']:
            self.body = self.__get_body()
        else:
            self.body = dict()

        for middleware in found_route.get('middleware', []):
            if middleware(self) is not True:
                return lambda x: None

        return found_route.get('handler')
    
    def __get_body(self):
        content_length = int(self.headers['Content-Length'])
        data = self.rfile.read(content_length).decode('utf-8')
        
        if self.headers['Content-Type'] == 'application/json':
            return json.loads(data)
        
        return data

    def send_json(self, status_code: int, data: dict, headers: dict = {}):
        self.send_response(status_code)
        if data is None:
            self.end_headers()
            return
        self.send_header('Content-type', 'application/json')
        for name, value in headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(json.dumps(data, default=self.__default_json_dumps).encode('utf-8'))

    def __default_json_dumps(self, obj):
        if isinstance(obj, DefaultResponse):
            return obj.__json__()
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        if isinstance(obj, ObjectId):
            return str(obj)
        if hasattr(obj, 'to_json'):
            return obj.to_json()
        
        return json.JSONEncoder.default(self, obj)
        

    def default_handler_404(self):
        self.send_response(404)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            'success': False,
            'message': f'No route found for {self.path}'
        }).encode('utf-8'))