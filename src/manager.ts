import {
    ActivityType,
    Constructible,
    FeedManagerType,
    FeedType,
    ObjectId,
} from "./types";
import { selectId } from "./utils";

export abstract class FeedManager implements FeedManagerType {
    abstract actorFeed: Constructible<FeedType>;

    abstract feedTypes: Constructible<FeedType>[];

    abstract getActorFollowers(actorId: ObjectId): ObjectId[];

    add(actorId: ObjectId, activity: ActivityType): void {
        this.getActorFeed(actorId).add(activity);

        const followers = this.getActorFollowers(actorId);

        followers.forEach((follower) => {
            const feeds = this.getActorFeeds(follower);

            feeds.forEach((feed) => {
                feed.add(activity);
            });
        });
    }

    remove(actorId: ObjectId, activity: number): void {
        this.getActorFeed(actorId).remove(activity);

        const followers = this.getActorFollowers(actorId);

        followers.forEach((follower) => {
            const feeds = this.getActorFeeds(follower);

            feeds.forEach((feed) => {
                feed.remove(activity);
            });
        });
    }

    getActorFeed(actorId: ObjectId): FeedType {
        return new this.actorFeed(actorId);
    }

    getActorFeeds(actorId: ObjectId): FeedType[] {
        return this.feedTypes.map((feedType) => new feedType(actorId));
    }

    followFeed(destination: FeedType, source: FeedType) {
        destination.addMany(source.getMany());
    }

    unfollowFeed(destination: FeedType, source: FeedType) {
        destination.removeMany(source.getMany().map(selectId));
    }

    followActor(destination: ObjectId, source: ObjectId) {
        const destinationFeeds = this.getActorFeeds(destination);
        const sourceFeeds = this.getActorFeeds(source);

        destinationFeeds.forEach((feed) => {
            feed.addMany(sourceFeeds.flatMap((source) => source.getMany()));
        });
    }

    unfollowActor(destination: ObjectId, source: ObjectId) {
        const destinationFeeds = this.getActorFeeds(destination);
        const sourceFeeds = this.getActorFeeds(source);

        destinationFeeds.forEach((feed) => {
            feed.removeMany(
                sourceFeeds.flatMap((source) =>
                    source.getMany().map((activity) => activity.id)
                )
            );
        });
    }
}
