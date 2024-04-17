from locust import HttpUser, task, between
import random

class QuickstartUser(HttpUser):
    wait_time = between(1, 1)

    def on_start(self):
        return
        self.client.post("/login", json={"username":"foo", "password":"bar"})

    @task
    def sendRandomPixel(self):
        # get random hex color value. eg: ff0000
        color = '%02x%02x%02x' % (random.randint(0,255), random.randint(0,255), random.randint(0,255))

        # get random position x and y
        x = random.randint(0,319)
        y = random.randint(0,179)

        # print(f"Changing pixel {x} {y} to {color}")

        self.client.get(f"/change?x={x}&y={y}&col={color}", name="/change")
