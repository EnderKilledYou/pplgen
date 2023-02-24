import {Post} from "./post.js";
import {PostSchema} from "./postSchema.js";

export const getSinglePost = async (name) => {
    try {
        const post = await PostSchema.findOne({name: name}).exec();
        return {success: true, post}
    } catch (error) {
        console.log(error.message);
        return {success: false, message: error.message}
    }
};
