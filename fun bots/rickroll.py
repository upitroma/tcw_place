import os
import requests
import json
import time
import grequests


parallelTasks=1000
global urls
urls = []

def blast():
	global urls
	rs = (grequests.get(u) for u in urls)
	print(grequests.map(rs))
	urls=[]

posx=50
posy=50


qr=[                                  
" ▄▄▄▄▄▄▄ ▄▄    ▄ ▄▄▄▄▄ ▄▄▄▄▄▄▄ ",  
" █ ▄▄▄ █ ▄  ▄▄█▄  ▀█ ▄ █ ▄▄▄ █ ",  
" █ ███ █ ██▄█ █ █▀▀▀█  █ ███ █ ",  
" █▄▄▄▄▄█ ▄▀▄ █▀▄ ▄▀█▀█ █▄▄▄▄▄█ ",  
" ▄▄▄▄  ▄ ▄▀ ▀ ▄▄▀▀███▀▄  ▄▄▄ ▄ ",  
" ▄▄█▄█▀▄▀▄▀   ▄▀ █ ▄▀█ ███ ▄▄▀ ",  
"  █▄█▀▄▄▀ ▄ █▀██▄█▄▀▄▀▀▀▀▀▄▄ ▀ ",  
" █▀▄▀██▄ ▀▄█▀▄ █ █▀ ██▄▀█▄ ███ ",  
" █▀▄██ ▄ ▀ ▄▄▀ ▀▀▀ ▄ █▄▀▀█▄ █  ",  
" ▄▀▀▄▀ ▄▀██▄▄█ ▀█▄ ▀ ▀▀ █ ▀█▀  ",  
"  ▄▀█▀▀▄▄▄▄▄▄█ █▄▀█▄███▄▄▄▄█   ",  
" ▄▄▄▄▄▄▄ ▀██▄█▄▄   ▀▄█ ▄ ██▀█▀ ",  
" █ ▄▄▄ █  ▀▄ ▄▀██▄▄▀ █▄▄▄█▀▄█▄ ",  
" █ ███ █ █ ▄█▀▄ ▀▀  ▀▀█ ▄▀▀▄ █ ",  
" █▄▄▄▄▄█ █  ▀  █▄█ ▀██  ▀ █ █  ",
"                                "  
]

map=[]
for row in qr:
	l1=[]
	l2=[]
	for px in row:
		if px==" ":
			l1.append(0)
			l2.append(0)
		elif px=="▀":
			l1.append(1)
			l2.append(0)
		elif px=="▄":
			l1.append(0)
			l2.append(1)
		elif px=="█":
			l1.append(1)
			l2.append(1)
		else:
			print(px)
	map.append(l1)
	map.append(l2)

col = {
    0:"ffffff",
    1:"000000",
}

print(map)
print(len(map))
print(len(map[0]))



while True:
	req = requests.get("http://10.60.2.96:3000/get")
	res = json.loads(req.text)

	for x in range(posx-len(map[0]),posx):
		for y in range(posy-len(map),posy):

            # #treat 0 as transparent
			# if(map[y-posy+len(map)][x-posx+len(map[0])]!=0):

			if(res["canvas"][x][y]!="#"+col[map[y-posy+len(map)][x-posx+len(map[0])]]):
				url="http://10.60.2.96:3000/change?x="+str(x)+"&y="+str(y)+"&col="+col[map[y-posy+len(map)][x-posx+len(map[0])]]
				urls.append(url)
				if len(urls)>parallelTasks:
					blast() 
	if len(urls)>0:
		blast()
	else:
		print("all is good")
		time.sleep(2)
	time.sleep(.1)