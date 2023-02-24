import mongoose from "mongoose";
import {Post} from "./post.js";

export const PostSchema = mongoose.model("Post", Post);
