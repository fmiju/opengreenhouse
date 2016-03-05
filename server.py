#!/usr/bin/env python3
import os
import http.server

WEBROOT = os.path.join(os.path.dirname(os.path.realpath(__file__)), "webroot")

def main():
    os.chdir(WEBROOT)
    httpd = http.server.HTTPServer(("", 8000), http.server.SimpleHTTPRequestHandler)
    print("Serving on http://0.0.0.0:8000")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
