export function get_excerpt(choice) {
    const match = /((\*\*|##)\s*Excerpt.*)/i.exec(choice);
    if (!match) {
        return;
    }
    let excerpt_start = match.index + match[0].length;
    let excerpt = choice.substring(excerpt_start)
    let markdown = choice.substring(0, match.index)
    return {excerpt, markdown};
}
