import {openai} from "./openai.js";
import get_title from "./get_title.js";
import {get_excerpt} from "./get_excerpt.js";
import {get_meta} from "./get_meta.js";
export async function generate(streamer_name, slugs, img, callback) {
    try {


        const cooking_prompt = `Write a kind blog article of streamer ${streamer_name} and include their accomplishments and most well known attributes in the style of a cooking recipe.  Format it as markdown. Add links to all their socials and an profile image of them  .   Add a Excerpt  after that. Add a meta keyword section after that for google seo'`
        const cooking2_prompt = `Write a kind blog article of streamer ${streamer_name} and include their accomplishments and most well known attributes in the style of an old west villain.  Format it as markdown. Add links to all her socials.   Add a Excerpt after that. Add a meta keyword section after that for google seo'`
        const completion = await openai.createCompletion({
                model: "text-davinci-003",
                max_tokens: 1300,
                prompt: cooking_prompt,
            }
        );

        const choice = completion.data.choices[0].text;
        let caption_title = get_title(choice);
        let {meta, markdown} = get_meta(choice);
        let {excerpt, markdown: markdown2} = get_excerpt(markdown);


        callback(slugs, caption_title, choice, markdown2, excerpt, meta)

    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}
