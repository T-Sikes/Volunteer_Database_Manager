# Volunteer DB Setup Instructions

READ THIS FULLY BEFORE EDITING OR MAKING ANY CHANGES THAT DEAL WITH THE DATABASE!

This app uses MySQL for the database. Follow these steps to get set up:

## 1. Install Dependencies
Make sure you have MySQL installed and running.
Install Python dependencies:

```bash
pip install -r requirements.txt



#you must then create an SQL database either through command-Line or thorugh MySQL Workbench
#run this code and replace with your own values , you will need to remember values bc you will need to update settings.py in backend_core/ to point to this database

#CREATE DATABASE myprojectname;
CREATE USER 'project_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON volunteer_project.* TO 'project_user'@'localhost';
FLUSH PRIVILEGES;

#configue settings.py, example:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


run the migrations that are present in the volunteer_db folder to create the database
the migrations files describe to django how to tell SQL to create the tables within the database
the tables should already be created properly they just need to be connected to the GET and POST REQUESTS
Table data is NOT SHARED they are local copies. The migrations will be pushed to the github. each person must run the migrations 
after pulling the code to creat their own tables that i have described (the requireed ones) in their local database. 
Do not push migrations of your own to the github, changes in data to the database are not pushed to the github. 

for now the tables are empty. Soon i will provide prepoluated tables that we can load into the tables using commands like 


python manage.py loaddata volunteer_db/fixtures/<fixture_file>.json

for now, just pull the code, and run this command AFTER you have created the database in sql workbench and connected it in settingsl.py and confirmed the models.py file
in volunteer_db is not empty. (DO NOT FORGET TO CD INTO BACKEND FOLDER, do not run this from within another folder or 'app')

python manage.py makemigrations volunteer_db  #creates a new migrations file
python manage.py migrate volunteer_db         #applies migration file to database


DO NOT I REPEAT DO NOT PUSH YOUR OWN MIGRTIONS FILES.... YOU DO NOT NEED THEM
THESE ARE LOCAL COPIES, IF YOU ADD DATA IT DOES NOT CHANGE IN THE GIT, THE MIGRTIONS ARE FOR THE 
STRUCTURE OF THE TABLES, IF YOU PUSH OR EDIT THE MODELS YOU WILL MESS UP THE DATABASE. You can add info and data to the table
but if you chagne the sturcutre (add validation, add a row or column ,delete a row or column, change a relationship) you must
make and run migations. Please contact Tate before making DB changes. 