import { describe, expect, it } from "vitest";
import { Activity } from "../activity";
import { MemoryFeedManager } from "../memory.manager";
import { ObjectId } from "../types";
import { Create, Dislike, Like } from "../verbs";

class UserFeedManager extends MemoryFeedManager {
    private constructor() {
        super();
    }

    getActorFollowers(actorId: ObjectId): ObjectId[] {
        const user = USERS.concat(POSTS as any).find((u) => u.id === actorId);

        return user ? user.followers : [];
    }

    static create() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new UserFeedManager();
        return this._instance;
    }

    private static _instance: UserFeedManager;
}

const manager = UserFeedManager.create();

class Post {
    id: ObjectId;
    followers: ObjectId[] = [];

    constructor(public readonly content: string, creator: ObjectId) {
        this.id = `${content.substring(0, 5)}-${Math.random()
            .toString(36)
            .substring(5, 12)}`;

        this.followers.push(creator);
    }

    like(actor: ObjectId) {
        this.followers.push(actor);

        manager.add(
            this.id,
            new Activity(Date.now(), { id: actor }, Like, { id: this.id })
        );
    }

    dislike(actor: ObjectId) {
        const likeIdx = this.followers.indexOf(actor);

        if (likeIdx >= 0) {
            this.followers.splice(likeIdx, 1);

            manager.add(
                this.id,
                new Activity(Date.now(), { id: actor }, Dislike, {
                    id: this.id,
                })
            );
        }
    }

    toJson() {
        return {
            id: this.id,
            content: this.content,
        };
    }
}

const POSTS: Post[] = [];

class User {
    public posts: ObjectId[] = [];
    public liked: ObjectId[] = [];

    constructor(public id: ObjectId, public followers: ObjectId[]) {}

    createPost(content: string = "") {
        const post: Post = new Post(content, this.id);

        this.posts.push(post.id);
        POSTS.push(post);

        manager.add(
            this.id,
            new Activity(Date.now(), this.toJson(), Create, post.toJson())
        );

        return post;
    }

    likePost(postId: ObjectId) {
        const post = POSTS.find((p) => p.id === postId);

        if (post) {
            this.liked.push(postId);
            post.like(this.id);

            manager.add(
                this.id,
                new Activity(Date.now(), { id: this.id }, Like, {
                    id: post.id,
                })
            );
        }
    }

    dislikePost(postId: ObjectId) {
        const post = POSTS.find((p) => p.id === postId);

        if (post) {
            const postIdx = this.liked.indexOf(postId);
            this.liked.splice(postIdx, 1);

            post.dislike(this.id);

            manager.add(
                this.id,
                new Activity(Date.now(), this.toJson(), Dislike, post.toJson())
            );
        }
    }

    toJson() {
        return {
            id: this.id,
        };
    }
}

const USERS: User[] = [
    new User("mahendra", ["sameer"]),
    new User("sameer", ["mahendra"]),
    new User("swapnil", ["sameer"]),
];

describe("streams", () => {
    describe("feed manager", () => {
        describe("when a post is created", () => {
            it("should fanout", async () => {
                const mahendra = USERS[0];
                const sameer = USERS[1];
                const swapnil = USERS[2];
                const post = sameer.createPost("hello world");

                mahendra.likePost(post.id);
                swapnil.likePost(post.id);
                mahendra.dislikePost(post.id);

                const mahendraFeed = manager.getActorFeed(mahendra.id);
                const sameerFeed = manager.getActorFeed(sameer.id);
                const swapnilFeed = manager.getActorFeed(swapnil.id);

                const mahendraActivities = mahendraFeed.getMany();
                const sameerActivities = sameerFeed.getMany();
                const swapnilActivities = swapnilFeed.getMany();

                console.log(
                    "mahendra",
                    mahendraActivities.map((act) => (act as Activity).summary)
                );

                console.log(
                    "sameer",
                    sameerActivities.map((act) => (act as Activity).summary)
                );

                console.log(
                    "swapnil",
                    swapnilActivities.map((act) => (act as Activity).summary)
                );

                expect(mahendraActivities.length).toBe(3);
                expect(sameerActivities.length).toBe(3);
                expect(swapnilActivities.length).toBe(2);
            });
        });
    });
});
