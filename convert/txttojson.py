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
    json_file = "json/" + poll_type + "/" + filename + ".json"

    # Writing and storing the geojson data in a new file
    file = open(json_file, "w")
    file.write(geojson)
    file.close()

# Takes in a pollen type, creates a dataframe, and converts each month one by one to json
# Currently only takes one year but modify to do 20 years
def convertyr(poll_type, year):
    my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

    if poll_type == "all":
        # rainbow with light purples
        # white, vvlightpurple, vlightpurple, lightpurple, purple, blue, green, yellow, orange, red
        colors = ['#f2f0e9', '#faedff', '#f1cfff', '#e8b6fc', '#BF55EC', '#2b83ba', '#abdda4', '#fcf065', '#fdae61', '#d7191c']
        levels = [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]

    elif poll_type == "dbf":
        # diff shades of green
        colors = ['#f2f0e9', '#dceede', '#b9debd', '#96ce9d', '#74bd7c', '#51ad5c', '#418a49', '#306837', '#204524', '#102212']
        levels = [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]
    
    elif poll_type == "enf":
        # diff shades of orange
        colors = ['#f2f0e9', '#fbe2cf', '#f8c69f', '#f5aa6f', '#f28e3f', '#ef710f', '#bf5b0c', '#8f4409', '#5f2d06', '#2f1603']
        levels = [0, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]

    elif poll_type == "gra":
        # diff shades of brown
        colors = ['#f2f0e9', '#f3e0d7', '#e7c1b0', '#dba289', '#cf8362', '#c3643b', '#9c502f', '#753c23', '#4e2817', '#27140b']
        levels = [0, 2, 5, 10, 20, 50, 100, 200, 500, 1000]

    elif poll_type == "rag":
        # diff shades of red
        colors = ['#f2f0e9', '#f7d3d3', '#f0a7a7', '#e97b7b', '#e24f4f', '#db2323', '#af1c1c', '#831515', '#570e0e', '#2b0707']
        levels = [0, 2, 5, 10, 20, 50, 100, 200, 500, 1000]

    df = pd.read_csv("txt/" + poll_type + "/" + poll_type + "max_" + str(year) + ".txt",
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
en_yr = 2016

# convert("all", st_yr, en_yr)
convert("dbf", st_yr, en_yr)
convert("enf", st_yr, en_yr)
convert("gra", st_yr, en_yr)
convert("rag", st_yr, en_yr)