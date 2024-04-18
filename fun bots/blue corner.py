import os
import requests
import json
import time
l=50

while True:
    req = requests.get("http://localhost:3000/get")
    res = json.loads(req.text)
    for x in range(320-l,320):
        for y in range(180-l,180):
            if(res["canvas"][x][y]!="#0000ff"):
                print(res["canvas"][x][y])
                cmd="curl 'http://localhost:3000/change?x="+str(x)+"&y="+str(y)+"&col=0000ff'"
                os.system(cmd)
    time.sleep(1)