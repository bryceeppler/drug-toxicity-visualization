import pandas as pd

# Load CSV file into a pandas DataFrame
df = pd.read_csv('SubstanceHarmsData.csv')

# Get list of headers
headers = list(df.columns)

# Loop through headers and output list of unique values for each one
for header in headers:
    if header == 'Value':
        continue
    values = df[header].unique()
    print(f'Possible values for {header}:')
    for value in values:
        print(value)
    print('\n')
