import json
import sys

with open(sys.argv[1]) as f:
  data = json.load(f)['addresses'].items()

for datum in data:
    print(datum[0])
    print(''.join(list(map(lambda x: hex(x)[2:].zfill(2), datum[1]['publicKey']['data']))))
    print("0x"+''.join(list(map(lambda x: hex(x)[2:].zfill(2), datum[1]['secretKey']['data']))), end='\n\n')