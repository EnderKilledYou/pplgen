import {openai} from "./openai.js";

export async function getwords(name) {
    const completion = await openai.createCompletion({
            model: "text-davinci-003",
            max_tokens: 1300,
            prompt: "Give me two words about " + name,
        }
    );
    const txt = completion.data.choices[0].text.trim().split(/[\b\s]/).map(a => a.replace(/\W/g, '').trim());

    const word1 = txt[0]
    const word2 = txt[1]
    return {word1, word2};
}
