import fs from "fs";
import path from "path"
import {generate_articles2} from "./generate_articles2.js";
import {generate_article} from "./generate_article.js";
import {generate_slider} from "./generate_slider.js";
import {buildSitemaps} from "express-sitemap-xml";
import showdown from "showdown";

const converter = new showdown.Converter()
const __dirname = process.cwd();

const menu = fs.readFileSync(base_path + 'menu.html', 'utf-8');
const base_path = 'C:\\twitch\\purpleTV\\'
let article_data = []
if (fs.existsSync(base_path + 'data.json')) {
    article_data = JSON.parse(fs.readFileSync(base_path + 'data.json', 'utf-8'))
}
const urls = article_data.map(a => {
    return '/' + a['slugs'].join("/");
})
const sitemaps = await buildSitemaps(urls, 'https://purpleppl.site')
console.log(Object.keys(sitemaps))
console.log(sitemaps['/sitemap.xml'])
fs.writeFileSync(base_path + 'sitemap-new.xml', sitemaps['/sitemap.xml'], 'utf-8')

let tmpl = fs.readFileSync(base_path + 'index-3.html', 'utf-8');
if (article_data.length > 0) {
    let first = article_data.shift();
    let data = {
        "LEFT_HEADER_IMAGE": first['img'],
        "LEFT_HEADER": first['caption_title'],
        "LEFT_EXP": first['data']['excerpt'],
        "LEFT_LINK": path.join(...first['slugs'])
    }

    for (const key of Object.keys(data)) {
        tmpl = tmpl.replace(new RegExp('__' + key + '__', 'gi'), data[key]);
    }
    let i = 0;
    let _articles_ = '';
    while (true) {
        if (i++ > 3) {
            break;
        }
        if (article_data.length === 0) {
            break
        }
        first = article_data.shift();
        _articles_ += generate_article(first['img'], first['caption_title'], path.join(...first['slugs']))
    }
    tmpl = tmpl.replace(/__ARTICLES__/, _articles_)
    let GRIDS = '';
    if (article_data.length > 0) {
        i = 0;
        const tmp = [];

        while (article_data.length > 0 && i++ < 6) {
            tmp.push(article_data.shift())
        }

        GRIDS += generate_articles2(tmp);

    }
    //more grids
    if (article_data.length > 0) {
        article_data.sort(() => (Math.random() > .5) ? 1 : -1);
        i = 0;
        w3e
        const tmp = [];

        while (article_data.length > 0 && i++ < 12) {
            tmp.push(article_data.shift())
        }

        GRIDS += generate_slider(tmp);

    }
    tmpl = tmpl.replace(/__GRIDS__/, GRIDS);
    fs.writeFileSync(base_path + 'index.html', tmpl, 'utf-8')

}


async function generateFrontFile(slugs, streamer_name, caption_title, meta, excerpt, img) {
    const html = ToTailWind(converter.makeHtml(markdown2), img)
    const excerpt_html = converter.makeHtml(excerpt)


    await generateFile(slugs, streamer_name, html, {
        SEODESC: meta,
        SEOIMG: img,
        MENU: menu,
        excerpt: excerpt,
        TITLE: caption_title
    })
}

export function ToTailWind(makeHtml, img) {
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

async function generateFile(slugs = [], streamer = '', html = '', args = {}) {
    const outputPath = path.join(...slugs)
    let this_path = path.join(base_path, outputPath);
    if (!fs.existsSync(outputPath)) {

        fs.mkdirSync(this_path, {recursive: true})
    }
    let tmpl = fs.readFileSync(base_path + 'single-2-template.html', 'utf-8');

    tmpl = tmpl.replace('__Streamer__', streamer);
    tmpl = tmpl.replace('__CONTENT__', html);
    for (const key of Object.keys(args)) {
        tmpl = tmpl.replace(new RegExp('__' + key + '__', 'gi'), args[key]);
    }
    fs.writeFileSync(path.join(this_path, 'index.html'), tmpl, 'utf-8');
}
