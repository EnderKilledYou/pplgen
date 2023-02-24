import mongoose from "mongoose";

export const Post = new mongoose.Schema({
    name: {type: String, required: true},
    title: {type: String, required: true},
    markdown: {type: String, required: true},
    markdown_pruned: {type: String, required: true},
    meta: {type: String, required: true},
    excerpt: {type: String, required: true},
    photo: {type: String, required: true},
    slugs: {type: [String], required: true}
});
