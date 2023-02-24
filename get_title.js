export default function get_title(choice) {
    let titleIndex = choice.indexOf('#');
    let end = choice.indexOf("\n", titleIndex + 1);
    let caption_title = ' ';
    if (titleIndex >= 0) {

        caption_title = choice.substring(titleIndex + 1, end);


    }
    return caption_title;
}
