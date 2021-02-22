require("dotenv").config();
var cors = require("cors");
const express = require("express");
const nodeFetch = require("node-fetch");

const app = express();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const API = process.env.API;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", async (req, res) => {
  try {
    let { page } = req.query;

    const itemPerPage = 20;
    const offset = (page - 1) * itemPerPage;

    const response = await nodeFetch(
      `${API}?api_key=${API_KEY}&offset=${offset}&page_number=${page}`
    );
    const data = await response.json();

    let arrData = [];

    data.response.posts.map((item) => {
      let objData = {};

      objData.post_url = item.post_url;
      objData.image_url = item.photos[0].original_size.url;
      objData.image_width = item.photos[0].original_size.width;
      objData.image_height = item.photos[0].original_size.height;

      arrData.push(objData);
    });
    if (data.response.posts.length === 0) {
      return res.sendStatus(204);
    }
    res.json({ data: arrData, page: page });
  } catch (error) {
    res.status(400).json({
      err: 1,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
