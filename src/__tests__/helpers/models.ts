import { FeedManagerType, ObjectId } from "../../types";

export interface PostData {
    id: string;
    content: string;
    creator: ObjectId;
}

export class Post {
    id: ObjectId;
    content: string;
    creator: ObjectId;
    likedBy: ObjectId[] = [];

    constructor({ id, content, creator }: PostData) {
        this.id = id;
        this.content = content;
        this.creator = creator;
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            likedBy: this.likedBy,
        };
    }
}

export interface UserData {
    id: ObjectId;
}

export class User {
    public id: ObjectId;
    public posts: ObjectId[] = [];
    public liked: ObjectId[] = [];
    public followers: ObjectId[] = [];

    constructor({ id }: UserData) {
        this.id = id;
    }

    toJSON() {
        return {
            id: this.id,
            posts: this.posts,
            followers: this.followers,
        };
    }
}
