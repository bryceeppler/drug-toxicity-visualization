import csv
import json
#  Right now this only fetches the opioids
# Open the CSV file
with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    output_data = {}

    # Loop through each row in the CSV file
    for row in reader:
        if row['Source'] != 'Deaths':
            continue
        if row['Specific_Measure'] != 'Age group by sex':
            continue
        if row['Substance'] != 'Opioids':
            continue
        # make sure row[J] is Male or Female

        # Check if the row is for "by quarter" data
        # if row['Time_Period'] == 'By year':
        if True:
            # Extract the year and quarter from the Time_Period column
            year = row['Year_Quarter']
            # year = yearQuarter[:4].strip()[2:] # 2018 -> 18
            # quarter = yearQuarter[4:].strip() # Q1, Q2, Q3, Q4
            # month = map Q1 = 1, Q2 = 4, Q3 = 7, Q4 = 10
            month = 1
            value = row['Value']

            province = row['Region']
            sex = row['Disaggregator']
            age = row['Aggregator']
            date = f'{year}-{month:02}'
            # Append a new row to the output data list
            # output_data[date][provice][sex][age] = value
            # "2016-01": {
            #  "Alberta": {
            #   "male": {
            #     "0-19":20,
            #     "20-49":30,
            #     "50+":10
            #   },
            #   "female": {
            #     "0-19":20,
            #     "20-49":30,
            #     "50+":10
            #   }
            #  },
            #  "British Columbia": {
            #       ...
            # },
            # Append a new row to the output data list
            if date not in output_data:
                output_data[date] = {}
            if province not in output_data[date]:
                output_data[date][province] = {'date': date}
            if sex not in output_data[date][province]:
                output_data[date][province][sex] = {}
            output_data[date][province][sex][age] = value

    # for every object in output_data:
    #     remove the date key from each province
    for date in output_data:
        for province in output_data[date]:
            del output_data[date][province]['date']
            




    # Write the output data to a new json file
    with open('barData.json', 'w') as output_file:
        json.dump(output_data, output_file)