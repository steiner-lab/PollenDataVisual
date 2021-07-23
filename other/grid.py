import numpy as np
import random

print('var statesData = {"type":"FeatureCollection","features":[')

curr = 0
inc_x = .2
inc_y = .2
for x in np.arange(-124, -70, .2):
    for y in np.arange(26, 49, .2):
        curr = random.randrange(0, 1200)
        print('{"type":"Feature","id":',curr,',"properties":{"name":', curr, ',"density":', curr, '},"geometry":{"type":"Polygon","coordinates":', '[[[', x, ',', y, '],[', x+inc_x, ',', y, '],[', x+inc_x, ',', y+inc_y, '],[', x, ',', y+inc_y, ']]]}},')

print(']};')