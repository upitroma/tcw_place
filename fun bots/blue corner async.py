#!/usr/bin/env python
import requests
import json
import time
import grequests

URL="http://localhost:3000"
COLOR="d52bbb"

l=50

parallelTasks=1000
global urls
urls = []

def blast():
    global urls
    rs = (grequests.get(u) for u in urls)
    print(grequests.map(rs))
    urls=[]

while True:
    req = requests.get(URL+"/get")
    res = json.loads(req.text)


    for y in range(0,180):
        for x in range(0,320):

            # gradient based on x and y. 6 char hex

            bgcolor = COLOR
            if(res["canvas"][x][y]!="#"+bgcolor):

                url=URL+"/change?x="+str(x)+"&y="+str(y)+"&col="+bgcolor
                urls.append(url)
                if len(urls)>parallelTasks:
                    blast()     
    if len(urls)>0:
        blast()
    else:
        print("all is good")
        time.sleep(2)
    time.sleep(.1)