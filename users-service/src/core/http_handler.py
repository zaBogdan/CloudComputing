import re
import json
from http.server import SimpleHTTPRequestHandler

class HttpHandler(SimpleHTTPRequestHandler):
    def __init__(self, ctx, custom_routes, custom_middleware, *args, **kwargs):
        print('Intiiating HttpHandler')
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

        return found_route.get('handler')

    def send_json(self, status_code: int, data: dict, headers: dict = {}):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        for name, value in headers.items():
            self.send_header(name, value)
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def default_handler_404(self):
        self.send_response(404)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({
            'success': False,
            'message': f'No route found for {self.path}'
        }).encode('utf-8'))