import path from "path";

export function generate_slider(items) {
    return `<!-- slider news -->
<div class="relative bg-gray-50"
     style="background-image: url('src/img/bg.jpg');background-size: cover;background-position: center center;background-attachment: fixed">
  <div class="bg-black bg-opacity-70">
    <div class="xl:container mx-auto px-3 sm:px-4 xl:px-2">
      <div class="flex flex-row flex-wrap">
        <div class="flex-shrink max-w-full w-full py-12 overflow-hidden">
          <div class="w-full py-3">
            <h2 class="text-white text-2xl font-bold text-shadow-black">
              <span class="inline-block h-5 border-l-3 border-red-600 mr-2"></span>Recent
            </h2>
          </div>
          <div id="post-carousel" class="splide post-carousel">
            <div class="splide__track">
              <ul class="splide__list">
                ${
        items.map(generate_slider_inner)
    }
           
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}

export function generate_slider_inner(first) {
    let link = '/' + first['slugs'].join("/");
    return `           <li class="splide__slide">
                  <div class="w-full pb-3">
                    <div class="hover-img bg-white">
                      <a href="${link}">
                        <img class="max-w-full w-full mx-auto" src="${first['img']}" alt="alt title">
                      </a>
                      <div class="py-3 px-6">
                        <h3 class="text-lg font-bold leading-tight mb-2">
                         <a href="${link}">${first['caption_title']}</a>
                        </h3>
                        <a class="text-gray-500" href="#"><span
                          class="inline-block h-3 border-l-2 border-red-600 mr-2"></span>Purple PPL</a>
                      </div>
                    </div>
                  </div>
                </li>`
}
