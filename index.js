import express from "express";
import * as dotenv from "dotenv";

dotenv.config();
import {getSinglePost} from "./getSinglePost.js";
import {processStreamer} from "./processStreamer.js";
import {connectDB} from "./connectDB.js";


const app = express()
app.use(express.json());
const port = 3000


app.post('/', async (req, res) => {
    if (!req.body.apiKey) {
        return;
    }
    if (!req.body.apiKey === process.env.API_KEY) {
        return;
    }
    if (!(req.body.imageURL && req.body.pageURL)) {
        return;
    }
    const name = req.body.pageURL;
    const exists = await getSinglePost(name);
    if (!exists.success) {
        res.status(500).send(name.message);
        return
    }
    if (exists.post) {
        res.status(200).send("exists");
        return;
    }
    await processStreamer(name, res, req);

})
connectDB(process.env.MONGODB_URL).then(() => {
    app.listen(port, () => {
        console.log(`back end listening on port, mongo connected ${port}`)
    })
})
