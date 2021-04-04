import pandas as pd
import json

"""
Description:

     extracts data from a csv file so it can be used with charts JS to create
     either a line plot or a scatter plot.

Input:

    Path to CSV file, with an independent and dependent variable (X,Y) 2-coloumns
    required.

    The CSV file must have each point seprated by a comma and on a new line each
    like so to the Nth row:

                dataX_1,dataY_1
                dataX_2,dataY_2
                       .
                       .
                       .
                datax_N,dataY_N

Output:

    JSON object to file called 'extractedData.json' in CWD, which has the
    "point format" data structure specified on chart JS docs.

Note:

    DON'T FORGET TO PARSE!!

    Use JSON.parse in Javascript to convert the JSON file that is created into a
    Javascript object literal which is required for Chart js. The quotes ("")
    around the key in the dumped dict might cause issues if used directly.
"""
def extractData(dataSource):

    extractedData = []
    df = pd.read_csv(dataSource)

    #set coloumn headings to x , y
    df.columns = ["x","y"]

    for index, row in df.iterrows():

        #checks for empty values and assigns them null
        if pd.isna(row["x"]) and not pd.isna(row["y"]):
            #create point object for each row
            point = {'x':None, 'y':row["y"]}

        if not pd.isna(row["y"]) and pd.isna(row["y"]):
            #create point object for each row
            point = {'x':row["x"], 'y':None}

        if pd.isna(row["x"]) and pd.isna(row["y"]):
            #create point object for each row
            point = {'x':None, 'y':None}

        if not pd.isna(row["x"]) and not pd.isna(row["y"]):
            #create point object for each row
            point = {'x':row["x"], 'y':row["y"]}


        #append the point object to the extracted data list
        extractedData.append(point)

    with open(f"{dataSource}_extractedData.json", "w") as file:
        json.dump(extractedData, file)
