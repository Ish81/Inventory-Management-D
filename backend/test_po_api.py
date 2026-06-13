import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:5000/api/v1/purchase-orders/1/status',
    data=b'{"status": "pending"}',
    headers={'Content-Type': 'application/json'},
    method='PATCH'
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except Exception as e:
    print("ERROR:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
