import csv
import json

# Open the CSV file
with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    # Create an empty dictionary to store the aggregated data
    data_by_quarter = {}

    # Loop through each row in the CSV file
    for row in reader:
        # Check if the row has a Time_Period of "By quarter"
        if row['Time_Period'] == 'By quarter':
            # Get the year quarter from the Year_Quarter column
            year_quarter = row['Year_Quarter']
            
            # Create a new dictionary for the year quarter if it doesn't exist yet
            if year_quarter not in data_by_quarter:
                data_by_quarter[year_quarter] = {}

            # Get the substance, source, specific measure, type of event, region, and unit from the row
            substance = row['Substance']
            source = row['Source']
            specific_measure = row['Specific_Measure']
            type_event = row['Type_Event']
            region = row['Region']
            unit = row['Unit']
            
            # Create a new dictionary for the substance if it doesn't exist yet
            if substance not in data_by_quarter[year_quarter]:
                data_by_quarter[year_quarter][substance] = {}

            # Create a new dictionary for the source if it doesn't exist yet
            if source not in data_by_quarter[year_quarter][substance]:
                data_by_quarter[year_quarter][substance][source] = {}

            # Create a new dictionary for the specific measure if it doesn't exist yet
            if specific_measure not in data_by_quarter[year_quarter][substance][source]:
                data_by_quarter[year_quarter][substance][source][specific_measure] = {}

            # Create a new dictionary for the type of event if it doesn't exist yet
            if type_event not in data_by_quarter[year_quarter][substance][source][specific_measure]:
                data_by_quarter[year_quarter][substance][source][specific_measure][type_event] = {}

            # Create a new dictionary for the region if it doesn't exist yet
            if region not in data_by_quarter[year_quarter][substance][source][specific_measure][type_event]:
                data_by_quarter[year_quarter][substance][source][specific_measure][type_event][region] = {}

            # Add the unit and value to the region dictionary
            data_by_quarter[year_quarter][substance][source][specific_measure][type_event][region][unit] = row['Value']

    # Convert the data to a list of JSON objects
    json_data = []
    for year_quarter in data_by_quarter:
        json_data.append({
            'year_quarter': year_quarter,
            'data': data_by_quarter[year_quarter]
        })

    # Print the JSON data
    # Then save it to a file called data.json
    print(json.dumps(json_data, indent=2))
    with open('data.json', 'w') as json_file:
        json.dump(json_data, json_file, indent=2)
        