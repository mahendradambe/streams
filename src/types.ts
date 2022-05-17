export type Constructible<Type, Args extends any[] = any[]> = new (
    ...args: Args
) => Type;

export type Cast<T, U> = T extends U ? T : U;

export type Instance<TConstructible extends Constructible<unknown>> =
    TConstructible extends Constructible<infer Instance> ? Instance : never;

export type ObjectId = string | number;

export type ActivityId = number;

export interface VerbType {
    id: number;
    infinitive: string;
    pastTense: string;
}

export interface VerbRegistryType {
    register(verb: VerbType): void;
    getById(id: number): VerbType | undefined;
}

export type ObjectType<
    TData extends Record<string, any> = Record<string, any>
> = TData & {
    id: ObjectId;
};

export interface ActivityType {
    id: ActivityId;
    actor: ObjectType;
    verb: VerbType;
    object: ObjectType;
    target?: ObjectType;
    time: number;
}

export interface ActivityStorageType {
    addMany(activities: ActivityType[]): void;
    removeMany(activities: ActivityId[]): void;
    getMany(activities: ActivityId[]): ActivityType[];
    get(id: ActivityId): ActivityType | undefined;
}

export interface TimelineStorageType {
    addMany(key: ObjectId, activities: ActivityId[]): void;
    removeMany(key: ObjectId, activities: ActivityId[]): void;
    getMany(key: ObjectId, count?: number, offset?: number): ActivityId[];
}

export interface FeedType {
    key: ObjectId;
    add(activity: ActivityType): void;
    remove(activity: ActivityId): void;
    addMany(activities: ActivityType[]): void;
    removeMany(activities: ActivityId[]): void;
    get(id: ActivityId): ActivityType | undefined;
    getMany(count?: number, offset?: number): ActivityType[];
    activityStorage: ActivityStorageType;
    timelineStorage: TimelineStorageType;
}

export interface FeedManagerType {
    actorFeed: Constructible<FeedType>;
    feedTypes: Constructible<FeedType>[];
    add(actorId: ObjectId, activity: ActivityType): void;
    remove(actorId: ObjectId, activity: ActivityId): void;
    getActorFeed(actorId: ObjectId): FeedType;
    getActorFeeds(actorId: ObjectId): FeedType[];
    getActorFollowers(actorId: ObjectId): ObjectId[];
    followFeed(destination: FeedType, source: FeedType): void;
    unfollowFeed(destination: FeedType, source: FeedType): void;
    followActor(destination: ObjectId, source: ObjectId): void;
    unfollowActor(destination: ObjectId, source: ObjectId): void;
}
