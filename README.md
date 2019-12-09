Requirements:
* Node
* npm
* mysql
*****
1. Make sure you have `node` and `npm` installed and have access to it globally
2. cd to the directory where you downloaded/pulled the repository
3. Run the command `npm install` (This will install all components mentioned in `package.json`)
4. Start the database and set it up with the initial data. The initial data is obtained from the script `Database/teammakingtest_schema_no_data_dump.sql`
5. Edit the `.env` file in the root directory of the project to be sure the database access settings are correct for your setup.
6. To start the webpack-dev-server, run `npm run start` (this will watch for changes and recompile)
7. To start the express API server, run `npx nodemon` (This will watch changes to code and restart the express server)
8. Lanch a browser and navigate to localhost:8080 
