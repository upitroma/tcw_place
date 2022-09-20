import requests
import json
import time
import grequests


inputText="i remember how to do text"
posx=145
posy=100



asciiArt=[
"                                                                                                             ",                                                                                                       
" #  ##   ## ##  ### ###  ## # # ###  ## # # #   # # ###  #  ##   #  ##   ## ### # # # # # # # # # # ###      ",
"# # # # #   # # #   #   #   # #  #    # # # #   ### # # # # # # # # # # #    #  # # # # # # # # # #   #      ",
"### ##  #   # # ##  ##  # # ###  #    # ##  #   ### # # # # ##  # # ##   #   #  # # # # ###  #   #   #       ",
"# # # # #   # # #   #   # # # #  #  # # # # #   # # # # # # #    ## # #   #  #  # # # # ### # #  #  #        ",
"# # ##   ## ##  ### #    ## # # ###  #  # # ### # # # #  #  #     # # # ##   #  ###  #  # # # #  #  ###      ",
"                                                                                                             "                                                                                                    
]

letterArray=list("abcdefghijklmnopqrstuvwxyz ")

map=[]   
for line in asciiArt:
    row=""
    for c in inputText:
        index=letterArray.index(c)
        letterRows=[line[i:i+4] for i in range(0, len(line), 4)]
        row+=letterRows[index]
    map.append(list(row))

col = {
    ' ':"ffffff",
    '#':"000066"
}



parallelTasks=100
global urls
urls = []

def blast():
	global urls
	rs = (grequests.get(u) for u in urls)
	print(grequests.map(rs))
	urls=[]


req = requests.get("http://10.60.2.96:3000/get")
res = json.loads(req.text)

for x in range(posx-len(map[0]),posx):
    for y in range(posy-len(map),posy):

        #treat 0 as transparent
        if(map[y-posy+len(map)][x-posx+len(map[0])]!=0):

            if(res["canvas"][x][y]!="#"+col[map[y-posy+len(map)][x-posx+len(map[0])]]):
                url="http://10.60.2.96:3000/change?x="+str(x)+"&y="+str(y)+"&col="+col[map[y-posy+len(map)][x-posx+len(map[0])]]
                urls.append(url)
                if len(urls)>parallelTasks:
                    blast() 
if len(urls)>0:
    blast()