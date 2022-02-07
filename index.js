const express = require("express");
const fetch = require("node-fetch");
const port = 8080;
const app = express();

app.get("/weather", (req, res) => {
  const { query } = req.query;

  async function getCoordinates() {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=d96beee654ef44ea20145d8faaab6ac2`
    );
    const data = await response.json();
    return data;
  }

  async function getWeather() {
    const {
      coord: { lat, lon },
    } = await getCoordinates();
    console.log(lat, lon);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d96beee654ef44ea20145d8faaab6ac2`
    );
    const data = await response.json();
    const dataToClient = {
      city: data.name,
      isRaining: data.weather[0].main == "Rain",
      temperature: data.main.temp,
      humidity: data.main.humidity,
    };
    res.json(dataToClient);
  }
  try {
    getWeather();
  } catch (e) {
    res.send(`Couldn't get weather for ${query}. Error: ${e}`);
  }
});

app.get("/", (req, res) => {
  res.send(
    `<form action="/weather"><input name="query" id="query" type="text" placeholder="where do you live?" /><input type="submit" /></form>`
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
