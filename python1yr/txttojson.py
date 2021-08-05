import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import griddata
import geojsoncontour
import scipy as sp
import scipy.ndimage

# This function converts df arrays to a geojson contour file
def monToJSON(month, year, x_orig, y_orig, z_orig, colors, levels, poll_type):
    # Make a grid
    x_arr          = np.linspace(np.min(x_orig), np.max(x_orig), 500)
    y_arr          = np.linspace(np.min(y_orig), np.max(y_orig), 500)
    x_mesh, y_mesh = np.meshgrid(x_arr, y_arr)

    # Grid the values
    z_mesh = griddata((x_orig, y_orig), z_orig, (x_mesh, y_mesh), method='linear')
    
    # Gaussian filter the grid to make it smoother
    sigma = [5, 5]
    z_mesh = sp.ndimage.filters.gaussian_filter(z_mesh, sigma, mode='constant')

    # Create the contour
    contourf = plt.contourf(x_mesh, y_mesh, z_mesh, levels, alpha=0.5, colors=colors, linestyles='None', extend = 'max')

    # Convert matplotlib contourf to geojson
    geojson = geojsoncontour.contourf_to_geojson(
        contourf=contourf,
        min_angle_deg=3.0,
        ndigits=5,
        stroke_width=1,
        fill_opacity=0.5)

    # Generating the correct filename to store this data as
    month = int(month)
    filename = str(month) + "-" + str(year)
    json_file = poll_type + "/" + filename + ".json"

    # Writing and storing the geojson data in a new file
    file = open(json_file, "w")
    file.write(geojson)
    file.close()

# Takes in a pollen type, creates a dataframe, and converts each month one by one to json
# Currently only takes one year but modify to do 20 years
def convertyr(poll_type, year):
    my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

    if poll_type == "all":
        # rainbow
        # white, lightgray, gray, darkgray, purple, blue, green, yellow, orange, red
        # previous yellow: #ffffbf
        # colors = ['#f2f0e9', '#d1cecd', '#b3b0af', '#919090', '#BF55EC', '#2b83ba', '#abdda4', '#fcf065', '#fdae61', '#d7191c']
        # white, vvlightpurple, vlightpurple, lightpurple, purple, blue, green, yellow, orange, red
        colors = ['#f2f0e9', '#e7d8ed', '#e1c0f0', '#dfb1f2', '#BF55EC', '#2b83ba', '#abdda4', '#fcf065', '#fdae61', '#d7191c']
        levels = [0, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]

    elif poll_type == "dbf":
        # diff shades of green
        # previous: ['#f2f0e9', '#abd9b0', '#77ba7e', '#4ea357', '#31913b', '#14731d', '#04590c']
        # previous scale: [0, 200, 500, 1000, 2000, 5000, 10000]
        colors = ['#f2f0e9', '#cde7d0', '#9ccfa2', '#6bb874', '#469350', '#2f6235', '#17311a']
        levels = [0, 500, 1000, 2000, 5000, 10000, 20000]
    
    elif poll_type == "enf":
        # diff shades of orange
        colors = ['#f2f0e9', '#ffd6b6', '#ffad6d', '#ff8424', '#da6000', '#914000', '#482000']
        levels = [0, 1000, 2000, 5000, 10000, 20000, 50000]

    elif poll_type == "gra":
        # diff shades of brown
        colors = ['#f2f0e9', '#edd2c7', '#dca68f', '#cb7a57', '#a75633', '#6f3922', '#371c11']
        levels = [0, 100, 200, 500, 1000, 2000, 5000]

    elif poll_type == "rag":
        # diff shades of red
        colors = ['#f2f0e9', '#f4c0c0', '#ea8282', '#df4343', '#bb1f1f', '#7c1414', '#3e0a0a']
        levels = [0, 100, 200, 500, 1000, 2000, 5000]

    df = pd.read_csv("txt/" + poll_type + "sum_oneyr.txt",
                                   sep="\s+|;|:",
                                   names=my_cols, 
                                   header=None, 
                                   engine="python")

    start = 0
    end = 33840
    month = 1
    while end <= 406080:
        monToJSON(month, year, np.asarray(df.iloc[start:end].longitude.tolist()),
                    np.asarray(df.iloc[start:end].latitude.tolist()),
                    np.asarray(df.iloc[start:end].pollencount.tolist()),
                    colors, levels, poll_type)

        start += 33840
        end += 33840
        month += 1

# takes in pollen type and years and converts from start to end year
def convert(poll_type, st_yr, en_yr):
    for year in range(st_yr, en_yr + 1):
        convertyr(poll_type, year)


st_yr = 1997
en_yr = 1997

convert("all", st_yr, en_yr)
# convert("dbf")
# convert("enf")
# convert("gra")
# convert("rag")