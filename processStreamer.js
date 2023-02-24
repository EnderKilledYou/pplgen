import {getwords} from "./getwords.js";


import {generate} from "./generate.js";
import {PostSchema} from "./postSchema.js";

export async function processStreamer(name, res, req) {
    const {word1, word2} = await getwords(name);
    if (!word1 || !word2) {
        res.send({message:"no words"});
        return
    }
    console.log(`Starting ${req.body.imageURL} ${name} words: ${word1} ${word2}`)

      generate(name, ['topics', word1, word2, name], req.body.imageURL, async (slugs, title, markdown, markdown_pruned, excerpt, meta) => {
        const new_post = {
            name,
            title,
            photo: req.body.imageURL,
            excerpt,
            meta,
            slugs,
            markdown,
            markdown_pruned
        };
        const newPost = await PostSchema.create(new_post);

        console.log(new_post)
    })
    res.send({message:"ok"});

}
