export function get_meta(choice) {
    const match = /((\*\*|##)\s*Meta.*)/i.exec(choice);
    if (!match) {
        return;


    }

    let meta_start = match.index + match[0].length;
    let meta = choice.substring(meta_start)
    let markdown = choice.substring(0, match.index)

    return {meta, markdown};
}
