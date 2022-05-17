import { Activity } from "../../activity";
import { FeedManager } from "../../manager";
import { MemoryFeedManager } from "../../memory.manager";
import {
    Constructible,
    FeedManagerType,
    Instance,
    ObjectId,
    ObjectType,
} from "../../types";
import { selectSummary } from "../../utils";
import { Create, Delete, Dislike, Follow, Like, Unfollow } from "../../verbs";
import { Post, PostData, User } from "./models";

export class UserFeedManager extends MemoryFeedManager {
    constructor(public readonly repo: Repo<typeof User>) {
        super();
    }

    getActorFollowers(actorId: ObjectId): ObjectId[] {
        const user = this.repo.get(actorId);

        return user ? user.followers : [];
    }
}

export class PostFeedManager extends MemoryFeedManager {
    constructor(public readonly repo: Repo<typeof Post>) {
        super();
    }

    getActorFollowers(actorId: ObjectId): ObjectId[] {
        const post = this.repo.get(actorId);

        return post ? post.likedBy.concat([post.creator]) : [];
    }
}

class Repo<T extends Constructible<ObjectType<any>>> {
    data = new Map<ObjectId, Instance<T>>();

    constructor(public readonly type: T) {}

    create(...args: ConstructorParameters<T>) {
        const instance = new this.type(...args);

        this.data.set(instance.id, instance);

        return instance;
    }

    delete(id: ObjectId) {
        this.data.delete(id);
    }

    get(id: ObjectId) {
        return this.data.get(id);
    }
}

export class Api {
    userRepo = new Repo(User);
    postRepo = new Repo(Post);
    userFeedManager = new UserFeedManager(this.userRepo);
    postFeedManager = new PostFeedManager(this.postRepo);

    followUser(followerId: ObjectId, followeeId: ObjectId) {
        const follower = this.userRepo.get(followerId);
        const followee = this.userRepo.get(followeeId);

        if (!followee || !follower) {
            return;
        }

        followee.followers.push(followerId);

        this.userFeedManager.add(
            followeeId,
            new Activity(Date.now(), { id: follower.id }, Follow, {
                id: followee.id,
            })
        );
    }

    unfollowUser(followerId: ObjectId, followeeId: ObjectId) {
        const follower = this.userRepo.get(followerId);
        const followee = this.userRepo.get(followeeId);

        if (!followee || !follower) {
            return;
        }

        const followerIdx = followee.followers.indexOf(followerId);

        if (followerIdx === -1) {
            return;
        }

        followee.followers.splice(followerIdx, 1);

        this.userFeedManager.add(
            followerId,
            new Activity(Date.now(), { id: follower.id }, Unfollow, {
                id: followee.id,
            })
        );
    }

    createPost(data: PostData) {
        const creator = this.userRepo.get(data.creator);

        if (!creator) {
            return;
        }

        const post = this.postRepo.create(data);

        creator.posts.push(post.id);

        this.userFeedManager.add(
            creator.id,
            new Activity(Date.now(), { id: creator.id }, Create, {
                id: post.id,
            })
        );

        return post;
    }

    deletePost(postId: ObjectId, userId: ObjectId) {
        const post = this.postRepo.get(postId);
        const user = this.userRepo.get(userId);

        if (!post || !user) {
            return;
        }

        this.postRepo.delete(postId);
        const postIdx = user.posts.indexOf(postId);
        user.posts.splice(postIdx, 1);

        this.userFeedManager.add(
            user.id,
            new Activity(Date.now(), { id: user.id }, Delete, { id: post.id })
        );
    }

    likePost(userId: ObjectId, postId: ObjectId) {
        const user = this.userRepo.get(userId);
        const post = this.postRepo.get(postId);

        if (!user || !post) {
            return;
        }

        post.likedBy.push(userId);

        this.userFeedManager.add(
            user.id,
            new Activity(Date.now(), { id: user.id }, Like, { id: post.id })
        );

        this.postFeedManager.add(
            post.id,
            new Activity(Date.now(), { id: user.id }, Like, { id: post.id })
        );
    }

    dislikePost(userId: ObjectId, postId: ObjectId) {
        const user = this.userRepo.get(userId);
        const post = this.postRepo.get(postId);

        if (!user || !post) {
            return;
        }

        const userIdx = post.likedBy.indexOf(userId);

        if (userIdx === 1) {
            return;
        }

        post.likedBy.splice(userIdx);

        this.userFeedManager.add(
            user.id,
            new Activity(Date.now(), { id: user.id }, Dislike, { id: post.id })
        );

        this.postFeedManager.add(
            post.id,
            new Activity(Date.now(), { id: user.id }, Dislike, { id: post.id })
        );
    }
}

export const getSummary = (
    feedManager: FeedManagerType,
    actorId: ObjectId
) => ({
    actorId,
    feed: feedManager.getActorFeed(actorId)?.getMany().map(selectSummary) ?? [],
});
