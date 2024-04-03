#!/usr/bin/env python

from concurrent.futures import ThreadPoolExecutor
import asyncio
import random
import aiohttp

url = "http://localhost:3000/change?x={}&y={}&col=000000"


def rand_val(min:int, max: int):
    return random.randint(min, max)


async def calling():
    async with aiohttp.ClientSession() as session:
        while True:
            for i in range(160):
                call = url.format(rand_val(160-i,160+i), rand_val(90-i,90+i))
                # call = url.format(rand_val(0,160), rand_val(0,90))
                print("Calling " + call)
                await session.get(call)

def running():
    asyncio.run(calling())


with ThreadPoolExecutor() as executor:
    threads = [thread for thread in range(50)]
    results = [executor.submit(running) for thread in threads]