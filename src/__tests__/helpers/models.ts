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

    // createPost(content: string = "") {
    //     const post: Post = new Post({ content, creator: this.id });

    //     this.posts.push(post.id);
    //     POSTS.push(post);

    //     userFeedManager.add(
    //         this.id,
    //         new Activity(Date.now(), this.toJson(), Create, post.toJson())
    //     );

    //     return post;
    // }

    // likePost(postId: ObjectId) {
    //     const post = POSTS.find((p) => p.id === postId);

    //     if (post) {
    //         this.liked.push(postId);
    //         post.like(this.id);

    //         userFeedManager.add(
    //             this.id,
    //             new Activity(Date.now(), { id: this.id }, Like, {
    //                 id: post.id,
    //             })
    //         );
    //     }
    // }

    // dislikePost(postId: ObjectId) {
    //     const post = POSTS.find((p) => p.id === postId);

    //     if (post) {
    //         const postIdx = this.liked.indexOf(postId);
    //         this.liked.splice(postIdx, 1);

    //         post.dislike(this.id);

    //         userFeedManager.add(
    //             this.id,
    //             new Activity(Date.now(), this.toJson(), Dislike, post.toJson())
    //         );
    //     }
    // }

    toJSON() {
        return {
            id: this.id,
            posts: this.posts,
            followers: this.followers,
        };
    }
}
