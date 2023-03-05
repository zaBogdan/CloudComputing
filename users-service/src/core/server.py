import socketserver

from .logger import Logger

class Server:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.logger = Logger.get_logger()
        self.httpd = None

    def start(self, handler):
        self.logger.debug('Starting server')
        with socketserver.TCPServer((self.host, self.port), handler) as httpd:
            self.httpd = httpd
            self.httpd.daemon_threads = True
            self.logger.info('Serving at port %d', self.port)
            try: 
                self.httpd.serve_forever()
            except KeyboardInterrupt:
                pass
    
    def close(self):
        if not self.httpd:
            return
        self.logger.info('Stopping server')
        self.httpd.socket.close()
        self.httpd.shutdown()
        self.httpd.server_close()