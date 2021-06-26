import json
import sys

with open(sys.argv[1]) as f:
  data = json.load(f)['addresses'].items()

for datum in data:
    print(f'address: {datum[0]}')
    print('public key:',''.join(list(map(lambda x: hex(x)[2:].zfill(2), datum[1]['publicKey']['data']))))
    print("private key:", "0x"+''.join(list(map(lambda x: hex(x)[2:].zfill(2), datum[1]['secretKey']['data']))), end='\n\n')