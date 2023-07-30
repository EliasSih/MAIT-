const express = require('express');
const neo4j = require('neo4j-driver');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Create a connection to your Neo4j database
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Obtain a session from the driver
const session = driver.session();

app.get('/', (req, res) => {
  res.send({ message: 'Hello from server!' });
});

app.get('/routers', async (req, res, next) => {
  try {
    // Execute a Cypher query to fetch all routers
    const result = await session.run('MATCH (r:Router) RETURN r');

    // Convert the result to an array of objects
    const routers = result.records.map(record => record.get('r').properties);

    //log data
    console.log('---------------------Data---------------------------------');
    console.log(result);

    // Send the data to the client
    res.json(routers);
  } catch (error) {
    // Handle error
    res.status(500).json({ error: 'An error occurred while fetching routers' });
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
