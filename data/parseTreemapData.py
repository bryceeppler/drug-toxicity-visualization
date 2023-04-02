import csv
import json

def update_output_data(output_data, date, province, value):
    if date not in output_data:
        output_data[date] = {"name": "Canada", "children": []}

    # Check if province is already in the children array
    province_found = False
    for child in output_data[date]["children"]:
        if child["name"] == province:
            child["value"] += value
            province_found = True
            break

    if not province_found:
        output_data[date]["children"].append({"name": province, "value": value})

# Open the CSV file
with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    output_data = {}

    # Loop through each row in the CSV file
    for row in reader:
        if row['Source'] != 'Deaths':
            continue
        if row['Specific_Measure'] != 'Overall numbers':
            continue
        if row['Substance'] != 'Opioids':
            continue

        # Check if the row is for "by quarter" data
        if row['Time_Period'] == 'By quarter':
            yearQuarter = row['Year_Quarter']
            year = yearQuarter[:4].strip()[2:] # 2018 -> 18
            quarter = yearQuarter[4:].strip() # Q1, Q2, Q3, Q4
            month = {'Q1': 1, 'Q2': 4, 'Q3': 7, 'Q4': 10}[quarter]
            value = int(row['Value'])

            province = row['Region']
            # create date from year and month for first day of month as 2014-01-01
            date = f'20{year}-{month:02}'

            update_output_data(output_data, date, province, value)

    # Write the output data to a new json file
    with open('treemapData.json', 'w') as output_file:
        json.dump(output_data, output_file)
