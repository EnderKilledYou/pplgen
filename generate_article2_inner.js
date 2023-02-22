import path from "path";

export function generate_article2_inner(first) {
    let link = '/' + first['slugs'].join("/");
    return ` <div
            class="flex-shrink max-w-full w-full sm:w-1/3 px-3 pb-3 pt-3 sm:pt-0 border-b-2 sm:border-b-0 border-dotted border-gray-100">
            <div class="flex flex-row sm:block hover-img">
              <a href="${link}">
                <img class="max-w-full w-full mx-auto" src="${first['img']}" alt="alt title">
              </a>
              <div class="py-0 sm:py-3 pl-3 sm:pl-0">
                <h3 class="text-lg font-bold leading-tight mb-2">
                  <a href="${link}">${first['caption_title']}</a>
                </h3>
           
                <a class="text-gray-500" href="#"><span
                  class="inline-block h-3 border-l-2 border-red-600 mr-2"></span>Purple Ppl</a>
              </div>
            </div>
          </div>`;
}
