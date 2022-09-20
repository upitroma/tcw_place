#!/usr/bin/env python
import requests
import json
import time
import grequests

l=50

parallelTasks=2000
global urls
urls = []

def blast():
    global urls
    rs = (grequests.get(u) for u in urls)
    print(grequests.map(rs))
    urls=[]

while True:
    req = requests.get("http://10.60.2.96:3000/get")
    res = json.loads(req.text)


    for y in range(0,180):
        for x in range(0,320):

            bgcolor = "0000ff"
            if(res["canvas"][x][y]!="#"+bgcolor):

                orig = res["canvas"][x][y]

                # subtract 1 from r and g
                r = int(orig[1:3],16)
                g = int(orig[3:5],16)
                b = int(orig[5:7],16)

                r = r-50
                g = g-50
                b = b+50

                if r<0:
                    r=0
                if g<0:
                    g=0
                if b>255:
                    b=255

                bgcolor = "%02x%02x%02x" % (r,g,b)

                url="http://10.60.2.96:3000/change?x="+str(x)+"&y="+str(y)+"&col="+bgcolor
                urls.append(url)
                if len(urls)>parallelTasks:
                    blast()     
    if len(urls)>0:
        blast()
    else:
        print("all is good")
        time.sleep(2)
    time.sleep(.1)