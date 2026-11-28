import http.server, os, webbrowser
from pathlib import Path
os.chdir(Path(__file__).resolve().parent)
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),http.server.SimpleHTTPRequestHandler)
webbrowser.open(f'http://127.0.0.1:{server.server_port}/index.html')
print('Preview running. Keep this window open. Ctrl+C to stop.')
server.serve_forever()
