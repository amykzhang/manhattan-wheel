import csv
import pandas as pd
import time

start_time = time.time()

# # Convert gz files to csv

# def convert_to_csv(input_file, output_file):
#     # Open the input text file in read mode
#     with open(input_file, 'r') as f:
#         # Read lines from the input file
#         lines = f.readlines()

#     # Replace spaces with commas and split lines into rows
#     rows = [line.strip().replace(' ', ',') for line in lines]

#     # Write the rows to a CSV file
#     with open(output_file, 'w', newline='') as csvfile:
#         csv_writer = csv.writer(csvfile)
#         for row in rows:
#             csv_writer.writerow(row.split(','))

# input_file = 'data/childbmi_3m.txt'
# # output_file = 'data/dummy.csv'
# output_file = 'data/childbmi_3m.csv'

# convert_to_csv(input_file, output_file)

# Read in csv data for the following columns
col_to_read = ["RSID", "CHR", "BP", "BETA", "SE", "P"]

df_birth = pd.read_csv('data/childbmi_birth.csv', header=0, usecols=col_to_read)
df_6w = pd.read_csv('data/childbmi_6w.csv', header=0, usecols=col_to_read)
df_3m = pd.read_csv('data/childbmi_3m.csv', header=0, usecols=col_to_read)
df_6m = pd.read_csv('data/childbmi_6m.csv', header=0, usecols=col_to_read)
df_8m = pd.read_csv('data/childbmi_8m.csv', header=0, usecols=col_to_read)
df_1y = pd.read_csv('data/childbmi_1y.csv', header=0, usecols=col_to_read)
df_1_5y = pd.read_csv('data/childbmi_1-5y.csv', header=0, usecols=col_to_read)
df_2y = pd.read_csv('data/childbmi_2y.csv', header=0, usecols=col_to_read)
df_3y = pd.read_csv('data/childbmi_3y.csv', header=0, usecols=col_to_read)
df_5y = pd.read_csv('data/childbmi_5y.csv', header=0, usecols=col_to_read)
df_7y = pd.read_csv('data/childbmi_7y.csv', header=0, usecols=col_to_read)
df_8y = pd.read_csv('data/childbmi_8y.csv', header=0, usecols=col_to_read)


df_list = [df_birth, df_6w, df_3m, df_6m, df_8m, df_1y, df_1_5y, df_2y, df_3y, df_5y, df_7y, df_8y]
df_age = [0, 0.125, 0.25, 0.5, 0.66, 1, 1.5, 2, 3, 5, 7, 8]

# Make list of significant snps -- safe_rsid is SNPs identified in Helgeland et al
sig_snps = set()
safe_rsid = [
    "rs10493377",
    "rs10889551",
    "rs2767486",
    "rs10493544",
    "rs545608",
    "rs2816985",
    "rs77165542",
    "rs11676272",
    "rs11708067",
    "rs1482853",
    "rs2610989",
    "rs1032296",
    "rs6899303",
    "rs263377",
    "rs2268657",
    "rs2268647",
    "rs1820721",
    "rs209421",
    "rs7772579",
    "rs1772945",
    "rs78412508",
    "rs17145750",
    "rs10487505",
    "rs287621",
    "rs12672489",
    "rs117212676",
    "rs28457693",
    "rs28642213",
    "rs11187129",
    "rs1830890",
    "rs1985927",
    "rs2298615",
    "rs2728641",
    "rs7132908",
    "rs6538845",
    "rs7310615",
    "rs3741508",
    "rs75806555",
    "rs2585058",
    "rs17817288",
    "rs111810144",
    "rs739669",
    "rs78263856",
    "rs148252705",
    "rs13038017",
    "rs5926278"
]

for df in df_list:
    sig_snps_df = df.loc[df["P"] <= 0.0001, "RSID"] #find snps lower than spurious at 1e-4
    safe_snps_df = df.loc[df["RSID"].isin(safe_rsid), "RSID"] #find snps within list of snps identified by Helgeland et al
    sig_snps.update(sig_snps_df)
    sig_snps.update(safe_snps_df)

# print(len(sig_snps))

#Filter dfs to only include SNPs in sig snps + sample 1 in 1000 SNPs in the 1 to 1e-4 region excluding safe RSIDs
for i, df in enumerate(df_list):
    #Create dfs with SNPs that are safe
    safe_df = df[(df["RSID"].isin(sig_snps))].copy(deep=True)

    # print(len(safe_df))
    
    filtered_by_p = df[df["P"] > 0.0001].copy(deep=True)

    # print(len(filtered_by_p))

    sample_size = max(1, len(filtered_by_p) // 500)
    sampled_df = filtered_by_p.sample(n=sample_size, random_state=42)

    df_list[i] = pd.concat([safe_df, sampled_df]).drop_duplicates().reset_index(drop=True)



CHROMOSOMES = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

def cumulative_bp(df) -> None:
    offset = 0
    df["cBP"] = 0
    for chr in CHROMOSOMES:
        df.loc[df["CHR"] == chr, "cBP"] = df.loc[df["CHR"] == chr, "BP"] + offset
        offset = df.loc[df["CHR"] == chr, "cBP"].max() if not df.empty else offset
    return

# Add columns to df
for i, df in enumerate(df_list):
    # Add age to dfs
    df["AGE"] = df_age[i]

    # Make P values numeric
    df["P"] = df["P"].apply(pd.to_numeric, errors='coerce')

    # Add cBP
    cumulative_bp(df)

    # Drop NA and missing values
    # df_list[i] = df.replace('', pd.NA).dropna()

    df_list[i].to_csv(f'data/bmi_{i+1}.csv', index=False)


print("Program took", time.time()-start_time, "to run")