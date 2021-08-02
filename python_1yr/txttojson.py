import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import griddata
import geojsoncontour
import scipy as sp
import scipy.ndimage

# This function converts df arrays to a geojson contour file
def monToJSON(month, year, x_orig, y_orig, z_orig, colors, levels):
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
    json_file = "dbf/" + filename + ".json"

    # Writing and storing the geojson data in a new file
    file = open(json_file, "w")
    file.write(geojson)
    file.close()

# Takes in a pollen type, creates a dataframe, and converts each month one by one to json
# Currently only takes one year but modify to do 20 years
def convert(poll_type):
    my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

    if poll_type == "dbf":
        colors = ['#f2f0e9', '#BF55EC', '#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c']
        levels = [0, 10, 20, 30, 40, 50, 60]

    df = pd.read_csv(poll_type + "sum_oneyr.txt",
                                   sep="\s+|;|:",
                                   names=my_cols, 
                                   header=None, 
                                   engine="python")

    start = 0
    end = 33840
    month = 1
    while end <= 406080:
        monToJSON(month, 1997, np.asarray(df.iloc[0:33840].longitude.tolist()),
                    np.asarray(df.iloc[0:33840].latitude.tolist()),
                    np.asarray(df.iloc[0:33840].pollencount.tolist()),
                    colors, levels)

        start += 33840
        end += 33840
        month += 1

convert("dbf")