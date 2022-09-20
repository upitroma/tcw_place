#!/usr/bin/env python
import requests
import json
import time
import grequests

l=50

parallelTasks=5000
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


    for y in range(180-l,180):
        for x in range(320-l,320):

            # gradient based on x and y. 6 char hex

            bgcolor = "0000ff"
            if(res["canvas"][x][y]!="#"+bgcolor):

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