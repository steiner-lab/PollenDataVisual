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
df_sum['pollencount'] = df_dbf['pollencount'] + df_enf["pollencount"] + df_gra["pollencount"] + df_rag['pollencount']

# write to new file in same format as other 1-yr txt files
df_sum.to_csv('txt/allsum_oneyr.txt', header=None, index=None, sep='\t', mode='a')