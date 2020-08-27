const express = require('express');

const app = express();
const fs = require('fs').promises;
// const path = require('path');

// app.use(express.static(path.join(__dirname, 'data')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps)

app.get('/api/tickets', async (req, res) => {
  try {
    const ticketsFile = await fs.readFile('./data.json');
    const ticketsArr = JSON.parse(ticketsFile);
    if (req.query.searchText) {
      // eslint-disable-next-line max-len
      const re = new RegExp(req.query.searchText, 'i');
      res.send(ticketsArr.filter((ticket) => re.test(ticket.title)));
    } else {
      res.send(ticketsArr);
    }
  } catch (error) {
    console.log('error', error);
  }
});

app.post('/api/tickets/:ticketId/done', async (req, res) => {
  try {
    const ticketsFile = await fs.readFile('./data.json');
    const ticketsArr = JSON.parse(ticketsFile);
    ticketsArr.forEach((ticket, i) => {
      if (ticket.id === req.params.ticketId) {
        ticketsArr[i].done = true;
      }
    });
    await fs.writeFile('./data.json', JSON.stringify(ticketsArr));
  } catch (error) {
    console.log('error', error);
  } finally {
    res.send('updated: true');
  }
});

app.post('/api/tickets/:ticketId/undone', async (req, res) => {
  try {
    const ticketsFile = await fs.readFile('./data.json');
    const ticketsArr = JSON.parse(ticketsFile);
    ticketsArr.forEach((ticket, i) => {
      if (ticket.id === req.params.ticketId) {
        ticketsArr[i].done = false;
      }
    });
    await fs.writeFile('./data.json', JSON.stringify(ticketsArr));
  } catch (error) {
    console.log('error', error);
  } finally {
    res.send('updated: true');
  }
});

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});