import fs from "fs";
import path from "path"
import {generate_articles2} from "./generate_articles2.js";
import {generate_article} from "./generate_article.js";
import {generate_slider} from "./generate_slider.js";
import {buildSitemaps} from "express-sitemap-xml";


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
fs.writeFileSync(base_path + 'sitemap-new.xml',sitemaps['/sitemap.xml'],'utf-8')

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
        const tmp = [];

        while (article_data.length > 0 && i++ < 12) {
            tmp.push(article_data.shift())
        }

        GRIDS += generate_slider(tmp);

    }
    tmpl = tmpl.replace(/__GRIDS__/, GRIDS);
    fs.writeFileSync(base_path + 'index.html', tmpl, 'utf-8')

}


