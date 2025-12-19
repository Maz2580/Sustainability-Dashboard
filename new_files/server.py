import http.server
import socketserver
import webbrowser
from pathlib import Path
import os
import argparse

# Parse command line arguments
def parse_args():
    parser = argparse.ArgumentParser(description='Run the flight emissions dashboard server')
    parser.add_argument('-p', '--port', type=int, default=8585, 
                        help='Port to run the server on (default: 8585)')
    return parser.parse_args()

# Configuration
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def log_message(self, format, *args):
        # Custom logging
        print(f"[SERVER] {self.address_string()} - {format % args}")

def main():
    args = parse_args()
    PORT = args.port
    
    print(f"Starting server on port {PORT}...")
    print(f"Server directory: {DIRECTORY}")
    
    # Check if dashboard.html exists
    dashboard_path = os.path.join(DIRECTORY, 'dashboard.html')
    if not os.path.exists(dashboard_path):
        print(f"Warning: {dashboard_path} does not exist!")
    else:
        print(f"Dashboard found at {dashboard_path}")
    
    # Check if visualization directory exists
    vis_dir = os.path.join(DIRECTORY, 'visualizations')
    if not os.path.exists(vis_dir):
        print(f"Warning: Visualizations directory {vis_dir} does not exist!")
    else:
        print(f"Found visualizations directory with {len(os.listdir(vis_dir))} files")
    
    # Check if dashboard data exists
    data_dir = os.path.join(DIRECTORY, 'dashboard_data')
    if not os.path.exists(data_dir):
        print(f"Warning: Dashboard data directory {data_dir} does not exist!")
    else:
        print(f"Found dashboard data directory with {len(os.listdir(data_dir))} files")
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}/dashboard.html"
            print(f"\nServer started at {url}")
            print("Opening dashboard in web browser...")
            webbrowser.open(url)
            print("Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user.")
    except OSError as e:
        if e.errno == 10048:  # Address already in use
            print(f"\nERROR: Port {PORT} is already in use.")
            print("Please try a different port with: python server.py --port XXXX")
        else:
            print(f"\nServer error: {e}")
    except Exception as e:
        print(f"\nServer error: {e}")

if __name__ == "__main__":
    main() 