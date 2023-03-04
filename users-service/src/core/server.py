import socketserver

class Server:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.httpd = None

    def start(self, handler):
        print('Starting server')
        with socketserver.TCPServer((self.host, self.port), handler) as httpd:
            self.httpd = httpd
            self.httpd.daemon_threads = True
            print('Serving at port', self.port)
            try: 
                self.httpd.serve_forever()
            except KeyboardInterrupt:
                pass
    
    def close(self):
        if not self.httpd:
            return
        print('Stopping server')
        self.httpd.socket.close()
        self.httpd.shutdown()
        self.httpd.server_close()