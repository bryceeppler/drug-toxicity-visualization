# TODO: Make this output values for sum(opioid deaths + stimulant deaths). Right now it only calculates the sum of opioid deaths.

import csv
import json

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
        if row['Region'] == 'Canada':
            continue
        if row['Substance'] != 'Opioids':
            continue

        # Check if the row is for "by quarter" data
        if row['Time_Period'] == 'By quarter':
            # Extract the year and quarter from the Time_Period column
            yearQuarter = row['Year_Quarter']
            year = yearQuarter[:4].strip()[2:] # 2018 -> 18
            quarter = yearQuarter[4:].strip() # Q1, Q2, Q3, Q4
            month = {'Q1': 1, 'Q2': 4, 'Q3': 7, 'Q4': 10}[quarter]
            value = row['Value']

            province = row['Region']
            # create date from year and month for first day of month as 2014-01-01
            date = f'20{year}-{month:02}'
            if date not in output_data:
                output_data[date] = {}
            output_data[date][province] = int(value)



    # Write the output data to a new json file
    with open('OutputData.json', 'w') as output_file:
        json.dump(output_data, output_file)