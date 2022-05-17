import { VerbType } from "./types";
import { VerbRegistry } from "./verb-registry";

const registry = VerbRegistry.create();

export const Create: VerbType = {
    id: 1,
    infinitive: "create",
    pastTense: "created",
};
registry.register(Create);

export const Like: VerbType = {
    id: 2,
    infinitive: "like",
    pastTense: "liked",
};
registry.register(Like);

export const Dislike: VerbType = {
    id: 2,
    infinitive: "dislike",
    pastTense: "disliked",
};
registry.register(Dislike);

export const Follow: VerbType = {
    id: 3,
    infinitive: "follow",
    pastTense: "followed",
};
registry.register(Follow);

export const Unfollow: VerbType = {
    id: 4,
    infinitive: "unfollow",
    pastTense: "unfollowed",
};
registry.register(Unfollow);
