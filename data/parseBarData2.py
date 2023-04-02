import csv
import json

with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    temp_data = {}
    output_data = {}

    # Loop through each row in the CSV file
    for row in reader:
        if row['Source'] != 'Deaths':
            continue
        if row['Specific_Measure'] != 'Age group by sex':
            continue
        if row['Substance'] not in ['Opioids', 'Stimulants']:
            continue

        year = row['Year_Quarter']
        month = 1
        value = int(row['Value'])

        province = row['Region']
        sex = row['Disaggregator']
        age = row['Aggregator']
        substance = row['Substance']
        date = f'{year}-{month:02}'

        if date not in temp_data:
            temp_data[date] = {}
        if province not in temp_data[date]:
            temp_data[date][province] = {'Opioids': {}, 'Stimulants': {}}
        
        if sex.lower() not in temp_data[date][province][substance]:
            temp_data[date][province][substance][sex.lower()] = {}

        if age in temp_data[date][province][substance][sex.lower()]:
            temp_data[date][province][substance][sex.lower()][age] += value
        else:
            temp_data[date][province][substance][sex.lower()][age] = value

    for date, provinces in temp_data.items():
        output_data[date] = {}
        for province, substances in provinces.items():
            output_data[date][province] = []
            for sex in substances['Opioids'].keys():
                combined_deaths = {}
                for age, deaths in substances['Opioids'][sex].items():
                    combined_deaths[age] = deaths + substances['Stimulants'][sex].get(age, 0)
                combined_deaths['group'] = sex
                output_data[date][province].append(combined_deaths)

# Write the output data to a new json file
with open('barData2.json', 'w') as output_file:
    json.dump(output_data, output_file)
