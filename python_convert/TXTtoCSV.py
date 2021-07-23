import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import griddata
import geojsoncontour
import scipy as sp
import scipy.ndimage

def convert(filename):
    txt_file = "poll_flux_txt/" + filename + ".txt"
    df = pd.read_csv(txt_file, sep = "\t")

    # Setup colormap
    # have: colors = [white, purple, blue, green, yellow, orange, red]
    colors = ['#f2f0e9', '#BF55EC', '#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c']
    # may not be necessary for now
    vmin = 0
    vmax = 210000000
    levels = [0, 6000000, 12000000, 18000000, 24000000, 30000000, 36000000]

    # convert the original data to list format
    x_orig = np.asarray(df.longitude.tolist())
    y_orig = np.asarray(df.latitude.tolist())
    z_orig = np.asarray(df.pollenflux.tolist())

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

    # Add colorbar/scale
    # Not really necessary since we're not graphing it out
    # cbar = plt.colorbar(contourf, orientation='horizontal')
    # cbar.ax.tick_params(direction='in',length=10,width=2,labelsize=15,pad=5)

    # Convert matplotlib contourf to geojson
    geojson = geojsoncontour.contourf_to_geojson(
        contourf=contourf,
        min_angle_deg=3.0,
        ndigits=5,
        stroke_width=1,
        fill_opacity=0.5)

    json_file = "contour_json/" + filename + ".json"

    file = open(json_file, "w")
    file.write(geojson)
    file.close()

# make the different file names
for x in range(3, 24, 10):
    filename = "4-" + str(x) + "-2013"
    convert(filename)