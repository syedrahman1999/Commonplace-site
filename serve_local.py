#!/usr/bin/env python3
"""Serve Patternwork on a stable, local-only address and open the default browser."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen
import json
import os
import sys
import threading
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
try:
    PREFERRED_PORT = int(os.environ.get("PATTERNWORK_PORT", "8765"))
except ValueError:
    PREFERRED_PORT = 8765
if not 1024 <= PREFERRED_PORT <= 65515:
    PREFERRED_PORT = 8765
VERSION = "4.3.0"


class PatternworkHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        host = self.headers.get("Host", "").split(":", 1)[0].lower()
        if host not in {"127.0.0.1", "localhost"}:
            self.send_error(421, "Patternwork accepts only local Host headers")
            return
        if self.path == "/__patternwork_health":
            body = json.dumps({"app": "Patternwork", "version": VERSION}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("X-Patternwork-Server", VERSION)
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data:; connect-src 'self'; object-src 'none'; "
            "base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
        )
        super().end_headers()

    def log_message(self, *_args):
        pass


def existing_patternwork(port):
    try:
        request = Request(f"http://127.0.0.1:{port}/__patternwork_health")
        with urlopen(request, timeout=0.7) as response:
            return response.headers.get("X-Patternwork-Server")
    except Exception:
        return None


def bind_server():
    handler = partial(PatternworkHandler, directory=str(ROOT))
    try:
        return ThreadingHTTPServer(("127.0.0.1", PREFERRED_PORT), handler), PREFERRED_PORT
    except OSError:
        if existing_patternwork(PREFERRED_PORT):
            return None, PREFERRED_PORT
        for port in range(PREFERRED_PORT + 1, PREFERRED_PORT + 21):
            try:
                return ThreadingHTTPServer(("127.0.0.1", port), handler), port
            except OSError:
                continue
        raise RuntimeError("No local port is available for Patternwork.")


def main():
    os.chdir(ROOT)
    try:
        server, port = bind_server()
    except RuntimeError as error:
        print(error)
        return 1
    url = f"http://127.0.0.1:{port}/"
    if server is None:
        webbrowser.open(url)
        return 0
    print(f"Patternwork {VERSION} is ready at {url}")
    print("The server accepts connections only from this Mac.")
    if port != PREFERRED_PORT:
        print(f"Port {PREFERRED_PORT} was used by another program. This fallback address has separate browser storage.")
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever(poll_interval=0.3)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
