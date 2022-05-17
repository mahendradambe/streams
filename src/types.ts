export type Constructible<Type, Args extends any[] = any[]> = new (
    ...args: Args
) => Type;

export type Cast<T, U> = T extends U ? T : U;

export type Instance<TConstructible extends Constructible<unknown>> =
    TConstructible extends Constructible<infer Instance> ? Instance : never;

export type ObjectId = string | number;

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
    id: ObjectId;
    actor: ObjectType;
    verb: VerbType;
    object: ObjectType;
    target?: ObjectType;
    time: number;
    summary: string;
}

export interface ActivityStorageType {
    addMany(activities: ActivityType[]): void;
    removeMany(activities: ObjectId[]): void;
    getMany(activities: ObjectId[]): ActivityType[];
    get(id: ObjectId): ActivityType | undefined;
    purge(): void;
}

export interface TimelineStorageType {
    addMany(key: ObjectId, activities: ObjectId[]): void;
    removeMany(key: ObjectId, activities: ObjectId[]): void;
    getMany(key: ObjectId, count?: number, offset?: number): ObjectId[];
    purge(): void;
}

export interface FeedType {
    key: ObjectId;
    add(activity: ActivityType): void;
    remove(activity: ObjectId): void;
    addMany(activities: ActivityType[]): void;
    removeMany(activities: ObjectId[]): void;
    get(id: ObjectId): ActivityType | undefined;
    getMany(count?: number, offset?: number): ActivityType[];
    activityStorage: ActivityStorageType;
    timelineStorage: TimelineStorageType;
}

export interface FeedManagerType {
    actorFeed: Constructible<FeedType>;
    feedTypes: Constructible<FeedType>[];
    add(actorId: ObjectId, activity: ActivityType): void;
    remove(actorId: ObjectId, activity: ObjectId): void;
    getActorFeed(actorId: ObjectId): FeedType;
    getActorFeeds(actorId: ObjectId): FeedType[];
    getActorFollowers(actorId: ObjectId): ObjectId[];
    followFeed(destination: FeedType, source: FeedType): void;
    unfollowFeed(destination: FeedType, source: FeedType): void;
    followActor(destination: ObjectId, source: ObjectId): void;
    unfollowActor(destination: ObjectId, source: ObjectId): void;
}
