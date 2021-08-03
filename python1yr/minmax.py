import pandas as pd

ptypes = ["all", "dbf", "enf", "gra", "rag"]

my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

for ptype in ptypes:
    df = pd.read_csv("txt/" + ptype + "sum_oneyr.txt",
                                   sep="\s+|;|:",
                                   names=my_cols, 
                                   header=None, 
                                   engine="python")

    pmax = df["pollencount"].max()

    print("Maximum " + ptype + " count: " + str(pmax))

# Maximums:
# all: 193237.7
# dbf: 53873.12
# enf: 192699.5
# gra: 10584.42
# rag: 10386.01
