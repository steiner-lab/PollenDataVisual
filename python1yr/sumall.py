# sum all individual pollen count data from 4 types to make a text file for all types

import pandas as pd

my_cols = ["year", "month", "pollencount", "latitude", "longitude"]

# gather dfs for all pollen types
df_dbf = pd.read_csv("txt/" + "dbf"+ "sum_oneyr.txt",
                                sep="\s+|;|:",
                                names=my_cols, 
                                header=None, 
                                engine="python")
df_enf = pd.read_csv("txt/" + "enf" + "sum_oneyr.txt",
                                sep="\s+|;|:",
                                names=my_cols, 
                                header=None, 
                                engine="python")

df_gra = pd.read_csv("txt/" + "gra" + "sum_oneyr.txt",
                                sep="\s+|;|:",
                                names=my_cols, 
                                header=None, 
                                engine="python")

df_rag = pd.read_csv("txt/" + "rag" + "sum_oneyr.txt",
                                sep="\s+|;|:",
                                names=my_cols, 
                                header=None, 
                                engine="python")

df_sum = df_dbf.copy(deep = True)
# sum all the indivdiual pollen counts
df_sum['pollencount'] = df_dbf['pollencount'] + df_enf['pollencount'] + df_gra['pollencount'] + df_rag['pollencount']

# write to new file in same format as other 1-yr txt files
# clear file first
with open("txt/allsum_oneyr.txt", 'r+') as f:
    f.truncate(0)
# write in text file format
df_sum.to_csv('txt/allsum_oneyr.txt', header=None, index=None, sep='\t', mode='a')