import csv
import json
#  Right now this only fetches the opioids
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

               #     "Canada": [
    #         {
    #             "group": "female",
    #             "0 to 19 years": "5",
    #             "20 to 29 years": "5",
    #             "30 to 39 years": "4",
    #             "40 to 49 years": "5",
    #             "50 to 59 years": "6",
    #             "60 years or more": "2"
    #         }, 
            # objToAdd = {
            #     "group":sex.lower(),
            #     age:value
            # }
            # output_data[date][province]
            # if sex not in output_data[date][province]:
            #     output_data[date][province][sex] = {}
            # output_data[date][province][sex][age] = value

    # for date in output_data:
    #     for province in output_data[date]:
    #         del output_data[date][province]['date']

    # print(output_data)
    # we have
    # {
    # "2021-01": {
    #     "Canada": {
    #       "Female": {
    #         "0 to 19 years": "35",
    #         "20 to 29 years": "347",
    #         "30 to 39 years": "496",
    #         "40 to 49 years": "329",
    #         "50 to 59 years": "275",
    #         "60 years or more": "91"
    #       },
    #       "Male": {
    #         "0 to 19 years": "63",
    #         "20 to 29 years": "735",
    #         "30 to 39 years": "1276",
    #         "40 to 49 years": "1046",
    #         "50 to 59 years": "930",
    #         "60 years or more": "382"
    #       }
    #     },
    #     "British Columbia": {
    #     ...
    #     }
    #   }
    # }

    # we need
    # {
    # "2021-01": {
    #     "Canada": [
    #         {
    #             "group": "female",
    #             "0 to 19 years": "5",
    #             "20 to 29 years": "5",
    #             "30 to 39 years": "4",
    #             "40 to 49 years": "5",
    #             "50 to 59 years": "6",
    #             "60 years or more": "2"
    #         },
    #         {
    #             "group": "male",
    #             "0 to 19 years": "20",
    #             "20 to 29 years": "30",
    #             "30 to 39 years": "20",
    #             "40 to 49 years": "20",
    #             "50 to 59 years": "18",
    #             "60 years or more": "20"
    #         }
    #     ],
    #     "British Columbia": [
    #         {...},
    #      ]
    #   }


    # Write the output data to a new json file
    with open('barData.json', 'w') as output_file:
        json.dump(output_data, output_file)
