import csv
import json

with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    children = "children"

    #output_data = {"date":{"name":"Canada", "children":[]}}
    output_data = {}

    # Loop through each row in the CSV file
    for row in reader:
        if row['Source'] != 'Deaths':
            continue
        if row['Specific_Measure'] != 'Overall numbers':
            continue
        
        

        if True:
            # Extract the year and quarter from the Time_Period column
            year = row['Year_Quarter']
            month = 1
            value = row['Value']

            province = row['Region']
            date = f'{year}-{month:02}'
            if date not in output_data:
                output_data[date] = {}
            #if province in output_data[date]:
                output_data[date][children] = []

            objectToAdd = {
                        "name":province,
                        "value":value
                    }
                    
            output_data[date][children].append(objectToAdd)

            
    # Write the output data to a new json file
    with open('treemapData.json', 'w') as output_file:
        json.dump(output_data, output_file, indent=4)
