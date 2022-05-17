import { FeedManager } from "./manager";
import { MemoryFeed } from "./memory.feed";

export abstract class MemoryFeedManager extends FeedManager {
    actorFeed = MemoryFeed;
    feedTypes = [MemoryFeed];
}
