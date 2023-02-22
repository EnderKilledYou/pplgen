import {Configuration, OpenAIApi} from "openai";
import showdown from "showdown";

const converter = new showdown.Converter()

import path from "path";
import fs from "fs";
const base_path = 'C:\\twitch\\purpleTV\\'

import {cli} from "cli-ux";

let article_data = []
if (fs.existsSync(base_path+ 'data.json')) {
  article_data = JSON.parse(fs.readFileSync(base_path+ 'data.json', 'utf-8'))
}

const menu = fs.readFileSync(base_path+ 'menu.html', 'utf-8');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const __dirname = process.cwd();

function get_title(choice) {
  let titleIndex = choice.indexOf('#');
  let end = choice.indexOf("\n", titleIndex + 1);
  let caption_title = ' ';
  if (titleIndex >= 0) {

    caption_title = choice.substring(titleIndex + 1, end);


  }
  return caption_title;
}

function get_meta(choice) {
  let searchString = "## Meta Keywords";
  let meta_start = choice.indexOf(searchString);
  let meta = "";
  let markdown = choice;

  if (meta_start >= 0) {
    meta = choice.substring(meta_start + searchString.length)

    markdown = markdown.substring(0, meta_start)
  } else {
    searchString = "## Keywords";
    meta_start = choice.indexOf(searchString);
    if (meta_start >= 0) {

      meta = choice.substring(meta_start + searchString.length)
      markdown = markdown.substring(0, meta_start)
    } else {

    }

  }
  return {meta, markdown};
}

function get_excerpt(choice) {
  let searchString = "## Excerpt";
  let excerpt_start = choice.indexOf(searchString);
  let excerpt = "";
  let markdown = choice;

  if (excerpt_start >= 0) {
    excerpt = choice.substring(excerpt_start + searchString.length)

    markdown = markdown.substring(0, excerpt_start)
  } else {


  }
  return {excerpt, markdown};
}

function update_database(slugs, caption_title, streamer_name, markdown, excerpt, meta, img,) {
  let found = false;
  let items = {
    slugs,
    caption_title,
    streamer_name,
    markdown,
    img:img,
    data: {excerpt, SEODESC: meta, }
  };
  for (let i = 0; i < article_data.length; i++) {
    const item = article_data[i];
    const slugs2 = item['slugs'];
    if (path.join(...slugs) === path.join(...slugs2)) {
      article_data[i] = items;
      found = true;
      break;
    }
  }
  if (!found) {
    article_data.push(items);
  }
  fs.writeFileSync(base_path+ 'data.json', JSON.stringify(article_data), 'utf-8')
}

function ToTailWind(makeHtml, img) {
  return makeHtml.replace(/<li>/g, '<li class="list-decimal list-inside">')
    .replace(/<ol>/g, '<ol class="mb-4">')
    .replace(/<p>/g, '<p class="ml-16 mb-4">')
    .replace(/<ul>/g, '<ul class="pl-8 mb-4">')
    .replace(/<a /g, '<a class="hover:text-red-700" ')
    .replace(/<h1 id=/g, '<h1 class="text-gray-800 text-3xl font-bold" id=')
    .replace(/<h2 id=/g, '<h2 class="text-2xl leading-normal mb-2 font-semibold text-gray-800 dark:text-gray-100" id=')
    .replace(/<h3 id=/g, '<h3 class="text-2xl leading-normal mb-2 font-semibold text-gray-800 dark:text-gray-100" id=')
    .replace(/<h4 id=/g, '<h4 class="text-2xl leading-normal mb-2 font-semibold text-gray-800 dark:text-gray-100" id=')
    .replace(/<img[^>]*src="([^"]+)"[^>]*>/, `<figure class="lg:float-left text-center lg:text-left ml-0 lg:-ml-4 mr-7 mb-7">
              <img src="${img}"
                   alt="profile-picture"/>
            </figure>`)
    .replace(/src='[^']+'/g, `src='${img}'`)
}

async function generate(streamer_name, slugs, img) {
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
    const html = ToTailWind(converter.makeHtml(markdown2), img)
    const excerpt_html = converter.makeHtml(excerpt)


    await generateFile(slugs, streamer_name, html, {
      SEODESC: meta,
      SEOIMG: img,
      MENU: menu,
      excerpt:excerpt,
      TITLE: caption_title
    })

    update_database(slugs, caption_title, streamer_name, markdown, excerpt, meta,img);

  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

async function generateFile(slugs = [], streamer = '', html = '', args = {}) {
  const outputPath =  path.join(...slugs)
  let this_path = path.join(base_path, outputPath);
  if (!fs.existsSync(outputPath)) {

    fs.mkdirSync(this_path, {recursive: true})
  }
  let tmpl = fs.readFileSync(base_path+ 'single-2-template.html', 'utf-8');

  tmpl = tmpl.replace('__Streamer__', streamer);
  tmpl = tmpl.replace('__CONTENT__', html);
  for (const key of Object.keys(args)) {
    tmpl = tmpl.replace(new RegExp('__' + key + '__', 'gi'), args[key]);
  }
  fs.writeFileSync(path.join(this_path, 'index.html'), tmpl, 'utf-8');
}

async function query() {
while(true) {
  const name = await cli.prompt('What is the streamer\'s name?')
  const word1 = await cli.prompt('Give me a word to describe them?')
  const word2 = await cli.prompt('Give me another word to describe them?')
  const img = await cli.prompt('Path to img?')
  cli.action.start('starting a generate')
  generate(name, ['topics', word1, word2, name], img)
  await cli.action.stop();
}
}
query()
//
//generate(`Seyeumi`, ['topics', 'Queen', 'Kind', 'Seyeumi'], 'https://pbs.twimg.com/profile_images/1570071257751908352/Kuymt36l_400x400.jpg')
//generate(`iGumdrop`, ['topics', 'Queen', 'Sweet', 'iGumdrop'], 'https://pbs.twimg.com/media/Fpho9xfaQAASVSa?format=jpg&name=medium')
//generate(`AriaSaki`, ['topics', 'Queen', 'Sweet', 'AriaSaki'], 'https://pbs.twimg.com/media/FpTz3tRaUAE8uUi?format=jpg&name=large')




