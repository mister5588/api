const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;


const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for scores (replace this with a database in a production environment)
let scores = {};

app.post('/updateScore', async (req, res) => {
  try {
    const { username, winNum } = req.body;

    // If the user doesn't exist or has a higher score, update the score
    if (!scores[username] || winNum > scores[username]) {
      scores[username] = winNum;

      // Save the updated scores to a JSON file (replace this with database storage)
      await saveScores();

      res.json({ success: true, message: 'Score updated successfully!' });
    } else {
      res.json({ success: false, message: 'Score not higher than the current score.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Helper function to save scores to a JSON file
async function saveScores() {
  const data = JSON.stringify(scores, null, 2);
  await fs.writeFile('scores.json', data, 'utf-8');
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
