# Update csv database utility

"Update csv database utility" is a tool enabling to use a csv file as a database. It will create and update the database csv file, based on 1 or several csv source files having the same fields (colmun headers), and using the first column (named "Id") as the key to the table. 
It can be packaged as a Windows executable to make it easy to use in a Windows environment.

## Usage

To use "Update csv database", follow these steps:

 1.  Place the executable file in the same directory as your source .csv files
 2.  Run the executable
 3.  On the first run, it will automatically  create a "database.csv" file and add all rows from other csv files in the same directory
 4.  On the second run (and all following ones) it will 
    - [X] check for each row of if the input files' "Id" field,  
    - [X] if this Id already exists in the database, it will replace the database row with the input file row
    - [X] if this Id does not exist yet in the database, it will add the row to database.csv file
5. Once the .csv file have been processed, a report will automatically be generated in the form of a .txt file in the /reports folder (this folder is automatically created on the first run)

## Installation

No install required, just execute the .exe file.
When modifying the code, you will have to package the executable using pkg npm package using the following command line :

    pkg index.js


## License

Update_csv_database utility is licensed under the MIT license. Free to use and fork for any personal usage.

## Support

Submit any bug or suggestion for improvements in the "issues" section of the present Github repo. 
