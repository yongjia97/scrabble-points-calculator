# [Scrabble points calculator] - utilise react modal and react toastify 
This is the front end for the Scrabble Points Calculator application.
### prerequisities
1. Install node.js

### installation
1. Clone the repository to your local machine from my git repo:
# https://github.com/yongjia97/scrabble-points-calculator.git
### Run frontend in local
once cloned to your local machine:
1. Change to the project directory
   # cd scrabble-points-calculator/frontend
2. Install dependencies
   #  npm install
3. Start the development server
   #  npm start

## The front end application running on port 3000.You can access your front end application in the browser (http://localhost:3000) ##


### Backend
This is the backend server for the Scrabble Points Calculator application.
step to create-react-app

### prerequisities
1. Install node.js ( please ignore if have installed node.js)
2. MySQL server (or equivalent database)

### installation
1. Clone the repository to your local machine from my git repo: ( please ignore if you clone it before)
# https://github.com/yongjia97/scrabble-points-calculator.git
### Run backend in local
once cloned to your local machine:
1. Change to the project directory 
  # cd scrabble-points-calculator/server  

2. Install dependencies
  # npm install

3. Configure mysql connection
   
  a. Open the server.js file in the src folder.
  b. Update the MySQL connection configuration with your database credentials (host, user, password, and database name).

4. Create database table
   
  a. Open your MySQL client or terminal and connect to your MySQL server.
  b. Run the following SQL query to create the 'scores_and_words' table:
  
    CREATE TABLE scores_and_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    score INT NOT NULL,
    scrabble_word VARCHAR(255) NOT NULL UNIQUE
    );

5. Run the server
  # npm start
 ##The back end application running on port 8080.The server is a back-end application responsible for processing HTTP requests and providing data and services to the front-end application.It is running at (http://localhost:8080) ##

1. Execute the unit test for ScrabblePointsCalculator and TopScoreView components. You can see the results in your terminal.
  # cd scrabble-points-calculator/frontend
  # npm test
