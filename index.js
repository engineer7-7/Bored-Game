import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let msg = "";
let hasSubmitted = false;
let hasError = false;


app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://bored-api.appbrewery.com/random");
        const result = response.data;
        res.render("index.ejs", {
            data: result,
            hasSubmitted: hasSubmitted,
            hasError: hasError,
            msg: msg,
            response_data: null
        });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message
        });
    }
});

app.post("/submit", async (req, res) => {
    hasSubmitted = true;
    const type = req.body["type"];
    const participants = req.body["participants"];
    try {
        const response = await axios.get(`https://bored-api.appbrewery.com/filter/?type=${type}&participants=${participants}`);
        const result = response.data;
        const result_length = result.length;
        let random_number = Math.floor(Math.random() * result_length);
        let random_result = result[random_number];
        res.render("index.ejs", {
            response_data: random_result,
            hasSubmitted: hasSubmitted,
            hasError: hasError,
            msg: msg,
            data: null
        });

    } catch (error) {
        if (error.response?.status === 404) {
            res.render("index.ejs", {
                msg: "No activities that match your criteria",
                hasError: true,
                hasSubmitted: true,
                response_data: null,
                data: null
            });

        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
