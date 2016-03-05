#!/usr/bin/env python3
import os
import http.server
import json
import urllib.parse
import numpy

WEBROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "webroot")

def sensor(name, start, end, resolution=1):
    start = float(start)
    end = float(end)
    resolution = float(resolution)
    time = numpy.arange(start, end, resolution)
    return {
        'sensor': name,
        'time': list(time),
        'value': list(numpy.random.normal(size=len(time))),
    }

PROCEDURES = dict(sensor=sensor)

class Handler(http.server.SimpleHTTPRequestHandler):
    def respond(self, code, value):
        self.send_response(code)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(value, indent=4).encode('utf-8') + b'\n')

    def error(self, code, reason):
        self.respond(code, {"ok": False, "error": reason})

    def ok(self, value):
        self.respond(200, {"ok": True, "value": value})

    def do_GET(self):
        if not self.path.startswith('/rpc/'):
            return super().do_GET()

        try:
            path = urllib.parse.urlparse(self.path)
            params = dict(urllib.parse.parse_qsl(path.query))

            try:
                procname = path.path.split('/')[2]
            except IndexError:
                return self.error(400, "Procedure not specified.")
            if procname not in PROCEDURES:
                return self.error(404, "No such procedure: {}".format(procname))
            try:
                result = PROCEDURES[procname](**params)
            except TypeError as e:
                return self.error(400, "{}".format(e))
            return self.ok(result)
        except:
            self.error(501, "Internal server error.")
            raise


def main():
    os.chdir(WEBROOT)
    httpd = http.server.HTTPServer(("", 8000), Handler)
    print("Serving on http://0.0.0.0:8000")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
