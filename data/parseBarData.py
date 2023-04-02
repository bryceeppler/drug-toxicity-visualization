# TODO: Make this output values for sum(opioid deaths + stimulant deaths). Right now it only calculates the sum of opioid deaths.

import csv
import json

with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    output_data = {}

    # Loop through each row in the CSV file
    for row in reader:
        if row['Source'] != 'Deaths':
            continue
        if row['Specific_Measure'] != 'Age group by sex':
            continue
        if row['Substance'] != 'Opioids':# and row['Substance'] != 'Stimulants':
            continue

        if True:
            # Extract the year and quarter from the Time_Period column
            year = row['Year_Quarter']
            month = 1
            value = row['Value']

            province = row['Region']
            sex = row['Disaggregator']
            age = row['Aggregator']
            date = f'{year}-{month:02}'
            if date not in output_data:
                output_data[date] = {}
            if province not in output_data[date]:
                output_data[date][province] = [{'group': sex.lower()}]

            found = False
            # if an object exists with this group, add the age to it
            for x in output_data[date][province]:
                try:
                    if x["group"] == sex.lower():
                        x[age] = value
                        found = True
                        break
                except:
                    pass
            if not found:
                objectToAdd = {
                    "group":sex.lower(),
                    age:value
                }
                output_data[date][province].append(objectToAdd)


    # Write the output data to a new json file
    with open('barData2.json', 'w') as output_file:
        json.dump(output_data, output_file)
