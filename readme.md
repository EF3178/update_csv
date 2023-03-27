# Update csv database utility

"Update csv database utility" is a  tool for creating and updating any csv file, to be used as a database . It is packaged as a Windows executable to make it easy to use.

## Usage

To use "Update csv database", follow these steps:

 1.  Place the executable file in the same file as your source .csv files
 2.  Run the executable
 3.  On the first run, it will automatically  create a "database.csv" file and add all rows from other csv files in the same directory
 4.  On the second run (and all following ones) it will 
		a. check for each row of if the input files' "Id" field, 
		b. if this Id already exists in the database, it will replace the database row with the input file row
		c. if this Id does not exist yet in the database, it will add the row 

## Installation

No install required, just execute the .exe file.
When modifying the code, you will have to package the executable using pkg npm package using the following command line :

    pkg csvupdate.js


## License

Program Name is licensed under the MIT license. 

## Contact

If you need help, please contact us at elian.faggion@gmail.com. 
