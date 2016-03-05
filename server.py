#!/usr/bin/env python3
import os
import http.server
import json
import urllib.parse
import numpy
import multiprocessing
import serial
import time


SERIAL_DEVICE = "/dev/ttyACM0"
SERIAL_RATE = 115200
HTTP_HOST = '127.0.0.1'
HTTP_PORT = 8000


class Arduino:
    def __init__(self):
        self.pipe = None

    def parse_status(self, line):
        line = line.decode('ascii')
        status = self.last_status.copy()
        for kv in line.strip().split(','):
            yield kv.split(':', 1)

    def interact(self, pipe):
        serial = serial.Serial(SERIAL_DEVICE, SERIAL_RATE)
        while True:
            try:
                while self.pipe.poll():
                    cmd = self.pipe.recv()
                    line = ' '.join(str(x) for x in cmd)
                    serial.write(line.encode('ascii'))
            except Empty:
                pass
            line = self.serial.readline()
            for x in self.parse_status(line):
                self.pipe.send(x)

    def start(self):
        self.pipe, child_conn = multiprocessing.Pipe()
        multiprocessing.Process(target=self.interact, args=(child_conn,))

    def command(name, *args):
        assert(self.pipe)
        self.pipe.send((name,) + args)


ARDUINO = Arduino()

PROCEDURES = {}
def procedure(fn):
    PROCEDURES[fn.__name__] = fn
    return fn

@procedure
def sensor_list():
    return [{
        'temp': 'Random temperature'
    }]

@procedure
def sensor(name, start, end=None, resolution=1):
    if end is None:
        end = time.time()
    start = float(start)
    end = float(end)
    resolution = float(resolution)
    time = numpy.arange(start, end, resolution)
    return {
        'sensor': name,
        'time': list(time),
        'value': list(numpy.random.normal(size=len(time))),
    }

@procedure
def set_window(open):
    ARDUINO.command("window", int(open))
    return position

@procedure
def set_door(open):
    ARDUINO.command("door", int(open))
    return position

@procedure
def set_pump(on):
    ARDUINO.command("pump", int(open))
    return position


WEBROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "webroot")

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
    httpd = http.server.HTTPServer((HTTP_HOST, HTTP_PORT), Handler)
    print("Serving on http://0.0.0.0:8000")
    ARDUINO.start()
    httpd.serve_forever()


if __name__ == "__main__":
    main()
