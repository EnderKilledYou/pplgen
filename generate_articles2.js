import {generate_article2_inner} from "./generate_article2_inner.js";

export function generate_articles2(up_to_six_items) {
    let art_str = '';
    for (const item of up_to_six_items) {
        art_str += generate_article2_inner(item);
    }
    return `<div class="bg-white">
  <div class="xl:container mx-auto px-3 sm:px-4 xl:px-2">
    <div class="flex flex-row flex-wrap">
      <!-- Left -->
      <div class="flex-shrink max-w-full w-full lg:w-2/3 overflow-hidden">
        <div class="w-full py-3">
          <h2 class="text-gray-800 text-2xl font-bold">
            <span class="inline-block h-5 border-l-3 border-red-600 mr-2"></span>Recent
          </h2>
        </div>
        <div class="flex flex-row flex-wrap -mx-3">

     ${art_str}
        </div>
      </div>
      <!-- right -->
      <div class="flex-shrink max-w-full w-full lg:w-1/3 lg:pl-8 lg:pt-14 lg:pb-8 order-first lg:order-last">
        <div class="w-full bg-gray-50 h-full">
          <div class="text-sm py-6 sticky">
            <div class="w-full text-center">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
