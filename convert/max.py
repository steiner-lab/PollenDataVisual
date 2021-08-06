# this script finds the max pollen count value for the 5 different pollen types 
#        over all months in 1997
# used to approximate maximum for the levels

import pandas as pd

# ptypes = ["all", "dbf", "enf", "gra", "rag"]
ptypes = ["dbf"]

my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

for ptype in ptypes:
    df = pd.read_csv("txt" + ptype + "/" + ptype + "max_1997.txt",
                                   sep="\s+|;|:",
                                   names=my_cols, 
                                   header=None, 
                                   engine="python")

    pmax = df["pollencount"].max()

    print("Maximum " + ptype + " count: " + str(pmax))

# Maximums: (not updated except for dbf)
# all: 193237.7
# dbf: 16517.29
# enf: 192699.5
# gra: 10584.42
# rag: 10386.01
