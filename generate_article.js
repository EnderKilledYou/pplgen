export function generate_article(img, title, link) {
    return `      <article class="flex-shrink max-w-full w-full sm:w-1/2">
              <div class="relative hover-img max-h-48 overflow-hidden">
                <a href="#">
                  <img class="max-w-full w-full mx-auto h-auto" src="${img}" alt="Image description">
                </a>
                <div class="absolute px-4 pt-7 pb-4 bottom-0 w-full bg-gradient-cover">
                  <a href="${link}">
                    <h2 class="text-lg font-bold capitalize leading-tight text-white mb-1">${title}</h2>
                  </a>
                  <div class="pt-1">
                    <div class="text-gray-100">
                      <div class="inline-block h-3 border-l-2 border-red-600 mr-2"></div>
                      Purple PPL
                    </div>
                  </div>
                </div>
              </div>
            </article>`
}
