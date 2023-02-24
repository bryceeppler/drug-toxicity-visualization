# TODO: Make this output values for sum(opioid deaths + stimulant deaths). Right now it only calculates the sum of opioid deaths.

import csv

# Open the CSV file
with open('SubstanceHarmsData.csv', 'r') as csv_file:
    reader = csv.DictReader(csv_file)

    # Create a list to hold the output data
    output_data = []

    # Loop through each row in the CSV file
    for row in reader:
        if row['Source'] != 'Deaths':
            continue
        if row['Specific_Measure'] != 'Overall numbers':
            continue
        if row['Region'] != 'Canada':
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

            # Append a new row to the output data list
            output_data.append({
                'id': len(output_data) + 1,
                'date': f'{month}/01/{year}',
                'val': value
            })

    # Write the output data to a new CSV file
    with open('OutputData.csv', 'w', newline='') as output_file:
        fieldnames = ['id', 'date', 'val']
        writer = csv.DictWriter(output_file, fieldnames=fieldnames)
        writer.writeheader()

        for row in output_data:
            writer.writerow(row)