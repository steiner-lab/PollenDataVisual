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
def convert(poll_type):
    my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

    if poll_type == "dbf":
        # diff shades of green
        colors = ['#f2f0e9', '#abd9b0', '#77ba7e', '#4ea357', '#31913b', '#14731d', '#04590c']
        levels = [0, 200, 500, 1000, 2000, 5000, 10000]
    
    elif poll_type == "enf":
        # diff shades of orange
        colors = ['#f2f0e9', '#ffd6b6', '#ffad6d', '#ff8424', '#da6000', '#914000', '#482000']
        levels = [0, 2000, 5000, 10000, 20000, 50000, 100000]

    df = pd.read_csv("txt/" + poll_type + "sum_oneyr.txt",
                                   sep="\s+|;|:",
                                   names=my_cols, 
                                   header=None, 
                                   engine="python")

    start = 0
    end = 33840
    month = 1
    while end <= 406080:
        monToJSON(month, 1997, np.asarray(df.iloc[start:end].longitude.tolist()),
                    np.asarray(df.iloc[start:end].latitude.tolist()),
                    np.asarray(df.iloc[start:end].pollencount.tolist()),
                    colors, levels, poll_type)

        start += 33840
        end += 33840
        month += 1

# convert("dbf")
convert("enf")