import os
import requests
import json
import time
import grequests
from PIL import Image

dimX=320
dimY=180

posX=50
posY=50

URL="http://localhost:3000"

screenshotPath="Screenshot from 2023-04-15 13-28-55.png"

image = Image.open("/home/upitroma/Pictures/Screenshots/"+screenshotPath)
image = image.convert('RGBA')  # Convert to RGBA format for transparency support
image = image.resize((dimX, dimY))

pixels = list(image.getdata())



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

	for y in range(dimX):
		for x in range(dimX):
			if x>319 or y>179:
				continue
			# Get the color of the current pixel
			color = pixels[y * dimX + x]
			# Convert the RGBA values to hex format
			hex_color = '%02x%02x%02x%02x' % color
			# Build the API URL with the current pixel coordinates and color
			if(res["canvas"][x][y]!="#"+hex_color):
				url = URL+ f"/change?x={x}&y={y}&col={hex_color}"
				# Query the API to update the canvas
				urls.append(url)
				if len(urls)>parallelTasks:
					blast()
	print("finished cycle")
	time.sleep(1)	
