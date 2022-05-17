import { beforeEach, describe, expect, it } from "vitest";
import {
    MemoryActivityStorage,
    MemoryTimelineStorage,
} from "../memory.storage";
import { Api, getSummary, User, UserFeedManager } from "./helpers";

describe("streams", () => {
    let api: Api;
    let mahendra: User;
    let sameer: User;
    let swapnil: User;
    let dinesh: User;

    let userFeedManager: UserFeedManager;

    beforeEach(() => {
        MemoryActivityStorage.create().purge();
        MemoryTimelineStorage.create().purge();

        api = new Api();

        mahendra = api.userRepo.create({ id: "mahendra" });
        sameer = api.userRepo.create({ id: "sameer" });
        swapnil = api.userRepo.create({ id: "swapnil" });
        dinesh = api.userRepo.create({ id: "dinesh" });

        userFeedManager = api.userFeedManager;
    });

    it("should be defined", () => {
        expect(api).toBeDefined();
        expect(api.postRepo).toBeDefined();
        expect(api.postFeedManager).toBeDefined();
        expect(api.userRepo).toBeDefined();
        expect(api.userFeedManager).toBeDefined();

        expect(mahendra).toBeDefined();
        expect(sameer).toBeDefined();
        expect(swapnil).toBeDefined();
        expect(dinesh).toBeDefined();
    });

    it("should create an activity for follow", () => {
        api.followUser(sameer.id, swapnil.id);

        const sameerSummary = getSummary(userFeedManager, sameer.id);
        const swapnilSummary = getSummary(userFeedManager, swapnil.id);

        expect(sameerSummary).toMatchSnapshot();
        expect(swapnilSummary).toMatchSnapshot();
    });

    it("should notify followers when post is created", () => {
        api.followUser(sameer.id, swapnil.id);
        api.createPost({
            id: "Post 1",
            content: "Some Content",
            creator: swapnil.id,
        });

        const sameerSummary = getSummary(userFeedManager, sameer.id);
        const swapnilSummary = getSummary(userFeedManager, swapnil.id);

        expect(sameerSummary.feed.length).toBe(2);
        expect(swapnilSummary.feed.length).toBe(2);
        expect(sameerSummary).toMatchSnapshot();
        expect(swapnilSummary).toMatchSnapshot();
    });

    it("should notify creator when someone likes the post", () => {
        const post = api.createPost({
            id: "Post 1",
            content: "Some Content",
            creator: swapnil.id,
        });
        api.likePost(mahendra.id, post.id);

        const mahendraSummary = getSummary(userFeedManager, mahendra.id);
        const swapnilSummary = getSummary(userFeedManager, swapnil.id);

        expect(mahendraSummary.feed.length).toBe(1);
        expect(swapnilSummary.feed.length).toBe(2);
        expect(mahendraSummary).toMatchSnapshot();
        expect(swapnilSummary).toMatchSnapshot();
    });

    it("should notify everyone who likes the post when someone new likes the post", () => {
        const post = api.createPost({
            id: "Post 1",
            content: "Some Content",
            creator: swapnil.id,
        });
        api.likePost(mahendra.id, post.id);
        api.likePost(sameer.id, post.id);

        const mahendraSummary = getSummary(userFeedManager, mahendra.id);
        const swapnilSummary = getSummary(userFeedManager, swapnil.id);
        const sameerSummary = getSummary(userFeedManager, sameer.id);

        expect(mahendraSummary.feed.length).toBe(2);
        expect(swapnilSummary.feed.length).toBe(3);
        expect(sameerSummary.feed.length).toBe(1);
        expect(mahendraSummary).toMatchSnapshot();
        expect(swapnilSummary).toMatchSnapshot();
        expect(sameerSummary).toMatchSnapshot();
    });

    it("should notify when someone dislikes the post", () => {
        const post = api.createPost({
            id: "Post 1",
            content: "Some Content",
            creator: swapnil.id,
        });
        api.likePost(mahendra.id, post.id);
        api.dislikePost(mahendra.id, post.id);

        const mahendraSummary = getSummary(userFeedManager, mahendra.id);
        const swapnilSummary = getSummary(userFeedManager, swapnil.id);

        expect(mahendraSummary.feed.length).toBe(2);
        expect(swapnilSummary.feed.length).toBe(3);
        expect(mahendraSummary).toMatchSnapshot();
        expect(swapnilSummary).toMatchSnapshot();
    });

    it("shouldn't notify about deleting a post", () => {
        const post = api.createPost({
            id: "Post 1",
            content: "Some Content",
            creator: swapnil.id,
        });
        api.likePost(mahendra.id, post.id);
        api.likePost(sameer.id, post.id);
        api.dislikePost(dinesh.id, post.id);
        api.deletePost(post.id, dinesh.id);

        const mahendraSummary = getSummary(userFeedManager, mahendra.id);
        const swapnilSummary = getSummary(userFeedManager, swapnil.id);
        const sameerSummary = getSummary(userFeedManager, sameer.id);
        const dineshSummary = getSummary(userFeedManager, dinesh.id);

        expect(mahendraSummary.feed.length).toBe(3);
        expect(swapnilSummary.feed.length).toBe(4);
        expect(sameerSummary.feed.length).toBe(1);
        expect(dineshSummary.feed.length).toBe(2);
        expect(mahendraSummary).toMatchSnapshot();
        expect(swapnilSummary).toMatchSnapshot();
        expect(sameerSummary).toMatchSnapshot();
        expect(dineshSummary).toMatchSnapshot();
    });
});
