/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Empty } from "../../../../../google/protobuf/empty.pb";
import { Timestamp } from "../../../../../google/protobuf/timestamp.pb";
import { Status } from "../../../../../google/rpc/status.pb";

export const protobufPackage = "swarming.v2";

/**
 * Use one of the values in this enum to query for tasks in one of the
 * specified state.
 *
 * Use 'ALL' to not use any filtering based on task state.
 *
 * As an example, this enum enables querying for all tasks with state COMPLETED
 * but non-zero exit code via COMPLETED_FAILURE.
 *
 * Do not confuse StateQuery and TaskState. StateQuery is to query tasks
 * via the API. TaskState is the current task state.
 */
export enum StateQuery {
  /** QUERY_PENDING - Query for all tasks currently TaskState.PENDING. */
  QUERY_PENDING = 0,
  /**
   * QUERY_RUNNING - Query for all tasks currently TaskState.RUNNING. This includes tasks
   * currently in the overhead phase; mapping input files or archiving outputs
   * back to the server.
   */
  QUERY_RUNNING = 1,
  /**
   * QUERY_PENDING_RUNNING - Query for all tasks currently TaskState.PENDING or TaskState.RUNNING. This
   * is the query for the 'active' tasks.
   */
  QUERY_PENDING_RUNNING = 2,
  /**
   * QUERY_COMPLETED - Query for all tasks that completed normally as TaskState.COMPLETED,
   * independent of the process exit code.
   */
  QUERY_COMPLETED = 3,
  /**
   * QUERY_COMPLETED_SUCCESS - Query for all tasks that completed normally as TaskState.COMPLETED and that
   * had exit code 0.
   */
  QUERY_COMPLETED_SUCCESS = 4,
  /**
   * QUERY_COMPLETED_FAILURE - Query for all tasks that completed normally as TaskState.COMPLETED and that
   * had exit code not 0.
   */
  QUERY_COMPLETED_FAILURE = 5,
  /** QUERY_EXPIRED - Query for all tasks that are TaskState.EXPIRED. */
  QUERY_EXPIRED = 6,
  /** QUERY_TIMED_OUT - Query for all tasks that are TaskState.TIMED_OUT. */
  QUERY_TIMED_OUT = 7,
  /** QUERY_BOT_DIED - Query for all tasks that are TaskState.BOT_DIED. */
  QUERY_BOT_DIED = 8,
  /** QUERY_CANCELED - Query for all tasks that are TaskState.CANCELED. */
  QUERY_CANCELED = 9,
  /**
   * QUERY_ALL - Query for all tasks, independent of the task state.
   *
   * In hindsight, this constant should have been the value 0. Sorry, the
   * original author was young and foolish.
   */
  QUERY_ALL = 10,
  /**
   * QUERY_DEDUPED - Query for all tasks that are TaskState.COMPLETED but that actually didn't
   * run due to TaskProperties.idempotent being True *and* that a previous task
   * with the exact same TaskProperties had successfully run before, aka
   * COMPLETED_SUCCESS.
   */
  QUERY_DEDUPED = 11,
  /** QUERY_KILLED - Query for all tasks that are TaskState.KILLED. */
  QUERY_KILLED = 12,
  /** QUERY_NO_RESOURCE - Query for all tasks that are TaskState.NO_RESOURCE. */
  QUERY_NO_RESOURCE = 13,
  /** QUERY_CLIENT_ERROR - Query for all tasks that are TaskState.CLIENT_ERROR. */
  QUERY_CLIENT_ERROR = 14,
}

export function stateQueryFromJSON(object: any): StateQuery {
  switch (object) {
    case 0:
    case "QUERY_PENDING":
      return StateQuery.QUERY_PENDING;
    case 1:
    case "QUERY_RUNNING":
      return StateQuery.QUERY_RUNNING;
    case 2:
    case "QUERY_PENDING_RUNNING":
      return StateQuery.QUERY_PENDING_RUNNING;
    case 3:
    case "QUERY_COMPLETED":
      return StateQuery.QUERY_COMPLETED;
    case 4:
    case "QUERY_COMPLETED_SUCCESS":
      return StateQuery.QUERY_COMPLETED_SUCCESS;
    case 5:
    case "QUERY_COMPLETED_FAILURE":
      return StateQuery.QUERY_COMPLETED_FAILURE;
    case 6:
    case "QUERY_EXPIRED":
      return StateQuery.QUERY_EXPIRED;
    case 7:
    case "QUERY_TIMED_OUT":
      return StateQuery.QUERY_TIMED_OUT;
    case 8:
    case "QUERY_BOT_DIED":
      return StateQuery.QUERY_BOT_DIED;
    case 9:
    case "QUERY_CANCELED":
      return StateQuery.QUERY_CANCELED;
    case 10:
    case "QUERY_ALL":
      return StateQuery.QUERY_ALL;
    case 11:
    case "QUERY_DEDUPED":
      return StateQuery.QUERY_DEDUPED;
    case 12:
    case "QUERY_KILLED":
      return StateQuery.QUERY_KILLED;
    case 13:
    case "QUERY_NO_RESOURCE":
      return StateQuery.QUERY_NO_RESOURCE;
    case 14:
    case "QUERY_CLIENT_ERROR":
      return StateQuery.QUERY_CLIENT_ERROR;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum StateQuery");
  }
}

export function stateQueryToJSON(object: StateQuery): string {
  switch (object) {
    case StateQuery.QUERY_PENDING:
      return "QUERY_PENDING";
    case StateQuery.QUERY_RUNNING:
      return "QUERY_RUNNING";
    case StateQuery.QUERY_PENDING_RUNNING:
      return "QUERY_PENDING_RUNNING";
    case StateQuery.QUERY_COMPLETED:
      return "QUERY_COMPLETED";
    case StateQuery.QUERY_COMPLETED_SUCCESS:
      return "QUERY_COMPLETED_SUCCESS";
    case StateQuery.QUERY_COMPLETED_FAILURE:
      return "QUERY_COMPLETED_FAILURE";
    case StateQuery.QUERY_EXPIRED:
      return "QUERY_EXPIRED";
    case StateQuery.QUERY_TIMED_OUT:
      return "QUERY_TIMED_OUT";
    case StateQuery.QUERY_BOT_DIED:
      return "QUERY_BOT_DIED";
    case StateQuery.QUERY_CANCELED:
      return "QUERY_CANCELED";
    case StateQuery.QUERY_ALL:
      return "QUERY_ALL";
    case StateQuery.QUERY_DEDUPED:
      return "QUERY_DEDUPED";
    case StateQuery.QUERY_KILLED:
      return "QUERY_KILLED";
    case StateQuery.QUERY_NO_RESOURCE:
      return "QUERY_NO_RESOURCE";
    case StateQuery.QUERY_CLIENT_ERROR:
      return "QUERY_CLIENT_ERROR";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum StateQuery");
  }
}

/** Flag to sort returned tasks. The natural sort is CREATED_TS. */
export enum SortQuery {
  QUERY_CREATED_TS = 0,
  QUERY_COMPLETED_TS = 2,
  QUERY_ABANDONED_TS = 3,
  QUERY_STARTED_TS = 4,
}

export function sortQueryFromJSON(object: any): SortQuery {
  switch (object) {
    case 0:
    case "QUERY_CREATED_TS":
      return SortQuery.QUERY_CREATED_TS;
    case 2:
    case "QUERY_COMPLETED_TS":
      return SortQuery.QUERY_COMPLETED_TS;
    case 3:
    case "QUERY_ABANDONED_TS":
      return SortQuery.QUERY_ABANDONED_TS;
    case 4:
    case "QUERY_STARTED_TS":
      return SortQuery.QUERY_STARTED_TS;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum SortQuery");
  }
}

export function sortQueryToJSON(object: SortQuery): string {
  switch (object) {
    case SortQuery.QUERY_CREATED_TS:
      return "QUERY_CREATED_TS";
    case SortQuery.QUERY_COMPLETED_TS:
      return "QUERY_COMPLETED_TS";
    case SortQuery.QUERY_ABANDONED_TS:
      return "QUERY_ABANDONED_TS";
    case SortQuery.QUERY_STARTED_TS:
      return "QUERY_STARTED_TS";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum SortQuery");
  }
}

/**
 * This flag is only relevant to windows swarming bots.
 * It determines whether or not the task process will use a win32 JobObject.
 */
export enum ContainmentType {
  /**
   * NOT_SPECIFIED - Do not specify a containment type. For tasks which don't run like
   * Termination task.
   */
  NOT_SPECIFIED = 0,
  /** NONE - Do not use JOB_OBJECT to create new tasks. Has same effect as NOT_SPECIFIED */
  NONE = 1,
  /**
   * AUTO - On windows, this will start a process using win32 JobObject.
   * On other platforms this will default to python standard POpen to create
   * task process.
   * See https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects
   */
  AUTO = 2,
  /** JOB_OBJECT - Use JOB_OBJECTS on windows. Will auto-fail tasks on non-win32 platforms. */
  JOB_OBJECT = 3,
}

export function containmentTypeFromJSON(object: any): ContainmentType {
  switch (object) {
    case 0:
    case "NOT_SPECIFIED":
      return ContainmentType.NOT_SPECIFIED;
    case 1:
    case "NONE":
      return ContainmentType.NONE;
    case 2:
    case "AUTO":
      return ContainmentType.AUTO;
    case 3:
    case "JOB_OBJECT":
      return ContainmentType.JOB_OBJECT;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ContainmentType");
  }
}

export function containmentTypeToJSON(object: ContainmentType): string {
  switch (object) {
    case ContainmentType.NOT_SPECIFIED:
      return "NOT_SPECIFIED";
    case ContainmentType.NONE:
      return "NONE";
    case ContainmentType.AUTO:
      return "AUTO";
    case ContainmentType.JOB_OBJECT:
      return "JOB_OBJECT";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ContainmentType");
  }
}

export enum NullableBool {
  NULL = 0,
  FALSE = 1,
  TRUE = 2,
}

export function nullableBoolFromJSON(object: any): NullableBool {
  switch (object) {
    case 0:
    case "NULL":
      return NullableBool.NULL;
    case 1:
    case "FALSE":
      return NullableBool.FALSE;
    case 2:
    case "TRUE":
      return NullableBool.TRUE;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum NullableBool");
  }
}

export function nullableBoolToJSON(object: NullableBool): string {
  switch (object) {
    case NullableBool.NULL:
      return "NULL";
    case NullableBool.FALSE:
      return "FALSE";
    case NullableBool.TRUE:
      return "TRUE";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum NullableBool");
  }
}

/**
 * Represents the current task state.
 *
 * Some states are still mutable: PENDING and RUNNING. The others are final and
 * will not change afterward.
 *
 * A task is guaranteed to be in exactly one state at any point of time.
 *
 * Do not confuse StateQuery and TaskState. StateQuery is to query tasks
 * via the API. TaskState is the current task state.
 *
 * As you read the following constants, astute readers may wonder why these
 * constants look like a bitmask. This is because of historical reasons and this
 * is effectively an enum, not a bitmask.
 */
export enum TaskState {
  /** INVALID - Invalid state, do not use. */
  INVALID = 0,
  /**
   * RUNNING - The task is currently running. This is in fact 3 phases: the initial
   * overhead to fetch input files, the actual task running, and the tear down
   * overhead to archive output files to the server.
   */
  RUNNING = 16,
  /**
   * PENDING - The task is currently pending. This means that no bot reaped the task. It
   * will stay in this state until either a task reaps it or the expiration
   * elapsed. The task pending expiration is specified as
   * TaskSlice.expiration_secs, one per task slice.
   */
  PENDING = 32,
  /**
   * EXPIRED - The task is not pending anymore, and never ran due to lack of capacity. This
   * means that other higher priority tasks ran instead and that not enough bots
   * were available to run this task for TaskSlice.expiration_secs seconds.
   */
  EXPIRED = 48,
  /**
   * TIMED_OUT - The task ran for longer than the allowed time in
   * TaskProperties.execution_timeout_secs or TaskProperties.io_timeout_secs.
   * This means the bot forcefully killed the task process as described in the
   * graceful termination dance in the documentation.
   */
  TIMED_OUT = 64,
  /**
   * BOT_DIED - The task ran but the bot had an internal failure, unrelated to the task
   * itself. It can be due to the server being unavailable to get task update,
   * the host on which the bot is running crashing or rebooting, etc.
   */
  BOT_DIED = 80,
  /**
   * CANCELED - The task never ran, and was manually cancelled via the 'cancel' API before
   * it was reaped.
   */
  CANCELED = 96,
  /**
   * COMPLETED - The task ran and completed normally. The task process exit code may be 0 or
   * another value.
   */
  COMPLETED = 112,
  /**
   * KILLED - The task ran but was manually killed via the 'cancel' API. This means the
   * bot forcefully killed the task process as described in the graceful
   * termination dance in the documentation.
   */
  KILLED = 128,
  /**
   * NO_RESOURCE - The task was never set to PENDING and was immediately refused, as the server
   * determined that there is no bot capacity to run this task. This happens
   * because no bot exposes a superset of the requested task dimensions.
   *
   * Set TaskSlice.wait_for_capacity to True to force the server to keep the task
   * slice pending even in this case. Generally speaking, the task will
   * eventually switch to EXPIRED, as there's no bot to run it. That said, there
   * are situations where it is known that in some not-too-distant future a wild
   * bot will appear that will be able to run this task.
   */
  NO_RESOURCE = 256,
  /**
   * CLIENT_ERROR - The task run into an issue that was caused by the client. It can be due to
   * a bad CIPD or CAS package. Retrying the task with the same parameters will
   * not change the result.
   */
  CLIENT_ERROR = 512,
}

export function taskStateFromJSON(object: any): TaskState {
  switch (object) {
    case 0:
    case "INVALID":
      return TaskState.INVALID;
    case 16:
    case "RUNNING":
      return TaskState.RUNNING;
    case 32:
    case "PENDING":
      return TaskState.PENDING;
    case 48:
    case "EXPIRED":
      return TaskState.EXPIRED;
    case 64:
    case "TIMED_OUT":
      return TaskState.TIMED_OUT;
    case 80:
    case "BOT_DIED":
      return TaskState.BOT_DIED;
    case 96:
    case "CANCELED":
      return TaskState.CANCELED;
    case 112:
    case "COMPLETED":
      return TaskState.COMPLETED;
    case 128:
    case "KILLED":
      return TaskState.KILLED;
    case 256:
    case "NO_RESOURCE":
      return TaskState.NO_RESOURCE;
    case 512:
    case "CLIENT_ERROR":
      return TaskState.CLIENT_ERROR;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TaskState");
  }
}

export function taskStateToJSON(object: TaskState): string {
  switch (object) {
    case TaskState.INVALID:
      return "INVALID";
    case TaskState.RUNNING:
      return "RUNNING";
    case TaskState.PENDING:
      return "PENDING";
    case TaskState.EXPIRED:
      return "EXPIRED";
    case TaskState.TIMED_OUT:
      return "TIMED_OUT";
    case TaskState.BOT_DIED:
      return "BOT_DIED";
    case TaskState.CANCELED:
      return "CANCELED";
    case TaskState.COMPLETED:
      return "COMPLETED";
    case TaskState.KILLED:
      return "KILLED";
    case TaskState.NO_RESOURCE:
      return "NO_RESOURCE";
    case TaskState.CLIENT_ERROR:
      return "CLIENT_ERROR";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TaskState");
  }
}

/**
 * Represents a mapping of string to a string.
 *
 * If the StringPair is itself repeated inside another message, the list
 * must be sorted by key and the keys must be unique.
 */
export interface StringPair {
  readonly key: string;
  readonly value: string;
}

/**
 * Represents a mapping of string to a list of strings.
 *
 * If the StringListPair is itself repeated inside another message, the list
 * must be sorted by key and the keys must be unique.
 */
export interface StringListPair {
  readonly key: string;
  /**
   * All the values for this key. values must be sorted. Human readable.
   *
   * This string should make sense to a user in the context of 'key'.
   */
  readonly value: readonly string[];
}

/** Reports details about the server. */
export interface ServerDetails {
  readonly serverVersion: string;
  readonly botVersion: string;
  readonly machineProviderTemplate: string;
  readonly displayServerUrlTemplate: string;
  readonly luciConfig: string;
  readonly casViewerServer: string;
}

/** Returns a token to bootstrap a new bot. */
export interface BootstrapToken {
  readonly bootstrapToken: string;
}

/** Reports the client's permissions. */
export interface ClientPermissions {
  readonly deleteBot: boolean;
  readonly deleteBots: boolean;
  readonly terminateBot: boolean;
  readonly getConfigs: boolean;
  readonly putConfigs: boolean;
  /** Cancel one single task */
  readonly cancelTask: boolean;
  readonly getBootstrapToken: boolean;
  /** Cancel multiple tasks at once, usually in emergencies. */
  readonly cancelTasks: boolean;
  readonly listBots: readonly string[];
  readonly listTasks: readonly string[];
}

/** contents of a file */
export interface FileContent {
  readonly content: string;
  readonly version: string;
  readonly who: string;
  readonly when: string | undefined;
}

/**
 * This is a [Digest][build.bazel.remote.execution.v2.Digest] of a blob on
 * RBE-CAS. See the explanations at the original definition.
 * pylint: disable=line-too-long
 * https://github.com/bazelbuild/remote-apis/blob/77cfb44a88577a7ade5dd2400425f6d50469ec6d/build/bazel/remote/execution/v2/remote_execution.proto#L753-L791
 */
export interface Digest {
  readonly hash: string;
  readonly sizeBytes: string;
}

export interface CASReference {
  /**
   * Full name of RBE-CAS instance. `projects/{project_id}/instances/{instance}`.
   * e.g. projects/chromium-swarm/instances/default_instance
   */
  readonly casInstance: string;
  /** CAS Digest consists of hash and size bytes. */
  readonly digest: Digest | undefined;
}

export interface CipdPackage {
  /**
   * A CIPD package to install in the run dir before task execution."""
   * A template of a full CIPD package name, e.g.
   * "infra/tools/authutil/${platform}"
   * See also cipd.ALL_PARAMS.
   */
  readonly packageName: string;
  /** Valid package version for all packages matched by package name. */
  readonly version: string;
  /**
   * Path to dir, relative to the root dir, where to install the package.
   * If empty, the package will be installed a the root of the mapped directory.
   * If file names in the package and in the isolate clash, it will cause a
   * failure.
   */
  readonly path: string;
}

/** Defines CIPD packages to install in task run directory. */
export interface CipdInput {
  /**
   * URL of the CIPD server. Must start with "https://" or "http://".
   * This field or its subfields are optional if default cipd client is defined
   * in the server config.
   */
  readonly server: string;
  /**
   * CIPD package of CIPD client to use.
   * client_package.version is required.
   * This field is optional is default value is defined in the server config.
   * client_package.path must be empty.
   */
  readonly clientPackage:
    | CipdPackage
    | undefined;
  /** List of CIPD packages to install. */
  readonly packages: readonly CipdPackage[];
}

/** Defines pinned CIPD packages that were installed during the task. */
export interface CipdPins {
  /** The pinned package + version of the CIPD client that was actually used. */
  readonly clientPackage:
    | CipdPackage
    | undefined;
  /**
   * List of CIPD packages that were installed in the task with fully resolved
   * package names and versions.
   */
  readonly packages: readonly CipdPackage[];
}

/**
 * Describes a named cache that should be present on the bot.
 *
 * A CacheEntry in a task specified that the task prefers the cache to be present
 * on the bot. A symlink to the cache directory is created at <run_dir>/|path|.
 * If cache is not present on the machine, the directory is empty.
 * If the tasks makes any changes to the contents of the cache directory, they
 * are persisted on the machine. If another task runs on the same machine and
 * requests the same named cache, even if mapped to a different path, it will see
 * the changes.
 */
export interface CacheEntry {
  /** Unique name of the cache. Required. Length is limited to 4096. */
  readonly name: string;
  /**
   * Relative path to the directory that will be linked to the named cache.
   * Required.
   * A path cannot be shared among multiple caches or CIPD installations.
   * A task will fail if a file/dir with the same name already exists.
   */
  readonly path: string;
}

export interface Containment {
  readonly containmentType: ContainmentType;
}

/** Important metadata about a particular task. */
export interface TaskProperties {
  /**
   * Specifies named caches to map into the working directory. These caches
   * outlives the task, which can then be reused by tasks later used on this bot
   * that request the same named cache.
   */
  readonly caches: readonly CacheEntry[];
  /**
   * CIPD packages to install. These packages are meant to be software that is
   * needed (a dependency) to the task being run. Unlike isolated files, the CIPD
   * packages do not expire from the server.
   */
  readonly cipdInput:
    | CipdInput
    | undefined;
  /**
   * Command to run. This has priority over a command specified in the isolated
   * files.
   */
  readonly command: readonly string[];
  /**
   * Relative working directory to start the 'command' in, defaults to the root
   * mapped directory or what is provided in the isolated file, if any.
   */
  readonly relativeCwd: string;
  /**
   * Dimensions are what is used to determine which bot can run the task. The
   * bot must have all the matching dimensions, even for repeated keys with
   * multiple different values. It is a logical AND, all values must match.
   *
   * It should have been a StringListPair but this would be a breaking change.
   */
  readonly dimensions: readonly StringPair[];
  /** Environment variables to set when running the task. */
  readonly env: readonly StringPair[];
  /**
   * Swarming-root relative paths to prepend to a given environment variable.
   *
   * These allow you to put certain subdirectories of the task into PATH,
   * PYTHONPATH, or other PATH-like environment variables. The order of
   * operations is:
   *   * Turn slashes into native-platform slashes.
   *   * Make the path absolute
   *   * Prepend it to the current value of the envvar using the os-native list
   *     separator (i.e. `;` on windows, `:` on POSIX).
   *
   * Each envvar can have multiple paths to prepend. They will be prepended in
   * the order seen here.
   *
   * For example, if env_prefixes was:
   *   [("PATH", ["foo", "bar"]),
   *    ("CUSTOMPATH", ["custom"])]
   *
   * The task would see:
   *   PATH=/path/to/swarming/rundir/foo:/path/to/swarming/rundir/bar:$PATH
   *   CUSTOMPATH=/path/to/swarming/rundir/custom
   *
   * The path should always be specified here with forward-slashes, and it must
   * not attempt to escape the swarming root (i.e. must not contain `..`).
   *
   * These are applied AFTER evaluating `env` entries.
   */
  readonly envPrefixes: readonly StringListPair[];
  /**
   * Maximum number of seconds the task can run before its process is forcibly
   * terminated and the task results in TIMED_OUT.
   */
  readonly executionTimeoutSecs: number;
  /**
   * Number of second to give the child process after a SIGTERM before sending a
   * SIGKILL. See doc/Bot.md#timeout-handling
   */
  readonly gracePeriodSecs: number;
  /**
   * True if the task does not access any service through the network and is
   * believed to be 100% reproducible with the same outcome. In the case of a
   * successful task, previous results will be reused if possible.
   */
  readonly idempotent: boolean;
  /**
   * Digest of the input root uploaded to RBE-CAS.
   * This MUST be digest of [build.bazel.remote.execution.v2.Directory].
   */
  readonly casInputRoot:
    | CASReference
    | undefined;
  /**
   * Maximum number of seconds the task may be silent (no output to stdout nor
   * stderr) before it is considered hung and it forcibly terminated early and
   * the task results in TIMED_OUT.
   */
  readonly ioTimeoutSecs: number;
  /** Paths in the working directory to archive back. */
  readonly outputs: readonly string[];
  /** Secret bytes to provide to the task. Cannot be retrieved back. */
  readonly secretBytes: Uint8Array;
  /** Containment of the task processes. */
  readonly containment: Containment | undefined;
}

/**
 * Defines a possible task execution for a task request to be run on the
 * Swarming infrastructure.
 *
 * This is one of the possible fallback on a task request.
 */
export interface TaskSlice {
  /**
   * The property of the task to try to run.
   *
   * If there is no bot that can serve this properties.dimensions when this task
   * slice is enqueued, it is immediately denied. This can trigger if:
   * - There is no bot with these dimensions currently known.
   * - Bots that could run this task are either all dead or quarantined.
   * Swarming considers a bot dead if it hasn't pinged in the last N minutes
   * (currently 10 minutes).
   */
  readonly properties:
    | TaskProperties
    | undefined;
  /**
   * Maximum of seconds the task slice may stay PENDING.
   *
   * If this task request slice is not scheduled after waiting this long, the
   * next one will be processed. If this slice is the last one, the task state
   * will be set to EXPIRED.
   */
  readonly expirationSecs: number;
  /**
   * When a task is scheduled and there are currently no bots available to run
   * the task, the TaskSlice can either be PENDING, or be denied immediately.
   * When denied, the next TaskSlice is enqueued, and if there's no following
   * TaskSlice, the task state is set to NO_RESOURCE. This should normally be
   * set to False to avoid unnecessary waiting.
   */
  readonly waitForCapacity: boolean;
}

export interface SwarmingTaskBackendConfig {
  /**
   * Task priority, the lower the more important.
   *
   * Valid values are between 1 and 255.
   */
  readonly priority: number;
  /**
   * Maximum delay (in seconds) between bot pings before the bot is considered
   * dead while running a task.
   *
   * When a task is running, the bot sends update to the server every
   * few seconds. In some cases, like when the system is overloaded,
   * the bot may be preempted and delayed in sending its updates.
   * After the delay specified here, the server will claim the bot to
   * be dead and will forcibly abort the task as BOT_DIED. This is to
   * catch system wide issues like a BSOD.
   */
  readonly botPingTolerance: string;
  /**
   * Parent Swarming task run ID of the process requesting this task.
   *
   * This field is set on the children tasks when a Swarming task creates
   * children Swarming tasks.
   *
   * This points to the TaskResult.run_id (ending with '1', '2' or more).
   */
  readonly parentRunId: string;
  /**
   * Defines what OAuth2 credentials the task uses when calling other services.
   *
   * Possible values are:
   *   - 'none': do not use a task service account at all, this is the default.
   *   - 'bot': use bot's own account, works only if bots authenticate with
   *       OAuth2.
   *  - <some email>: use this specific service account if it is allowed in the
   *       pool (via 'allowed_service_account' pools.cfg setting) and configured
   *       in the token server's service_accounts.cfg.
   *
   * Note that the service account name is specified outside of task properties,
   * and thus it is possible to have two tasks with different service accounts,
   * but identical properties hash (so one can be deduped). If this is
   * unsuitable use 'idempotent=False' or include a service account name in
   * properties separately.
   */
  readonly serviceAccount: string;
  /**
   * When a task is scheduled and there are currently no bots available to run
   * the task, the TaskSlice can either be PENDING, or be denied immediately.
   * When denied, the next TaskSlice is enqueued, and if there's no following
   * TaskSlice, the task state is set to NO_RESOURCE. This should normally be
   * set to False to avoid unnecessary waiting.
   */
  readonly waitForCapacity: boolean;
  /**
   * CIPD package of the agent binary that should be called to run the task
   * command. Note that it will end with "${platform}"
   */
  readonly agentBinaryCipdPkg: string;
  /** CIPD package tag or ref of the agent binary. */
  readonly agentBinaryCipdVers: string;
  /**
   * Name of the file within the CIPD package and should be used to construct
   * the task command line.
   */
  readonly agentBinaryCipdFilename: string;
  /** Name of the CIPD server. */
  readonly agentBinaryCipdServer: string;
  /**
   * Tags are 'key:value' strings that describes what the task is about.
   * This can later be leveraged to search for kinds of tasks per tag.
   */
  readonly tags: readonly string[];
}

/**
 * Swarming:ResultDB integration configuration for a task.
 * See NewTaskRequest.resultdb for more details.
 */
export interface ResultDBCfg {
  /**
   * If True and this task is not deduplicated, create
   * "task-{swarming_hostname}-{run_id}" invocation for this task,
   * provide its update token to the task subprocess via LUCI_CONTEXT
   * and finalize the invocation when the task is done.
   * If the task is deduplicated, then TaskResult.invocation_name will be the
   * invocation name of the original task.
   * Swarming:ResultDB integration is off by default, but it may change in the
   * future.
   */
  readonly enable: boolean;
}

/**
 * Description of a new task request as described by the client.
 * This message is used to create a new task.
 */
export interface NewTaskRequest {
  /** DEPRECATED. Use task_slices[0].expiration_secs. */
  readonly expirationSecs: number;
  /** Task name for display purpose. */
  readonly name: string;
  /**
   * Parent Swarming run ID of the process requesting this task. This is to tell
   * the server about reentrancy: when a task creates children Swarming tasks, so
   * that the tree of tasks can be presented in the UI; the parent task will list
   * all the children tasks that were triggered.
   */
  readonly parentTaskId: string;
  /** Task priority, the lower the more important. */
  readonly priority: number;
  /** DEPRECATED. Use task_slices[0].properties. */
  readonly properties:
    | TaskProperties
    | undefined;
  /**
   * Slice of TaskSlice, along their scheduling parameters. Cannot be used at the
   * same time as properties and expiration_secs.
   *
   * This defines all the various possible task execution for a task request to
   * be run on the Swarming infrastructure. They are processed in order, and it
   * is guaranteed that at most one of these will be processed.
   */
  readonly taskSlices: readonly TaskSlice[];
  /**
   * Tags are 'key:value' strings that describes what the task is about. This can
   * later be leveraged to search for kinds of tasks per tag.
   */
  readonly tags: readonly string[];
  /** User on which behalf this task is run, if relevant. Not validated. */
  readonly user: string;
  /**
   * Defines what OAuth2 credentials the task uses when calling other services.
   *
   * Possible values are:
   *   - 'none': do not use a task service account at all, this is the default.
   *   - 'bot': use bot's own account, works only if bots authenticate with
   *       OAuth2.
   *   - <some email>: use this specific service account if it is allowed in the
   *       pool (via 'allowed_service_account' pools.cfg setting) and configured
   *       in the token server's service_accounts.cfg.
   *
   * Note that the service account name is specified outside of task properties,
   * and thus it is possible to have two tasks with different service accounts,
   * but identical properties hash (so one can be deduped). If this is unsuitable
   * use 'idempotent=False' or include a service account name in properties
   * separately.
   */
  readonly serviceAccount: string;
  /**
   * Full topic name to post task state updates to, e.g.
   * "projects/<id>/topics/<id>".
   */
  readonly pubsubTopic: string;
  /** Secret string to put into "auth_token" attribute of PubSub message. */
  readonly pubsubAuthToken: string;
  /** Will be but into "userdata" fields of PubSub message. */
  readonly pubsubUserdata: string;
  /**
   * Only evaluate the task, as if we were going to schedule it, but don't
   * actually schedule it. This will return the TaskRequest, but without
   * a task_id.
   */
  readonly evaluateOnly: boolean;
  readonly poolTaskTemplate: NewTaskRequest_PoolTaskTemplateField;
  /**
   * Maximum delay between bot pings before the bot is considered dead
   * while running a task.
   */
  readonly botPingToleranceSecs: number;
  /**
   * This is used to make new task request idempotent in best effort.
   * If new request has request_uuid field, it checks memcache before scheduling
   * actual task to check there is already the task triggered by same request
   * previously.
   */
  readonly requestUuid: string;
  /** Configuration of Swarming:ResultDB integration. */
  readonly resultdb:
    | ResultDBCfg
    | undefined;
  /**
   * Task realm.
   * See api/swarming.proto for more details.
   */
  readonly realm: string;
}

/**
 * Controls the application of the pool's TaskTemplate to the creation of this
 * task. By default this will automatically select the pool's preference for
 * template, but you can also instruct swarming to prefer/prevent the
 * application of canary templates, as well as skipping the template
 * altogether.
 */
export enum NewTaskRequest_PoolTaskTemplateField {
  AUTO = 0,
  CANARY_PREFER = 1,
  CANARY_NEVER = 2,
  SKIP = 3,
}

export function newTaskRequest_PoolTaskTemplateFieldFromJSON(object: any): NewTaskRequest_PoolTaskTemplateField {
  switch (object) {
    case 0:
    case "AUTO":
      return NewTaskRequest_PoolTaskTemplateField.AUTO;
    case 1:
    case "CANARY_PREFER":
      return NewTaskRequest_PoolTaskTemplateField.CANARY_PREFER;
    case 2:
    case "CANARY_NEVER":
      return NewTaskRequest_PoolTaskTemplateField.CANARY_NEVER;
    case 3:
    case "SKIP":
      return NewTaskRequest_PoolTaskTemplateField.SKIP;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum NewTaskRequest_PoolTaskTemplateField",
      );
  }
}

export function newTaskRequest_PoolTaskTemplateFieldToJSON(object: NewTaskRequest_PoolTaskTemplateField): string {
  switch (object) {
    case NewTaskRequest_PoolTaskTemplateField.AUTO:
      return "AUTO";
    case NewTaskRequest_PoolTaskTemplateField.CANARY_PREFER:
      return "CANARY_PREFER";
    case NewTaskRequest_PoolTaskTemplateField.CANARY_NEVER:
      return "CANARY_NEVER";
    case NewTaskRequest_PoolTaskTemplateField.SKIP:
      return "SKIP";
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum NewTaskRequest_PoolTaskTemplateField",
      );
  }
}

/**
 * Description of a task request as registered by the server.
 * This message is used when retrieving information about an existing task.
 * See NewTaskRequest for more details.
 */
export interface TaskRequestResponse {
  readonly taskId: string;
  readonly expirationSecs: number;
  readonly name: string;
  readonly parentTaskId: string;
  readonly priority: number;
  /**
   * For some amount of time, the properties will be copied into the
   * task_slices and vice-versa, to give time to the clients to update.
   * Eventually, only task_slices will be supported.
   */
  readonly properties: TaskProperties | undefined;
  readonly tags: readonly string[];
  readonly createdTs: string | undefined;
  readonly user: string;
  /** User name of whoever posted this task, extracted from the credentials. */
  readonly authenticated: string;
  readonly taskSlices: readonly TaskSlice[];
  /** Indicates what OAuth2 credentials the task uses when calling other services. */
  readonly serviceAccount: string;
  readonly realm: string;
  /** Configuration of Swarming:ResultDB integration. */
  readonly resultdb: ResultDBCfg | undefined;
  readonly pubsubTopic: string;
  readonly pubsubUserdata: string;
  readonly botPingToleranceSecs: number;
  readonly rbeInstance: string;
}

/** Request to cancel one task. */
export interface TaskCancelRequest {
  readonly taskId: string;
  readonly killRunning: boolean;
}

/** Request to cancel some subset of pending/running tasks. */
export interface TasksCancelRequest {
  readonly limit: number;
  readonly cursor: string;
  readonly tags: readonly string[];
  readonly killRunning: boolean;
  readonly start: string | undefined;
  readonly end: string | undefined;
}

export interface OperationStats {
  /** Duration in seconds. */
  readonly duration: number;
}

export interface CASOperationStats {
  /** Duration in seconds. */
  readonly duration: number;
  readonly initialNumberItems: number;
  readonly initialSize: string;
  /**
   * These buffers are compressed as deflate'd delta-encoded varints. They are
   * all the items for an isolated operation, which can scale in the 100k range.
   * So can be large! See //client/utils/large.py for the code to handle these.
   */
  readonly itemsCold: Uint8Array;
  readonly itemsHot: Uint8Array;
  /**
   * Corresponding summaries; for each list above, sum of the number of files
   * and the sum bytes of the files.
   */
  readonly numItemsCold: string;
  readonly totalBytesItemsCold: string;
  readonly numItemsHot: string;
  readonly totalBytesItemsHot: string;
}

/**
 * Performance stats of task execution.
 * See task_result.PerformanceStats for details.
 */
export interface PerformanceStats {
  readonly botOverhead: number;
  readonly isolatedDownload: CASOperationStats | undefined;
  readonly isolatedUpload: CASOperationStats | undefined;
  readonly packageInstallation: OperationStats | undefined;
  readonly cacheTrim: OperationStats | undefined;
  readonly namedCachesInstall: OperationStats | undefined;
  readonly namedCachesUninstall: OperationStats | undefined;
  readonly cleanup: OperationStats | undefined;
}

/** Result of a request to cancel a task. */
export interface CancelResponse {
  /**
   * True if the cancellation succeeded. Either the task atomically changed
   * from PENDING to CANCELED or it was RUNNING and killing bit has been set.
   */
  readonly canceled: boolean;
  /** True if the task was running while it was canceled. */
  readonly wasRunning: boolean;
}

/** Result of canceling some subset of pending tasks. */
export interface TasksCancelResponse {
  readonly cursor: string;
  readonly now: string | undefined;
  readonly matched: number;
}

/** A task's output as a bytestring */
export interface TaskOutputResponse {
  readonly output: Uint8Array;
  /** Current state of the task (e.g. PENDING, RUNNING, COMPLETED, EXPIRED, etc). */
  readonly state: TaskState;
}

/** ResultDB related properties. */
export interface ResultDBInfo {
  /** ResultDB hostname, e.g. "results.api.cr.dev" */
  readonly hostname: string;
  /**
   * e.g. "invocations/task-chromium-swarm.appspot.com-deadbeef1"
   *
   * If the task was deduplicated, this equals invocation name of the original
   * task.
   */
  readonly invocation: string;
}

/** Representation of the TaskResultSummary or TaskRunResult ndb model. */
export interface TaskResultResponse {
  /** Summary task ID (ending with '0') when creating a new task. */
  readonly taskId: string;
  /**
   * Time when the task was abandoned instead of normal completion (e.g.
   * EXPIRED, BOT_DIED, KILLED).
   *
   * The same key cannot be repeated.
   */
  readonly botDimensions: readonly StringListPair[];
  /** Unique ID of the bot. */
  readonly botId: string;
  /** Time the bot became ready for a next task. */
  readonly botIdleSinceTs:
    | string
    | undefined;
  /** Hash of the bot code which ran the task. */
  readonly botVersion: string;
  /** The cloud project id where the bot saves its logs. */
  readonly botLogsCloudProject: string;
  /** List of task IDs that this task triggered, if any. */
  readonly childrenTaskIds: readonly string[];
  /**
   * Time the task completed normally. Only one of abandoned_ts or completed_ts
   * can be set except for state == KILLED.
   *
   * In case of KILLED, completed_ts is the time the task completed.
   */
  readonly completedTs:
    | string
    | undefined;
  /** $ saved for task with state DEDUPED. */
  readonly costSavedUsd: number;
  /** Time the task was requested. */
  readonly createdTs:
    | string
    | undefined;
  /** Task ID which results was reused for state DEDUPED. */
  readonly dedupedFrom: string;
  /** Duration of the task in seconds. This excludes overheads. */
  readonly duration: number;
  /**
   * Process exit code if relevant. May be forcibly set to -1 in exceptional
   * cases.
   */
  readonly exitCode: string;
  /** True if exit_code != 0. */
  readonly failure: boolean;
  /** True if state is BOT_DIED. */
  readonly internalFailure: boolean;
  /** Time the results was last updated in the DB. */
  readonly modifiedTs:
    | string
    | undefined;
  /**
   * CAS Digest of the output root uploaded to RBE-CAS.
   * This MUST be digest of [build.bazel.remote.execution.v2.Directory].
   */
  readonly casOutputRoot:
    | CASReference
    | undefined;
  /** Server versions that touched this task. */
  readonly serverVersions: readonly string[];
  /** Time the task started being run by a bot. */
  readonly startedTs:
    | string
    | undefined;
  /** Current state of the task (e.g. PENDING, RUNNING, COMPLETED, EXPIRED, etc). */
  readonly state: TaskState;
  /**
   * In the case of KILLED, this records the time the user requested the task to
   * stop.
   */
  readonly abandonedTs:
    | string
    | undefined;
  /** Can be multiple values only in TaskResultSummary. */
  readonly costsUsd: readonly number[];
  /** Name of the task. Only set when requesting task ID summary, ending with '0'. */
  readonly name: string;
  /**
   * Tags associated with the task when it was requested. Only set when
   * requesting task ID summary, ending with '0'.
   */
  readonly tags: readonly string[];
  /**
   * User on behalf this task was requested. Only set when requesting task ID
   * summary, ending with '0'.
   */
  readonly user: string;
  /** Statistics about overhead for an isolated task. Only sent when requested. */
  readonly performanceStats:
    | PerformanceStats
    | undefined;
  /**
   * Listing of the ACTUAL pinned CipdPackages that the task used. These can vary
   * from the input packages if the inputs included non-identity versions (e.g. a
   * ref like "latest").
   */
  readonly cipdPins:
    | CipdPins
    | undefined;
  /**
   * Actual executed task id that this task represents. For deduped tasks, it is
   * the same value as deduped_from. This value can be empty if there is no
   * execution, for example the task was cancelled.
   */
  readonly runId: string;
  /**
   * Index in the TaskRequest.task_slices (TaskSlice instance) that this result
   * represents. This is updated when a TaskSlice is enqueued to run.
   *
   * The TaskSlice contains a TaskProperties, which defines what is run.
   */
  readonly currentTaskSlice: number;
  /**
   * ResultDB related information.
   * None if the integration was not enabled for this task.
   */
  readonly resultdbInfo:
    | ResultDBInfo
    | undefined;
  /** Reported missing CAS packages on CLIENT_ERROR state */
  readonly missingCas: readonly CASReference[];
  /** Reported missing CIPD packages on CLIENT_ERROR state */
  readonly missingCipd: readonly CipdPackage[];
}

/** Only holds states. Used in the 'get_states' RPC. */
export interface TaskStates {
  readonly states: readonly TaskState[];
}

/** Wraps a list of TaskResult. */
export interface TaskListResponse {
  readonly cursor: string;
  readonly items: readonly TaskResultResponse[];
  readonly now: string | undefined;
}

/** Wraps a list of TaskRequest. */
export interface TaskRequestsResponse {
  readonly cursor: string;
  readonly items: readonly TaskRequestResponse[];
  readonly now: string | undefined;
}

/** Returns the count, as requested. */
export interface TasksCount {
  readonly count: number;
  readonly now: string | undefined;
}

/** Provides the ID of the requested TaskRequest. */
export interface TaskRequestMetadataResponse {
  readonly taskId: string;
  readonly request:
    | TaskRequestResponse
    | undefined;
  /** Set to finished task result in case task was deduplicated. */
  readonly taskResult: TaskResultResponse | undefined;
}

export interface TaskQueue {
  /**
   * Must be a list of 'key:value' strings to filter the returned list of bots
   * on.
   */
  readonly dimensions: readonly StringPair[];
  readonly validUntilTs: string | undefined;
}

export interface TaskQueueList {
  readonly cursor: string;
  /**
   * Note that it's possible that the RPC returns a tad more or less items than
   * requested limit.
   */
  readonly items: readonly TaskQueue[];
  readonly now: string | undefined;
}

/** Representation of the BotInfo ndb model. */
export interface BotInfo {
  readonly botId: string;
  readonly taskId: string;
  readonly externalIp: string;
  readonly authenticatedAs: string;
  readonly firstSeenTs: string | undefined;
  readonly isDead: boolean;
  readonly lastSeenTs: string | undefined;
  readonly quarantined: boolean;
  readonly maintenanceMsg: string;
  readonly dimensions: readonly StringListPair[];
  readonly taskName: string;
  readonly version: string;
  /** Encoded as json since it's an arbitrary dict. */
  readonly state: string;
  readonly deleted: boolean;
}

/** Wraps a list of BotInfo. */
export interface BotInfoListResponse {
  readonly cursor: string;
  readonly items: readonly BotInfo[];
  readonly now: string | undefined;
  readonly deathTimeout: number;
}

/** Returns the count, as requested. */
export interface BotsCount {
  readonly now: string | undefined;
  readonly count: number;
  readonly quarantined: number;
  readonly maintenance: number;
  readonly dead: number;
  readonly busy: number;
}

/** Returns all the dimensions and dimension possibilities in the fleet. */
export interface BotsDimensions {
  readonly botsDimensions: readonly StringListPair[];
  /** Time at which this summary was calculated. */
  readonly ts: string | undefined;
}

export interface BotEventResponse {
  /** google.protobuf.Timestamp of this event. */
  readonly ts:
    | string
    | undefined;
  /** Type of event. */
  readonly eventType: string;
  /** Message included in the event. */
  readonly message: string;
  /** Bot dimensions at that moment. */
  readonly dimensions: readonly StringListPair[];
  /** Bot state at that moment, encoded as json. */
  readonly state: string;
  /** IP address as seen by the HTTP handler. */
  readonly externalIp: string;
  /** Bot identity as seen by the HTTP handler. */
  readonly authenticatedAs: string;
  /** Version of swarming_bot.zip the bot is currently running. */
  readonly version: string;
  /** If True, the bot is not accepting task due to being quarantined. */
  readonly quarantined: boolean;
  /** If set, the bot is rejecting tasks due to maintenance. */
  readonly maintenanceMsg: string;
  /** Affected by event_type == 'request_task', 'task_completed', 'task_error'. */
  readonly taskId: string;
}

export interface BotEventsResponse {
  readonly cursor: string;
  readonly items: readonly BotEventResponse[];
  readonly now: string | undefined;
}

/** Indicates whether a bot was deleted. */
export interface DeleteResponse {
  readonly deleted: boolean;
}

/** Returns the pseudo taskid to wait for the bot to shut down. */
export interface TerminateResponse {
  readonly taskId: string;
}

export interface BotRequest {
  readonly botId: string;
}

export interface TerminateRequest {
  /** Id of bot to terminate. */
  readonly botId: string;
  /** Reason why the termination was created. */
  readonly reason: string;
}

export interface BotEventsRequest {
  readonly botId: string;
  readonly limit: number;
  readonly cursor: string;
  readonly start: string | undefined;
  readonly end: string | undefined;
}

export interface BotTasksRequest {
  readonly botId: string;
  readonly limit: number;
  readonly cursor: string;
  readonly start: string | undefined;
  readonly end: string | undefined;
  readonly state: StateQuery;
  readonly sort: SortQuery;
  readonly includePerformanceStats: boolean;
}

export interface BotsRequest {
  readonly limit: number;
  readonly cursor: string;
  readonly dimensions: readonly StringPair[];
  readonly quarantined: NullableBool;
  readonly inMaintenance: NullableBool;
  readonly isDead: NullableBool;
  readonly isBusy: NullableBool;
}

export interface BotsCountRequest {
  readonly dimensions: readonly StringPair[];
}

export interface BotsDimensionsRequest {
  readonly pool: string;
}

export interface PermissionsRequest {
  readonly botId: string;
  readonly taskId: string;
  readonly tags: readonly string[];
}

export interface TaskStatesRequest {
  readonly taskId: readonly string[];
}

export interface TasksWithPerfRequest {
  readonly limit: number;
  readonly cursor: string;
  /** These were floats in the legacy protorpc api */
  readonly start: string | undefined;
  readonly end: string | undefined;
  readonly state: StateQuery;
  readonly sort: SortQuery;
  readonly tags: readonly string[];
  readonly includePerformanceStats: boolean;
}

export interface TasksRequest {
  readonly limit: number;
  readonly cursor: string;
  /** These were floats in the legacy protorpc api */
  readonly start: string | undefined;
  readonly end: string | undefined;
  readonly state: StateQuery;
  readonly sort: SortQuery;
  readonly tags: readonly string[];
}

export interface TasksCountRequest {
  readonly start: string | undefined;
  readonly end: string | undefined;
  readonly state: StateQuery;
  readonly tags: readonly string[];
}

export interface TaskIdRequest {
  readonly taskId: string;
}

export interface TaskIdWithOffsetRequest {
  readonly taskId: string;
  readonly offset: string;
  readonly length: string;
}

export interface TaskIdWithPerfRequest {
  readonly taskId: string;
  readonly includePerformanceStats: boolean;
}

export interface TaskQueuesRequest {
  readonly limit: number;
  readonly cursor: string;
}

export interface BatchGetResultRequest {
  /** One or more task IDs (ending with '0'), must have no duplicates. */
  readonly taskIds: readonly string[];
  /** If true, populate `performance_stats` in the output. */
  readonly includePerformanceStats: boolean;
}

export interface BatchGetResultResponse {
  /** Task results or errors, in the same order as `task_ids` in the request. */
  readonly results: readonly BatchGetResultResponse_ResultOrError[];
}

/** Outcome of fetching one task's result. */
export interface BatchGetResultResponse_ResultOrError {
  readonly taskId: string;
  readonly result?: TaskResultResponse | undefined;
  readonly error?: Status | undefined;
}

function createBaseStringPair(): StringPair {
  return { key: "", value: "" };
}

export const StringPair = {
  encode(message: StringPair, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StringPair {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStringPair() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StringPair {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: StringPair): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StringPair>, I>>(base?: I): StringPair {
    return StringPair.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StringPair>, I>>(object: I): StringPair {
    const message = createBaseStringPair() as any;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseStringListPair(): StringListPair {
  return { key: "", value: [] };
}

export const StringListPair = {
  encode(message: StringListPair, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    for (const v of message.value) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StringListPair {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStringListPair() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StringListPair {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: globalThis.Array.isArray(object?.value) ? object.value.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: StringListPair): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value?.length) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StringListPair>, I>>(base?: I): StringListPair {
    return StringListPair.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StringListPair>, I>>(object: I): StringListPair {
    const message = createBaseStringListPair() as any;
    message.key = object.key ?? "";
    message.value = object.value?.map((e) => e) || [];
    return message;
  },
};

function createBaseServerDetails(): ServerDetails {
  return {
    serverVersion: "",
    botVersion: "",
    machineProviderTemplate: "",
    displayServerUrlTemplate: "",
    luciConfig: "",
    casViewerServer: "",
  };
}

export const ServerDetails = {
  encode(message: ServerDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serverVersion !== "") {
      writer.uint32(10).string(message.serverVersion);
    }
    if (message.botVersion !== "") {
      writer.uint32(18).string(message.botVersion);
    }
    if (message.machineProviderTemplate !== "") {
      writer.uint32(26).string(message.machineProviderTemplate);
    }
    if (message.displayServerUrlTemplate !== "") {
      writer.uint32(34).string(message.displayServerUrlTemplate);
    }
    if (message.luciConfig !== "") {
      writer.uint32(42).string(message.luciConfig);
    }
    if (message.casViewerServer !== "") {
      writer.uint32(50).string(message.casViewerServer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerDetails {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerDetails() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.serverVersion = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.botVersion = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.machineProviderTemplate = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.displayServerUrlTemplate = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.luciConfig = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.casViewerServer = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerDetails {
    return {
      serverVersion: isSet(object.serverVersion) ? globalThis.String(object.serverVersion) : "",
      botVersion: isSet(object.botVersion) ? globalThis.String(object.botVersion) : "",
      machineProviderTemplate: isSet(object.machineProviderTemplate)
        ? globalThis.String(object.machineProviderTemplate)
        : "",
      displayServerUrlTemplate: isSet(object.displayServerUrlTemplate)
        ? globalThis.String(object.displayServerUrlTemplate)
        : "",
      luciConfig: isSet(object.luciConfig) ? globalThis.String(object.luciConfig) : "",
      casViewerServer: isSet(object.casViewerServer) ? globalThis.String(object.casViewerServer) : "",
    };
  },

  toJSON(message: ServerDetails): unknown {
    const obj: any = {};
    if (message.serverVersion !== "") {
      obj.serverVersion = message.serverVersion;
    }
    if (message.botVersion !== "") {
      obj.botVersion = message.botVersion;
    }
    if (message.machineProviderTemplate !== "") {
      obj.machineProviderTemplate = message.machineProviderTemplate;
    }
    if (message.displayServerUrlTemplate !== "") {
      obj.displayServerUrlTemplate = message.displayServerUrlTemplate;
    }
    if (message.luciConfig !== "") {
      obj.luciConfig = message.luciConfig;
    }
    if (message.casViewerServer !== "") {
      obj.casViewerServer = message.casViewerServer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServerDetails>, I>>(base?: I): ServerDetails {
    return ServerDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServerDetails>, I>>(object: I): ServerDetails {
    const message = createBaseServerDetails() as any;
    message.serverVersion = object.serverVersion ?? "";
    message.botVersion = object.botVersion ?? "";
    message.machineProviderTemplate = object.machineProviderTemplate ?? "";
    message.displayServerUrlTemplate = object.displayServerUrlTemplate ?? "";
    message.luciConfig = object.luciConfig ?? "";
    message.casViewerServer = object.casViewerServer ?? "";
    return message;
  },
};

function createBaseBootstrapToken(): BootstrapToken {
  return { bootstrapToken: "" };
}

export const BootstrapToken = {
  encode(message: BootstrapToken, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bootstrapToken !== "") {
      writer.uint32(10).string(message.bootstrapToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BootstrapToken {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBootstrapToken() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.bootstrapToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BootstrapToken {
    return { bootstrapToken: isSet(object.bootstrapToken) ? globalThis.String(object.bootstrapToken) : "" };
  },

  toJSON(message: BootstrapToken): unknown {
    const obj: any = {};
    if (message.bootstrapToken !== "") {
      obj.bootstrapToken = message.bootstrapToken;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BootstrapToken>, I>>(base?: I): BootstrapToken {
    return BootstrapToken.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BootstrapToken>, I>>(object: I): BootstrapToken {
    const message = createBaseBootstrapToken() as any;
    message.bootstrapToken = object.bootstrapToken ?? "";
    return message;
  },
};

function createBaseClientPermissions(): ClientPermissions {
  return {
    deleteBot: false,
    deleteBots: false,
    terminateBot: false,
    getConfigs: false,
    putConfigs: false,
    cancelTask: false,
    getBootstrapToken: false,
    cancelTasks: false,
    listBots: [],
    listTasks: [],
  };
}

export const ClientPermissions = {
  encode(message: ClientPermissions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deleteBot === true) {
      writer.uint32(8).bool(message.deleteBot);
    }
    if (message.deleteBots === true) {
      writer.uint32(16).bool(message.deleteBots);
    }
    if (message.terminateBot === true) {
      writer.uint32(24).bool(message.terminateBot);
    }
    if (message.getConfigs === true) {
      writer.uint32(32).bool(message.getConfigs);
    }
    if (message.putConfigs === true) {
      writer.uint32(40).bool(message.putConfigs);
    }
    if (message.cancelTask === true) {
      writer.uint32(48).bool(message.cancelTask);
    }
    if (message.getBootstrapToken === true) {
      writer.uint32(56).bool(message.getBootstrapToken);
    }
    if (message.cancelTasks === true) {
      writer.uint32(64).bool(message.cancelTasks);
    }
    for (const v of message.listBots) {
      writer.uint32(74).string(v!);
    }
    for (const v of message.listTasks) {
      writer.uint32(82).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientPermissions {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClientPermissions() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.deleteBot = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.deleteBots = reader.bool();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.terminateBot = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.getConfigs = reader.bool();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.putConfigs = reader.bool();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.cancelTask = reader.bool();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.getBootstrapToken = reader.bool();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.cancelTasks = reader.bool();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.listBots.push(reader.string());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.listTasks.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ClientPermissions {
    return {
      deleteBot: isSet(object.deleteBot) ? globalThis.Boolean(object.deleteBot) : false,
      deleteBots: isSet(object.deleteBots) ? globalThis.Boolean(object.deleteBots) : false,
      terminateBot: isSet(object.terminateBot) ? globalThis.Boolean(object.terminateBot) : false,
      getConfigs: isSet(object.getConfigs) ? globalThis.Boolean(object.getConfigs) : false,
      putConfigs: isSet(object.putConfigs) ? globalThis.Boolean(object.putConfigs) : false,
      cancelTask: isSet(object.cancelTask) ? globalThis.Boolean(object.cancelTask) : false,
      getBootstrapToken: isSet(object.getBootstrapToken) ? globalThis.Boolean(object.getBootstrapToken) : false,
      cancelTasks: isSet(object.cancelTasks) ? globalThis.Boolean(object.cancelTasks) : false,
      listBots: globalThis.Array.isArray(object?.listBots) ? object.listBots.map((e: any) => globalThis.String(e)) : [],
      listTasks: globalThis.Array.isArray(object?.listTasks)
        ? object.listTasks.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ClientPermissions): unknown {
    const obj: any = {};
    if (message.deleteBot === true) {
      obj.deleteBot = message.deleteBot;
    }
    if (message.deleteBots === true) {
      obj.deleteBots = message.deleteBots;
    }
    if (message.terminateBot === true) {
      obj.terminateBot = message.terminateBot;
    }
    if (message.getConfigs === true) {
      obj.getConfigs = message.getConfigs;
    }
    if (message.putConfigs === true) {
      obj.putConfigs = message.putConfigs;
    }
    if (message.cancelTask === true) {
      obj.cancelTask = message.cancelTask;
    }
    if (message.getBootstrapToken === true) {
      obj.getBootstrapToken = message.getBootstrapToken;
    }
    if (message.cancelTasks === true) {
      obj.cancelTasks = message.cancelTasks;
    }
    if (message.listBots?.length) {
      obj.listBots = message.listBots;
    }
    if (message.listTasks?.length) {
      obj.listTasks = message.listTasks;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClientPermissions>, I>>(base?: I): ClientPermissions {
    return ClientPermissions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClientPermissions>, I>>(object: I): ClientPermissions {
    const message = createBaseClientPermissions() as any;
    message.deleteBot = object.deleteBot ?? false;
    message.deleteBots = object.deleteBots ?? false;
    message.terminateBot = object.terminateBot ?? false;
    message.getConfigs = object.getConfigs ?? false;
    message.putConfigs = object.putConfigs ?? false;
    message.cancelTask = object.cancelTask ?? false;
    message.getBootstrapToken = object.getBootstrapToken ?? false;
    message.cancelTasks = object.cancelTasks ?? false;
    message.listBots = object.listBots?.map((e) => e) || [];
    message.listTasks = object.listTasks?.map((e) => e) || [];
    return message;
  },
};

function createBaseFileContent(): FileContent {
  return { content: "", version: "", who: "", when: undefined };
}

export const FileContent = {
  encode(message: FileContent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.content !== "") {
      writer.uint32(10).string(message.content);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    if (message.who !== "") {
      writer.uint32(26).string(message.who);
    }
    if (message.when !== undefined) {
      Timestamp.encode(toTimestamp(message.when), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileContent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileContent() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.content = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.version = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.who = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.when = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FileContent {
    return {
      content: isSet(object.content) ? globalThis.String(object.content) : "",
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      who: isSet(object.who) ? globalThis.String(object.who) : "",
      when: isSet(object.when) ? globalThis.String(object.when) : undefined,
    };
  },

  toJSON(message: FileContent): unknown {
    const obj: any = {};
    if (message.content !== "") {
      obj.content = message.content;
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.who !== "") {
      obj.who = message.who;
    }
    if (message.when !== undefined) {
      obj.when = message.when;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileContent>, I>>(base?: I): FileContent {
    return FileContent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FileContent>, I>>(object: I): FileContent {
    const message = createBaseFileContent() as any;
    message.content = object.content ?? "";
    message.version = object.version ?? "";
    message.who = object.who ?? "";
    message.when = object.when ?? undefined;
    return message;
  },
};

function createBaseDigest(): Digest {
  return { hash: "", sizeBytes: "0" };
}

export const Digest = {
  encode(message: Digest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.sizeBytes !== "0") {
      writer.uint32(16).int64(message.sizeBytes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Digest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDigest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hash = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.sizeBytes = longToString(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Digest {
    return {
      hash: isSet(object.hash) ? globalThis.String(object.hash) : "",
      sizeBytes: isSet(object.sizeBytes) ? globalThis.String(object.sizeBytes) : "0",
    };
  },

  toJSON(message: Digest): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    if (message.sizeBytes !== "0") {
      obj.sizeBytes = message.sizeBytes;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Digest>, I>>(base?: I): Digest {
    return Digest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Digest>, I>>(object: I): Digest {
    const message = createBaseDigest() as any;
    message.hash = object.hash ?? "";
    message.sizeBytes = object.sizeBytes ?? "0";
    return message;
  },
};

function createBaseCASReference(): CASReference {
  return { casInstance: "", digest: undefined };
}

export const CASReference = {
  encode(message: CASReference, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.casInstance !== "") {
      writer.uint32(10).string(message.casInstance);
    }
    if (message.digest !== undefined) {
      Digest.encode(message.digest, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CASReference {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCASReference() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.casInstance = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.digest = Digest.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CASReference {
    return {
      casInstance: isSet(object.casInstance) ? globalThis.String(object.casInstance) : "",
      digest: isSet(object.digest) ? Digest.fromJSON(object.digest) : undefined,
    };
  },

  toJSON(message: CASReference): unknown {
    const obj: any = {};
    if (message.casInstance !== "") {
      obj.casInstance = message.casInstance;
    }
    if (message.digest !== undefined) {
      obj.digest = Digest.toJSON(message.digest);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CASReference>, I>>(base?: I): CASReference {
    return CASReference.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CASReference>, I>>(object: I): CASReference {
    const message = createBaseCASReference() as any;
    message.casInstance = object.casInstance ?? "";
    message.digest = (object.digest !== undefined && object.digest !== null)
      ? Digest.fromPartial(object.digest)
      : undefined;
    return message;
  },
};

function createBaseCipdPackage(): CipdPackage {
  return { packageName: "", version: "", path: "" };
}

export const CipdPackage = {
  encode(message: CipdPackage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.packageName !== "") {
      writer.uint32(10).string(message.packageName);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    if (message.path !== "") {
      writer.uint32(26).string(message.path);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CipdPackage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCipdPackage() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.packageName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.version = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.path = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CipdPackage {
    return {
      packageName: isSet(object.packageName) ? globalThis.String(object.packageName) : "",
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      path: isSet(object.path) ? globalThis.String(object.path) : "",
    };
  },

  toJSON(message: CipdPackage): unknown {
    const obj: any = {};
    if (message.packageName !== "") {
      obj.packageName = message.packageName;
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.path !== "") {
      obj.path = message.path;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CipdPackage>, I>>(base?: I): CipdPackage {
    return CipdPackage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CipdPackage>, I>>(object: I): CipdPackage {
    const message = createBaseCipdPackage() as any;
    message.packageName = object.packageName ?? "";
    message.version = object.version ?? "";
    message.path = object.path ?? "";
    return message;
  },
};

function createBaseCipdInput(): CipdInput {
  return { server: "", clientPackage: undefined, packages: [] };
}

export const CipdInput = {
  encode(message: CipdInput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.server !== "") {
      writer.uint32(10).string(message.server);
    }
    if (message.clientPackage !== undefined) {
      CipdPackage.encode(message.clientPackage, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.packages) {
      CipdPackage.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CipdInput {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCipdInput() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.server = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.clientPackage = CipdPackage.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.packages.push(CipdPackage.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CipdInput {
    return {
      server: isSet(object.server) ? globalThis.String(object.server) : "",
      clientPackage: isSet(object.clientPackage) ? CipdPackage.fromJSON(object.clientPackage) : undefined,
      packages: globalThis.Array.isArray(object?.packages)
        ? object.packages.map((e: any) => CipdPackage.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CipdInput): unknown {
    const obj: any = {};
    if (message.server !== "") {
      obj.server = message.server;
    }
    if (message.clientPackage !== undefined) {
      obj.clientPackage = CipdPackage.toJSON(message.clientPackage);
    }
    if (message.packages?.length) {
      obj.packages = message.packages.map((e) => CipdPackage.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CipdInput>, I>>(base?: I): CipdInput {
    return CipdInput.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CipdInput>, I>>(object: I): CipdInput {
    const message = createBaseCipdInput() as any;
    message.server = object.server ?? "";
    message.clientPackage = (object.clientPackage !== undefined && object.clientPackage !== null)
      ? CipdPackage.fromPartial(object.clientPackage)
      : undefined;
    message.packages = object.packages?.map((e) => CipdPackage.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCipdPins(): CipdPins {
  return { clientPackage: undefined, packages: [] };
}

export const CipdPins = {
  encode(message: CipdPins, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.clientPackage !== undefined) {
      CipdPackage.encode(message.clientPackage, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.packages) {
      CipdPackage.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CipdPins {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCipdPins() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.clientPackage = CipdPackage.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.packages.push(CipdPackage.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CipdPins {
    return {
      clientPackage: isSet(object.clientPackage) ? CipdPackage.fromJSON(object.clientPackage) : undefined,
      packages: globalThis.Array.isArray(object?.packages)
        ? object.packages.map((e: any) => CipdPackage.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CipdPins): unknown {
    const obj: any = {};
    if (message.clientPackage !== undefined) {
      obj.clientPackage = CipdPackage.toJSON(message.clientPackage);
    }
    if (message.packages?.length) {
      obj.packages = message.packages.map((e) => CipdPackage.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CipdPins>, I>>(base?: I): CipdPins {
    return CipdPins.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CipdPins>, I>>(object: I): CipdPins {
    const message = createBaseCipdPins() as any;
    message.clientPackage = (object.clientPackage !== undefined && object.clientPackage !== null)
      ? CipdPackage.fromPartial(object.clientPackage)
      : undefined;
    message.packages = object.packages?.map((e) => CipdPackage.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCacheEntry(): CacheEntry {
  return { name: "", path: "" };
}

export const CacheEntry = {
  encode(message: CacheEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.path !== "") {
      writer.uint32(18).string(message.path);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CacheEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCacheEntry() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.path = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CacheEntry {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      path: isSet(object.path) ? globalThis.String(object.path) : "",
    };
  },

  toJSON(message: CacheEntry): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.path !== "") {
      obj.path = message.path;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CacheEntry>, I>>(base?: I): CacheEntry {
    return CacheEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CacheEntry>, I>>(object: I): CacheEntry {
    const message = createBaseCacheEntry() as any;
    message.name = object.name ?? "";
    message.path = object.path ?? "";
    return message;
  },
};

function createBaseContainment(): Containment {
  return { containmentType: 0 };
}

export const Containment = {
  encode(message: Containment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.containmentType !== 0) {
      writer.uint32(8).int32(message.containmentType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Containment {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContainment() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.containmentType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Containment {
    return { containmentType: isSet(object.containmentType) ? containmentTypeFromJSON(object.containmentType) : 0 };
  },

  toJSON(message: Containment): unknown {
    const obj: any = {};
    if (message.containmentType !== 0) {
      obj.containmentType = containmentTypeToJSON(message.containmentType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Containment>, I>>(base?: I): Containment {
    return Containment.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Containment>, I>>(object: I): Containment {
    const message = createBaseContainment() as any;
    message.containmentType = object.containmentType ?? 0;
    return message;
  },
};

function createBaseTaskProperties(): TaskProperties {
  return {
    caches: [],
    cipdInput: undefined,
    command: [],
    relativeCwd: "",
    dimensions: [],
    env: [],
    envPrefixes: [],
    executionTimeoutSecs: 0,
    gracePeriodSecs: 0,
    idempotent: false,
    casInputRoot: undefined,
    ioTimeoutSecs: 0,
    outputs: [],
    secretBytes: new Uint8Array(0),
    containment: undefined,
  };
}

export const TaskProperties = {
  encode(message: TaskProperties, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.caches) {
      CacheEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.cipdInput !== undefined) {
      CipdInput.encode(message.cipdInput, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.command) {
      writer.uint32(26).string(v!);
    }
    if (message.relativeCwd !== "") {
      writer.uint32(34).string(message.relativeCwd);
    }
    for (const v of message.dimensions) {
      StringPair.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.env) {
      StringPair.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.envPrefixes) {
      StringListPair.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.executionTimeoutSecs !== 0) {
      writer.uint32(64).int32(message.executionTimeoutSecs);
    }
    if (message.gracePeriodSecs !== 0) {
      writer.uint32(72).int32(message.gracePeriodSecs);
    }
    if (message.idempotent === true) {
      writer.uint32(80).bool(message.idempotent);
    }
    if (message.casInputRoot !== undefined) {
      CASReference.encode(message.casInputRoot, writer.uint32(90).fork()).ldelim();
    }
    if (message.ioTimeoutSecs !== 0) {
      writer.uint32(96).int32(message.ioTimeoutSecs);
    }
    for (const v of message.outputs) {
      writer.uint32(106).string(v!);
    }
    if (message.secretBytes.length !== 0) {
      writer.uint32(114).bytes(message.secretBytes);
    }
    if (message.containment !== undefined) {
      Containment.encode(message.containment, writer.uint32(122).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskProperties {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskProperties() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.caches.push(CacheEntry.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cipdInput = CipdInput.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.command.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.relativeCwd = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.dimensions.push(StringPair.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.env.push(StringPair.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.envPrefixes.push(StringListPair.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.executionTimeoutSecs = reader.int32();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.gracePeriodSecs = reader.int32();
          continue;
        case 10:
          if (tag !== 80) {
            break;
          }

          message.idempotent = reader.bool();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.casInputRoot = CASReference.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.ioTimeoutSecs = reader.int32();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.outputs.push(reader.string());
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.secretBytes = reader.bytes();
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.containment = Containment.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskProperties {
    return {
      caches: globalThis.Array.isArray(object?.caches) ? object.caches.map((e: any) => CacheEntry.fromJSON(e)) : [],
      cipdInput: isSet(object.cipdInput) ? CipdInput.fromJSON(object.cipdInput) : undefined,
      command: globalThis.Array.isArray(object?.command) ? object.command.map((e: any) => globalThis.String(e)) : [],
      relativeCwd: isSet(object.relativeCwd) ? globalThis.String(object.relativeCwd) : "",
      dimensions: globalThis.Array.isArray(object?.dimensions)
        ? object.dimensions.map((e: any) => StringPair.fromJSON(e))
        : [],
      env: globalThis.Array.isArray(object?.env) ? object.env.map((e: any) => StringPair.fromJSON(e)) : [],
      envPrefixes: globalThis.Array.isArray(object?.envPrefixes)
        ? object.envPrefixes.map((e: any) => StringListPair.fromJSON(e))
        : [],
      executionTimeoutSecs: isSet(object.executionTimeoutSecs) ? globalThis.Number(object.executionTimeoutSecs) : 0,
      gracePeriodSecs: isSet(object.gracePeriodSecs) ? globalThis.Number(object.gracePeriodSecs) : 0,
      idempotent: isSet(object.idempotent) ? globalThis.Boolean(object.idempotent) : false,
      casInputRoot: isSet(object.casInputRoot) ? CASReference.fromJSON(object.casInputRoot) : undefined,
      ioTimeoutSecs: isSet(object.ioTimeoutSecs) ? globalThis.Number(object.ioTimeoutSecs) : 0,
      outputs: globalThis.Array.isArray(object?.outputs) ? object.outputs.map((e: any) => globalThis.String(e)) : [],
      secretBytes: isSet(object.secretBytes) ? bytesFromBase64(object.secretBytes) : new Uint8Array(0),
      containment: isSet(object.containment) ? Containment.fromJSON(object.containment) : undefined,
    };
  },

  toJSON(message: TaskProperties): unknown {
    const obj: any = {};
    if (message.caches?.length) {
      obj.caches = message.caches.map((e) => CacheEntry.toJSON(e));
    }
    if (message.cipdInput !== undefined) {
      obj.cipdInput = CipdInput.toJSON(message.cipdInput);
    }
    if (message.command?.length) {
      obj.command = message.command;
    }
    if (message.relativeCwd !== "") {
      obj.relativeCwd = message.relativeCwd;
    }
    if (message.dimensions?.length) {
      obj.dimensions = message.dimensions.map((e) => StringPair.toJSON(e));
    }
    if (message.env?.length) {
      obj.env = message.env.map((e) => StringPair.toJSON(e));
    }
    if (message.envPrefixes?.length) {
      obj.envPrefixes = message.envPrefixes.map((e) => StringListPair.toJSON(e));
    }
    if (message.executionTimeoutSecs !== 0) {
      obj.executionTimeoutSecs = Math.round(message.executionTimeoutSecs);
    }
    if (message.gracePeriodSecs !== 0) {
      obj.gracePeriodSecs = Math.round(message.gracePeriodSecs);
    }
    if (message.idempotent === true) {
      obj.idempotent = message.idempotent;
    }
    if (message.casInputRoot !== undefined) {
      obj.casInputRoot = CASReference.toJSON(message.casInputRoot);
    }
    if (message.ioTimeoutSecs !== 0) {
      obj.ioTimeoutSecs = Math.round(message.ioTimeoutSecs);
    }
    if (message.outputs?.length) {
      obj.outputs = message.outputs;
    }
    if (message.secretBytes.length !== 0) {
      obj.secretBytes = base64FromBytes(message.secretBytes);
    }
    if (message.containment !== undefined) {
      obj.containment = Containment.toJSON(message.containment);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskProperties>, I>>(base?: I): TaskProperties {
    return TaskProperties.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskProperties>, I>>(object: I): TaskProperties {
    const message = createBaseTaskProperties() as any;
    message.caches = object.caches?.map((e) => CacheEntry.fromPartial(e)) || [];
    message.cipdInput = (object.cipdInput !== undefined && object.cipdInput !== null)
      ? CipdInput.fromPartial(object.cipdInput)
      : undefined;
    message.command = object.command?.map((e) => e) || [];
    message.relativeCwd = object.relativeCwd ?? "";
    message.dimensions = object.dimensions?.map((e) => StringPair.fromPartial(e)) || [];
    message.env = object.env?.map((e) => StringPair.fromPartial(e)) || [];
    message.envPrefixes = object.envPrefixes?.map((e) => StringListPair.fromPartial(e)) || [];
    message.executionTimeoutSecs = object.executionTimeoutSecs ?? 0;
    message.gracePeriodSecs = object.gracePeriodSecs ?? 0;
    message.idempotent = object.idempotent ?? false;
    message.casInputRoot = (object.casInputRoot !== undefined && object.casInputRoot !== null)
      ? CASReference.fromPartial(object.casInputRoot)
      : undefined;
    message.ioTimeoutSecs = object.ioTimeoutSecs ?? 0;
    message.outputs = object.outputs?.map((e) => e) || [];
    message.secretBytes = object.secretBytes ?? new Uint8Array(0);
    message.containment = (object.containment !== undefined && object.containment !== null)
      ? Containment.fromPartial(object.containment)
      : undefined;
    return message;
  },
};

function createBaseTaskSlice(): TaskSlice {
  return { properties: undefined, expirationSecs: 0, waitForCapacity: false };
}

export const TaskSlice = {
  encode(message: TaskSlice, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.properties !== undefined) {
      TaskProperties.encode(message.properties, writer.uint32(10).fork()).ldelim();
    }
    if (message.expirationSecs !== 0) {
      writer.uint32(16).int32(message.expirationSecs);
    }
    if (message.waitForCapacity === true) {
      writer.uint32(24).bool(message.waitForCapacity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskSlice {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskSlice() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.properties = TaskProperties.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.expirationSecs = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.waitForCapacity = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskSlice {
    return {
      properties: isSet(object.properties) ? TaskProperties.fromJSON(object.properties) : undefined,
      expirationSecs: isSet(object.expirationSecs) ? globalThis.Number(object.expirationSecs) : 0,
      waitForCapacity: isSet(object.waitForCapacity) ? globalThis.Boolean(object.waitForCapacity) : false,
    };
  },

  toJSON(message: TaskSlice): unknown {
    const obj: any = {};
    if (message.properties !== undefined) {
      obj.properties = TaskProperties.toJSON(message.properties);
    }
    if (message.expirationSecs !== 0) {
      obj.expirationSecs = Math.round(message.expirationSecs);
    }
    if (message.waitForCapacity === true) {
      obj.waitForCapacity = message.waitForCapacity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskSlice>, I>>(base?: I): TaskSlice {
    return TaskSlice.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskSlice>, I>>(object: I): TaskSlice {
    const message = createBaseTaskSlice() as any;
    message.properties = (object.properties !== undefined && object.properties !== null)
      ? TaskProperties.fromPartial(object.properties)
      : undefined;
    message.expirationSecs = object.expirationSecs ?? 0;
    message.waitForCapacity = object.waitForCapacity ?? false;
    return message;
  },
};

function createBaseSwarmingTaskBackendConfig(): SwarmingTaskBackendConfig {
  return {
    priority: 0,
    botPingTolerance: "0",
    parentRunId: "",
    serviceAccount: "",
    waitForCapacity: false,
    agentBinaryCipdPkg: "",
    agentBinaryCipdVers: "",
    agentBinaryCipdFilename: "",
    agentBinaryCipdServer: "",
    tags: [],
  };
}

export const SwarmingTaskBackendConfig = {
  encode(message: SwarmingTaskBackendConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.priority !== 0) {
      writer.uint32(8).int32(message.priority);
    }
    if (message.botPingTolerance !== "0") {
      writer.uint32(16).int64(message.botPingTolerance);
    }
    if (message.parentRunId !== "") {
      writer.uint32(26).string(message.parentRunId);
    }
    if (message.serviceAccount !== "") {
      writer.uint32(34).string(message.serviceAccount);
    }
    if (message.waitForCapacity === true) {
      writer.uint32(40).bool(message.waitForCapacity);
    }
    if (message.agentBinaryCipdPkg !== "") {
      writer.uint32(50).string(message.agentBinaryCipdPkg);
    }
    if (message.agentBinaryCipdVers !== "") {
      writer.uint32(58).string(message.agentBinaryCipdVers);
    }
    if (message.agentBinaryCipdFilename !== "") {
      writer.uint32(66).string(message.agentBinaryCipdFilename);
    }
    if (message.agentBinaryCipdServer !== "") {
      writer.uint32(74).string(message.agentBinaryCipdServer);
    }
    for (const v of message.tags) {
      writer.uint32(82).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SwarmingTaskBackendConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwarmingTaskBackendConfig() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.priority = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.botPingTolerance = longToString(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.parentRunId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.serviceAccount = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.waitForCapacity = reader.bool();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.agentBinaryCipdPkg = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.agentBinaryCipdVers = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.agentBinaryCipdFilename = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.agentBinaryCipdServer = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.tags.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SwarmingTaskBackendConfig {
    return {
      priority: isSet(object.priority) ? globalThis.Number(object.priority) : 0,
      botPingTolerance: isSet(object.botPingTolerance) ? globalThis.String(object.botPingTolerance) : "0",
      parentRunId: isSet(object.parentRunId) ? globalThis.String(object.parentRunId) : "",
      serviceAccount: isSet(object.serviceAccount) ? globalThis.String(object.serviceAccount) : "",
      waitForCapacity: isSet(object.waitForCapacity) ? globalThis.Boolean(object.waitForCapacity) : false,
      agentBinaryCipdPkg: isSet(object.agentBinaryCipdPkg) ? globalThis.String(object.agentBinaryCipdPkg) : "",
      agentBinaryCipdVers: isSet(object.agentBinaryCipdVers) ? globalThis.String(object.agentBinaryCipdVers) : "",
      agentBinaryCipdFilename: isSet(object.agentBinaryCipdFilename)
        ? globalThis.String(object.agentBinaryCipdFilename)
        : "",
      agentBinaryCipdServer: isSet(object.agentBinaryCipdServer) ? globalThis.String(object.agentBinaryCipdServer) : "",
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: SwarmingTaskBackendConfig): unknown {
    const obj: any = {};
    if (message.priority !== 0) {
      obj.priority = Math.round(message.priority);
    }
    if (message.botPingTolerance !== "0") {
      obj.botPingTolerance = message.botPingTolerance;
    }
    if (message.parentRunId !== "") {
      obj.parentRunId = message.parentRunId;
    }
    if (message.serviceAccount !== "") {
      obj.serviceAccount = message.serviceAccount;
    }
    if (message.waitForCapacity === true) {
      obj.waitForCapacity = message.waitForCapacity;
    }
    if (message.agentBinaryCipdPkg !== "") {
      obj.agentBinaryCipdPkg = message.agentBinaryCipdPkg;
    }
    if (message.agentBinaryCipdVers !== "") {
      obj.agentBinaryCipdVers = message.agentBinaryCipdVers;
    }
    if (message.agentBinaryCipdFilename !== "") {
      obj.agentBinaryCipdFilename = message.agentBinaryCipdFilename;
    }
    if (message.agentBinaryCipdServer !== "") {
      obj.agentBinaryCipdServer = message.agentBinaryCipdServer;
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SwarmingTaskBackendConfig>, I>>(base?: I): SwarmingTaskBackendConfig {
    return SwarmingTaskBackendConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SwarmingTaskBackendConfig>, I>>(object: I): SwarmingTaskBackendConfig {
    const message = createBaseSwarmingTaskBackendConfig() as any;
    message.priority = object.priority ?? 0;
    message.botPingTolerance = object.botPingTolerance ?? "0";
    message.parentRunId = object.parentRunId ?? "";
    message.serviceAccount = object.serviceAccount ?? "";
    message.waitForCapacity = object.waitForCapacity ?? false;
    message.agentBinaryCipdPkg = object.agentBinaryCipdPkg ?? "";
    message.agentBinaryCipdVers = object.agentBinaryCipdVers ?? "";
    message.agentBinaryCipdFilename = object.agentBinaryCipdFilename ?? "";
    message.agentBinaryCipdServer = object.agentBinaryCipdServer ?? "";
    message.tags = object.tags?.map((e) => e) || [];
    return message;
  },
};

function createBaseResultDBCfg(): ResultDBCfg {
  return { enable: false };
}

export const ResultDBCfg = {
  encode(message: ResultDBCfg, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.enable === true) {
      writer.uint32(8).bool(message.enable);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResultDBCfg {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResultDBCfg() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.enable = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ResultDBCfg {
    return { enable: isSet(object.enable) ? globalThis.Boolean(object.enable) : false };
  },

  toJSON(message: ResultDBCfg): unknown {
    const obj: any = {};
    if (message.enable === true) {
      obj.enable = message.enable;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResultDBCfg>, I>>(base?: I): ResultDBCfg {
    return ResultDBCfg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ResultDBCfg>, I>>(object: I): ResultDBCfg {
    const message = createBaseResultDBCfg() as any;
    message.enable = object.enable ?? false;
    return message;
  },
};

function createBaseNewTaskRequest(): NewTaskRequest {
  return {
    expirationSecs: 0,
    name: "",
    parentTaskId: "",
    priority: 0,
    properties: undefined,
    taskSlices: [],
    tags: [],
    user: "",
    serviceAccount: "",
    pubsubTopic: "",
    pubsubAuthToken: "",
    pubsubUserdata: "",
    evaluateOnly: false,
    poolTaskTemplate: 0,
    botPingToleranceSecs: 0,
    requestUuid: "",
    resultdb: undefined,
    realm: "",
  };
}

export const NewTaskRequest = {
  encode(message: NewTaskRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.expirationSecs !== 0) {
      writer.uint32(8).int32(message.expirationSecs);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.parentTaskId !== "") {
      writer.uint32(26).string(message.parentTaskId);
    }
    if (message.priority !== 0) {
      writer.uint32(32).int32(message.priority);
    }
    if (message.properties !== undefined) {
      TaskProperties.encode(message.properties, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.taskSlices) {
      TaskSlice.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.tags) {
      writer.uint32(58).string(v!);
    }
    if (message.user !== "") {
      writer.uint32(66).string(message.user);
    }
    if (message.serviceAccount !== "") {
      writer.uint32(74).string(message.serviceAccount);
    }
    if (message.pubsubTopic !== "") {
      writer.uint32(82).string(message.pubsubTopic);
    }
    if (message.pubsubAuthToken !== "") {
      writer.uint32(90).string(message.pubsubAuthToken);
    }
    if (message.pubsubUserdata !== "") {
      writer.uint32(98).string(message.pubsubUserdata);
    }
    if (message.evaluateOnly === true) {
      writer.uint32(104).bool(message.evaluateOnly);
    }
    if (message.poolTaskTemplate !== 0) {
      writer.uint32(112).int32(message.poolTaskTemplate);
    }
    if (message.botPingToleranceSecs !== 0) {
      writer.uint32(120).int32(message.botPingToleranceSecs);
    }
    if (message.requestUuid !== "") {
      writer.uint32(130).string(message.requestUuid);
    }
    if (message.resultdb !== undefined) {
      ResultDBCfg.encode(message.resultdb, writer.uint32(138).fork()).ldelim();
    }
    if (message.realm !== "") {
      writer.uint32(146).string(message.realm);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NewTaskRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNewTaskRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.expirationSecs = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.parentTaskId = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.priority = reader.int32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.properties = TaskProperties.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.taskSlices.push(TaskSlice.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.tags.push(reader.string());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.user = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.serviceAccount = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.pubsubTopic = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.pubsubAuthToken = reader.string();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.pubsubUserdata = reader.string();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.evaluateOnly = reader.bool();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.poolTaskTemplate = reader.int32() as any;
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.botPingToleranceSecs = reader.int32();
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.requestUuid = reader.string();
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.resultdb = ResultDBCfg.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.realm = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): NewTaskRequest {
    return {
      expirationSecs: isSet(object.expirationSecs) ? globalThis.Number(object.expirationSecs) : 0,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      parentTaskId: isSet(object.parentTaskId) ? globalThis.String(object.parentTaskId) : "",
      priority: isSet(object.priority) ? globalThis.Number(object.priority) : 0,
      properties: isSet(object.properties) ? TaskProperties.fromJSON(object.properties) : undefined,
      taskSlices: globalThis.Array.isArray(object?.taskSlices)
        ? object.taskSlices.map((e: any) => TaskSlice.fromJSON(e))
        : [],
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      serviceAccount: isSet(object.serviceAccount) ? globalThis.String(object.serviceAccount) : "",
      pubsubTopic: isSet(object.pubsubTopic) ? globalThis.String(object.pubsubTopic) : "",
      pubsubAuthToken: isSet(object.pubsubAuthToken) ? globalThis.String(object.pubsubAuthToken) : "",
      pubsubUserdata: isSet(object.pubsubUserdata) ? globalThis.String(object.pubsubUserdata) : "",
      evaluateOnly: isSet(object.evaluateOnly) ? globalThis.Boolean(object.evaluateOnly) : false,
      poolTaskTemplate: isSet(object.poolTaskTemplate)
        ? newTaskRequest_PoolTaskTemplateFieldFromJSON(object.poolTaskTemplate)
        : 0,
      botPingToleranceSecs: isSet(object.botPingToleranceSecs) ? globalThis.Number(object.botPingToleranceSecs) : 0,
      requestUuid: isSet(object.requestUuid) ? globalThis.String(object.requestUuid) : "",
      resultdb: isSet(object.resultdb) ? ResultDBCfg.fromJSON(object.resultdb) : undefined,
      realm: isSet(object.realm) ? globalThis.String(object.realm) : "",
    };
  },

  toJSON(message: NewTaskRequest): unknown {
    const obj: any = {};
    if (message.expirationSecs !== 0) {
      obj.expirationSecs = Math.round(message.expirationSecs);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.parentTaskId !== "") {
      obj.parentTaskId = message.parentTaskId;
    }
    if (message.priority !== 0) {
      obj.priority = Math.round(message.priority);
    }
    if (message.properties !== undefined) {
      obj.properties = TaskProperties.toJSON(message.properties);
    }
    if (message.taskSlices?.length) {
      obj.taskSlices = message.taskSlices.map((e) => TaskSlice.toJSON(e));
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.serviceAccount !== "") {
      obj.serviceAccount = message.serviceAccount;
    }
    if (message.pubsubTopic !== "") {
      obj.pubsubTopic = message.pubsubTopic;
    }
    if (message.pubsubAuthToken !== "") {
      obj.pubsubAuthToken = message.pubsubAuthToken;
    }
    if (message.pubsubUserdata !== "") {
      obj.pubsubUserdata = message.pubsubUserdata;
    }
    if (message.evaluateOnly === true) {
      obj.evaluateOnly = message.evaluateOnly;
    }
    if (message.poolTaskTemplate !== 0) {
      obj.poolTaskTemplate = newTaskRequest_PoolTaskTemplateFieldToJSON(message.poolTaskTemplate);
    }
    if (message.botPingToleranceSecs !== 0) {
      obj.botPingToleranceSecs = Math.round(message.botPingToleranceSecs);
    }
    if (message.requestUuid !== "") {
      obj.requestUuid = message.requestUuid;
    }
    if (message.resultdb !== undefined) {
      obj.resultdb = ResultDBCfg.toJSON(message.resultdb);
    }
    if (message.realm !== "") {
      obj.realm = message.realm;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NewTaskRequest>, I>>(base?: I): NewTaskRequest {
    return NewTaskRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NewTaskRequest>, I>>(object: I): NewTaskRequest {
    const message = createBaseNewTaskRequest() as any;
    message.expirationSecs = object.expirationSecs ?? 0;
    message.name = object.name ?? "";
    message.parentTaskId = object.parentTaskId ?? "";
    message.priority = object.priority ?? 0;
    message.properties = (object.properties !== undefined && object.properties !== null)
      ? TaskProperties.fromPartial(object.properties)
      : undefined;
    message.taskSlices = object.taskSlices?.map((e) => TaskSlice.fromPartial(e)) || [];
    message.tags = object.tags?.map((e) => e) || [];
    message.user = object.user ?? "";
    message.serviceAccount = object.serviceAccount ?? "";
    message.pubsubTopic = object.pubsubTopic ?? "";
    message.pubsubAuthToken = object.pubsubAuthToken ?? "";
    message.pubsubUserdata = object.pubsubUserdata ?? "";
    message.evaluateOnly = object.evaluateOnly ?? false;
    message.poolTaskTemplate = object.poolTaskTemplate ?? 0;
    message.botPingToleranceSecs = object.botPingToleranceSecs ?? 0;
    message.requestUuid = object.requestUuid ?? "";
    message.resultdb = (object.resultdb !== undefined && object.resultdb !== null)
      ? ResultDBCfg.fromPartial(object.resultdb)
      : undefined;
    message.realm = object.realm ?? "";
    return message;
  },
};

function createBaseTaskRequestResponse(): TaskRequestResponse {
  return {
    taskId: "",
    expirationSecs: 0,
    name: "",
    parentTaskId: "",
    priority: 0,
    properties: undefined,
    tags: [],
    createdTs: undefined,
    user: "",
    authenticated: "",
    taskSlices: [],
    serviceAccount: "",
    realm: "",
    resultdb: undefined,
    pubsubTopic: "",
    pubsubUserdata: "",
    botPingToleranceSecs: 0,
    rbeInstance: "",
  };
}

export const TaskRequestResponse = {
  encode(message: TaskRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    if (message.expirationSecs !== 0) {
      writer.uint32(16).int32(message.expirationSecs);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.parentTaskId !== "") {
      writer.uint32(34).string(message.parentTaskId);
    }
    if (message.priority !== 0) {
      writer.uint32(40).int32(message.priority);
    }
    if (message.properties !== undefined) {
      TaskProperties.encode(message.properties, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.tags) {
      writer.uint32(58).string(v!);
    }
    if (message.createdTs !== undefined) {
      Timestamp.encode(toTimestamp(message.createdTs), writer.uint32(66).fork()).ldelim();
    }
    if (message.user !== "") {
      writer.uint32(74).string(message.user);
    }
    if (message.authenticated !== "") {
      writer.uint32(82).string(message.authenticated);
    }
    for (const v of message.taskSlices) {
      TaskSlice.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    if (message.serviceAccount !== "") {
      writer.uint32(98).string(message.serviceAccount);
    }
    if (message.realm !== "") {
      writer.uint32(106).string(message.realm);
    }
    if (message.resultdb !== undefined) {
      ResultDBCfg.encode(message.resultdb, writer.uint32(114).fork()).ldelim();
    }
    if (message.pubsubTopic !== "") {
      writer.uint32(122).string(message.pubsubTopic);
    }
    if (message.pubsubUserdata !== "") {
      writer.uint32(130).string(message.pubsubUserdata);
    }
    if (message.botPingToleranceSecs !== 0) {
      writer.uint32(136).int32(message.botPingToleranceSecs);
    }
    if (message.rbeInstance !== "") {
      writer.uint32(146).string(message.rbeInstance);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskRequestResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskRequestResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.expirationSecs = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.parentTaskId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.priority = reader.int32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.properties = TaskProperties.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.tags.push(reader.string());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.createdTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.user = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.authenticated = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.taskSlices.push(TaskSlice.decode(reader, reader.uint32()));
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.serviceAccount = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.realm = reader.string();
          continue;
        case 14:
          if (tag !== 114) {
            break;
          }

          message.resultdb = ResultDBCfg.decode(reader, reader.uint32());
          continue;
        case 15:
          if (tag !== 122) {
            break;
          }

          message.pubsubTopic = reader.string();
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.pubsubUserdata = reader.string();
          continue;
        case 17:
          if (tag !== 136) {
            break;
          }

          message.botPingToleranceSecs = reader.int32();
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.rbeInstance = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskRequestResponse {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      expirationSecs: isSet(object.expirationSecs) ? globalThis.Number(object.expirationSecs) : 0,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      parentTaskId: isSet(object.parentTaskId) ? globalThis.String(object.parentTaskId) : "",
      priority: isSet(object.priority) ? globalThis.Number(object.priority) : 0,
      properties: isSet(object.properties) ? TaskProperties.fromJSON(object.properties) : undefined,
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
      createdTs: isSet(object.createdTs) ? globalThis.String(object.createdTs) : undefined,
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      authenticated: isSet(object.authenticated) ? globalThis.String(object.authenticated) : "",
      taskSlices: globalThis.Array.isArray(object?.taskSlices)
        ? object.taskSlices.map((e: any) => TaskSlice.fromJSON(e))
        : [],
      serviceAccount: isSet(object.serviceAccount) ? globalThis.String(object.serviceAccount) : "",
      realm: isSet(object.realm) ? globalThis.String(object.realm) : "",
      resultdb: isSet(object.resultdb) ? ResultDBCfg.fromJSON(object.resultdb) : undefined,
      pubsubTopic: isSet(object.pubsubTopic) ? globalThis.String(object.pubsubTopic) : "",
      pubsubUserdata: isSet(object.pubsubUserdata) ? globalThis.String(object.pubsubUserdata) : "",
      botPingToleranceSecs: isSet(object.botPingToleranceSecs) ? globalThis.Number(object.botPingToleranceSecs) : 0,
      rbeInstance: isSet(object.rbeInstance) ? globalThis.String(object.rbeInstance) : "",
    };
  },

  toJSON(message: TaskRequestResponse): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.expirationSecs !== 0) {
      obj.expirationSecs = Math.round(message.expirationSecs);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.parentTaskId !== "") {
      obj.parentTaskId = message.parentTaskId;
    }
    if (message.priority !== 0) {
      obj.priority = Math.round(message.priority);
    }
    if (message.properties !== undefined) {
      obj.properties = TaskProperties.toJSON(message.properties);
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    if (message.createdTs !== undefined) {
      obj.createdTs = message.createdTs;
    }
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.authenticated !== "") {
      obj.authenticated = message.authenticated;
    }
    if (message.taskSlices?.length) {
      obj.taskSlices = message.taskSlices.map((e) => TaskSlice.toJSON(e));
    }
    if (message.serviceAccount !== "") {
      obj.serviceAccount = message.serviceAccount;
    }
    if (message.realm !== "") {
      obj.realm = message.realm;
    }
    if (message.resultdb !== undefined) {
      obj.resultdb = ResultDBCfg.toJSON(message.resultdb);
    }
    if (message.pubsubTopic !== "") {
      obj.pubsubTopic = message.pubsubTopic;
    }
    if (message.pubsubUserdata !== "") {
      obj.pubsubUserdata = message.pubsubUserdata;
    }
    if (message.botPingToleranceSecs !== 0) {
      obj.botPingToleranceSecs = Math.round(message.botPingToleranceSecs);
    }
    if (message.rbeInstance !== "") {
      obj.rbeInstance = message.rbeInstance;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskRequestResponse>, I>>(base?: I): TaskRequestResponse {
    return TaskRequestResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskRequestResponse>, I>>(object: I): TaskRequestResponse {
    const message = createBaseTaskRequestResponse() as any;
    message.taskId = object.taskId ?? "";
    message.expirationSecs = object.expirationSecs ?? 0;
    message.name = object.name ?? "";
    message.parentTaskId = object.parentTaskId ?? "";
    message.priority = object.priority ?? 0;
    message.properties = (object.properties !== undefined && object.properties !== null)
      ? TaskProperties.fromPartial(object.properties)
      : undefined;
    message.tags = object.tags?.map((e) => e) || [];
    message.createdTs = object.createdTs ?? undefined;
    message.user = object.user ?? "";
    message.authenticated = object.authenticated ?? "";
    message.taskSlices = object.taskSlices?.map((e) => TaskSlice.fromPartial(e)) || [];
    message.serviceAccount = object.serviceAccount ?? "";
    message.realm = object.realm ?? "";
    message.resultdb = (object.resultdb !== undefined && object.resultdb !== null)
      ? ResultDBCfg.fromPartial(object.resultdb)
      : undefined;
    message.pubsubTopic = object.pubsubTopic ?? "";
    message.pubsubUserdata = object.pubsubUserdata ?? "";
    message.botPingToleranceSecs = object.botPingToleranceSecs ?? 0;
    message.rbeInstance = object.rbeInstance ?? "";
    return message;
  },
};

function createBaseTaskCancelRequest(): TaskCancelRequest {
  return { taskId: "", killRunning: false };
}

export const TaskCancelRequest = {
  encode(message: TaskCancelRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    if (message.killRunning === true) {
      writer.uint32(16).bool(message.killRunning);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskCancelRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskCancelRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.killRunning = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskCancelRequest {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      killRunning: isSet(object.killRunning) ? globalThis.Boolean(object.killRunning) : false,
    };
  },

  toJSON(message: TaskCancelRequest): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.killRunning === true) {
      obj.killRunning = message.killRunning;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskCancelRequest>, I>>(base?: I): TaskCancelRequest {
    return TaskCancelRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskCancelRequest>, I>>(object: I): TaskCancelRequest {
    const message = createBaseTaskCancelRequest() as any;
    message.taskId = object.taskId ?? "";
    message.killRunning = object.killRunning ?? false;
    return message;
  },
};

function createBaseTasksCancelRequest(): TasksCancelRequest {
  return { limit: 0, cursor: "", tags: [], killRunning: false, start: undefined, end: undefined };
}

export const TasksCancelRequest = {
  encode(message: TasksCancelRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(18).string(message.cursor);
    }
    for (const v of message.tags) {
      writer.uint32(26).string(v!);
    }
    if (message.killRunning === true) {
      writer.uint32(32).bool(message.killRunning);
    }
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(42).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TasksCancelRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTasksCancelRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tags.push(reader.string());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.killRunning = reader.bool();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TasksCancelRequest {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
      killRunning: isSet(object.killRunning) ? globalThis.Boolean(object.killRunning) : false,
      start: isSet(object.start) ? globalThis.String(object.start) : undefined,
      end: isSet(object.end) ? globalThis.String(object.end) : undefined,
    };
  },

  toJSON(message: TasksCancelRequest): unknown {
    const obj: any = {};
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    if (message.killRunning === true) {
      obj.killRunning = message.killRunning;
    }
    if (message.start !== undefined) {
      obj.start = message.start;
    }
    if (message.end !== undefined) {
      obj.end = message.end;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TasksCancelRequest>, I>>(base?: I): TasksCancelRequest {
    return TasksCancelRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TasksCancelRequest>, I>>(object: I): TasksCancelRequest {
    const message = createBaseTasksCancelRequest() as any;
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    message.tags = object.tags?.map((e) => e) || [];
    message.killRunning = object.killRunning ?? false;
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    return message;
  },
};

function createBaseOperationStats(): OperationStats {
  return { duration: 0 };
}

export const OperationStats = {
  encode(message: OperationStats, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.duration !== 0) {
      writer.uint32(13).float(message.duration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OperationStats {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOperationStats() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.duration = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OperationStats {
    return { duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0 };
  },

  toJSON(message: OperationStats): unknown {
    const obj: any = {};
    if (message.duration !== 0) {
      obj.duration = message.duration;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<OperationStats>, I>>(base?: I): OperationStats {
    return OperationStats.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OperationStats>, I>>(object: I): OperationStats {
    const message = createBaseOperationStats() as any;
    message.duration = object.duration ?? 0;
    return message;
  },
};

function createBaseCASOperationStats(): CASOperationStats {
  return {
    duration: 0,
    initialNumberItems: 0,
    initialSize: "0",
    itemsCold: new Uint8Array(0),
    itemsHot: new Uint8Array(0),
    numItemsCold: "0",
    totalBytesItemsCold: "0",
    numItemsHot: "0",
    totalBytesItemsHot: "0",
  };
}

export const CASOperationStats = {
  encode(message: CASOperationStats, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.duration !== 0) {
      writer.uint32(13).float(message.duration);
    }
    if (message.initialNumberItems !== 0) {
      writer.uint32(16).int32(message.initialNumberItems);
    }
    if (message.initialSize !== "0") {
      writer.uint32(24).int64(message.initialSize);
    }
    if (message.itemsCold.length !== 0) {
      writer.uint32(34).bytes(message.itemsCold);
    }
    if (message.itemsHot.length !== 0) {
      writer.uint32(42).bytes(message.itemsHot);
    }
    if (message.numItemsCold !== "0") {
      writer.uint32(48).int64(message.numItemsCold);
    }
    if (message.totalBytesItemsCold !== "0") {
      writer.uint32(56).int64(message.totalBytesItemsCold);
    }
    if (message.numItemsHot !== "0") {
      writer.uint32(64).int64(message.numItemsHot);
    }
    if (message.totalBytesItemsHot !== "0") {
      writer.uint32(72).int64(message.totalBytesItemsHot);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CASOperationStats {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCASOperationStats() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.duration = reader.float();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.initialNumberItems = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.initialSize = longToString(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.itemsCold = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.itemsHot = reader.bytes();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.numItemsCold = longToString(reader.int64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.totalBytesItemsCold = longToString(reader.int64() as Long);
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.numItemsHot = longToString(reader.int64() as Long);
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.totalBytesItemsHot = longToString(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CASOperationStats {
    return {
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      initialNumberItems: isSet(object.initialNumberItems) ? globalThis.Number(object.initialNumberItems) : 0,
      initialSize: isSet(object.initialSize) ? globalThis.String(object.initialSize) : "0",
      itemsCold: isSet(object.itemsCold) ? bytesFromBase64(object.itemsCold) : new Uint8Array(0),
      itemsHot: isSet(object.itemsHot) ? bytesFromBase64(object.itemsHot) : new Uint8Array(0),
      numItemsCold: isSet(object.numItemsCold) ? globalThis.String(object.numItemsCold) : "0",
      totalBytesItemsCold: isSet(object.totalBytesItemsCold) ? globalThis.String(object.totalBytesItemsCold) : "0",
      numItemsHot: isSet(object.numItemsHot) ? globalThis.String(object.numItemsHot) : "0",
      totalBytesItemsHot: isSet(object.totalBytesItemsHot) ? globalThis.String(object.totalBytesItemsHot) : "0",
    };
  },

  toJSON(message: CASOperationStats): unknown {
    const obj: any = {};
    if (message.duration !== 0) {
      obj.duration = message.duration;
    }
    if (message.initialNumberItems !== 0) {
      obj.initialNumberItems = Math.round(message.initialNumberItems);
    }
    if (message.initialSize !== "0") {
      obj.initialSize = message.initialSize;
    }
    if (message.itemsCold.length !== 0) {
      obj.itemsCold = base64FromBytes(message.itemsCold);
    }
    if (message.itemsHot.length !== 0) {
      obj.itemsHot = base64FromBytes(message.itemsHot);
    }
    if (message.numItemsCold !== "0") {
      obj.numItemsCold = message.numItemsCold;
    }
    if (message.totalBytesItemsCold !== "0") {
      obj.totalBytesItemsCold = message.totalBytesItemsCold;
    }
    if (message.numItemsHot !== "0") {
      obj.numItemsHot = message.numItemsHot;
    }
    if (message.totalBytesItemsHot !== "0") {
      obj.totalBytesItemsHot = message.totalBytesItemsHot;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CASOperationStats>, I>>(base?: I): CASOperationStats {
    return CASOperationStats.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CASOperationStats>, I>>(object: I): CASOperationStats {
    const message = createBaseCASOperationStats() as any;
    message.duration = object.duration ?? 0;
    message.initialNumberItems = object.initialNumberItems ?? 0;
    message.initialSize = object.initialSize ?? "0";
    message.itemsCold = object.itemsCold ?? new Uint8Array(0);
    message.itemsHot = object.itemsHot ?? new Uint8Array(0);
    message.numItemsCold = object.numItemsCold ?? "0";
    message.totalBytesItemsCold = object.totalBytesItemsCold ?? "0";
    message.numItemsHot = object.numItemsHot ?? "0";
    message.totalBytesItemsHot = object.totalBytesItemsHot ?? "0";
    return message;
  },
};

function createBasePerformanceStats(): PerformanceStats {
  return {
    botOverhead: 0,
    isolatedDownload: undefined,
    isolatedUpload: undefined,
    packageInstallation: undefined,
    cacheTrim: undefined,
    namedCachesInstall: undefined,
    namedCachesUninstall: undefined,
    cleanup: undefined,
  };
}

export const PerformanceStats = {
  encode(message: PerformanceStats, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botOverhead !== 0) {
      writer.uint32(13).float(message.botOverhead);
    }
    if (message.isolatedDownload !== undefined) {
      CASOperationStats.encode(message.isolatedDownload, writer.uint32(18).fork()).ldelim();
    }
    if (message.isolatedUpload !== undefined) {
      CASOperationStats.encode(message.isolatedUpload, writer.uint32(26).fork()).ldelim();
    }
    if (message.packageInstallation !== undefined) {
      OperationStats.encode(message.packageInstallation, writer.uint32(34).fork()).ldelim();
    }
    if (message.cacheTrim !== undefined) {
      OperationStats.encode(message.cacheTrim, writer.uint32(42).fork()).ldelim();
    }
    if (message.namedCachesInstall !== undefined) {
      OperationStats.encode(message.namedCachesInstall, writer.uint32(50).fork()).ldelim();
    }
    if (message.namedCachesUninstall !== undefined) {
      OperationStats.encode(message.namedCachesUninstall, writer.uint32(58).fork()).ldelim();
    }
    if (message.cleanup !== undefined) {
      OperationStats.encode(message.cleanup, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PerformanceStats {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePerformanceStats() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.botOverhead = reader.float();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.isolatedDownload = CASOperationStats.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.isolatedUpload = CASOperationStats.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.packageInstallation = OperationStats.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.cacheTrim = OperationStats.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.namedCachesInstall = OperationStats.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.namedCachesUninstall = OperationStats.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.cleanup = OperationStats.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PerformanceStats {
    return {
      botOverhead: isSet(object.botOverhead) ? globalThis.Number(object.botOverhead) : 0,
      isolatedDownload: isSet(object.isolatedDownload)
        ? CASOperationStats.fromJSON(object.isolatedDownload)
        : undefined,
      isolatedUpload: isSet(object.isolatedUpload) ? CASOperationStats.fromJSON(object.isolatedUpload) : undefined,
      packageInstallation: isSet(object.packageInstallation)
        ? OperationStats.fromJSON(object.packageInstallation)
        : undefined,
      cacheTrim: isSet(object.cacheTrim) ? OperationStats.fromJSON(object.cacheTrim) : undefined,
      namedCachesInstall: isSet(object.namedCachesInstall)
        ? OperationStats.fromJSON(object.namedCachesInstall)
        : undefined,
      namedCachesUninstall: isSet(object.namedCachesUninstall)
        ? OperationStats.fromJSON(object.namedCachesUninstall)
        : undefined,
      cleanup: isSet(object.cleanup) ? OperationStats.fromJSON(object.cleanup) : undefined,
    };
  },

  toJSON(message: PerformanceStats): unknown {
    const obj: any = {};
    if (message.botOverhead !== 0) {
      obj.botOverhead = message.botOverhead;
    }
    if (message.isolatedDownload !== undefined) {
      obj.isolatedDownload = CASOperationStats.toJSON(message.isolatedDownload);
    }
    if (message.isolatedUpload !== undefined) {
      obj.isolatedUpload = CASOperationStats.toJSON(message.isolatedUpload);
    }
    if (message.packageInstallation !== undefined) {
      obj.packageInstallation = OperationStats.toJSON(message.packageInstallation);
    }
    if (message.cacheTrim !== undefined) {
      obj.cacheTrim = OperationStats.toJSON(message.cacheTrim);
    }
    if (message.namedCachesInstall !== undefined) {
      obj.namedCachesInstall = OperationStats.toJSON(message.namedCachesInstall);
    }
    if (message.namedCachesUninstall !== undefined) {
      obj.namedCachesUninstall = OperationStats.toJSON(message.namedCachesUninstall);
    }
    if (message.cleanup !== undefined) {
      obj.cleanup = OperationStats.toJSON(message.cleanup);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PerformanceStats>, I>>(base?: I): PerformanceStats {
    return PerformanceStats.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PerformanceStats>, I>>(object: I): PerformanceStats {
    const message = createBasePerformanceStats() as any;
    message.botOverhead = object.botOverhead ?? 0;
    message.isolatedDownload = (object.isolatedDownload !== undefined && object.isolatedDownload !== null)
      ? CASOperationStats.fromPartial(object.isolatedDownload)
      : undefined;
    message.isolatedUpload = (object.isolatedUpload !== undefined && object.isolatedUpload !== null)
      ? CASOperationStats.fromPartial(object.isolatedUpload)
      : undefined;
    message.packageInstallation = (object.packageInstallation !== undefined && object.packageInstallation !== null)
      ? OperationStats.fromPartial(object.packageInstallation)
      : undefined;
    message.cacheTrim = (object.cacheTrim !== undefined && object.cacheTrim !== null)
      ? OperationStats.fromPartial(object.cacheTrim)
      : undefined;
    message.namedCachesInstall = (object.namedCachesInstall !== undefined && object.namedCachesInstall !== null)
      ? OperationStats.fromPartial(object.namedCachesInstall)
      : undefined;
    message.namedCachesUninstall = (object.namedCachesUninstall !== undefined && object.namedCachesUninstall !== null)
      ? OperationStats.fromPartial(object.namedCachesUninstall)
      : undefined;
    message.cleanup = (object.cleanup !== undefined && object.cleanup !== null)
      ? OperationStats.fromPartial(object.cleanup)
      : undefined;
    return message;
  },
};

function createBaseCancelResponse(): CancelResponse {
  return { canceled: false, wasRunning: false };
}

export const CancelResponse = {
  encode(message: CancelResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.canceled === true) {
      writer.uint32(8).bool(message.canceled);
    }
    if (message.wasRunning === true) {
      writer.uint32(16).bool(message.wasRunning);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.canceled = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.wasRunning = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CancelResponse {
    return {
      canceled: isSet(object.canceled) ? globalThis.Boolean(object.canceled) : false,
      wasRunning: isSet(object.wasRunning) ? globalThis.Boolean(object.wasRunning) : false,
    };
  },

  toJSON(message: CancelResponse): unknown {
    const obj: any = {};
    if (message.canceled === true) {
      obj.canceled = message.canceled;
    }
    if (message.wasRunning === true) {
      obj.wasRunning = message.wasRunning;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CancelResponse>, I>>(base?: I): CancelResponse {
    return CancelResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CancelResponse>, I>>(object: I): CancelResponse {
    const message = createBaseCancelResponse() as any;
    message.canceled = object.canceled ?? false;
    message.wasRunning = object.wasRunning ?? false;
    return message;
  },
};

function createBaseTasksCancelResponse(): TasksCancelResponse {
  return { cursor: "", now: undefined, matched: 0 };
}

export const TasksCancelResponse = {
  encode(message: TasksCancelResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== "") {
      writer.uint32(10).string(message.cursor);
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(18).fork()).ldelim();
    }
    if (message.matched !== 0) {
      writer.uint32(24).int32(message.matched);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TasksCancelResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTasksCancelResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.matched = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TasksCancelResponse {
    return {
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
      matched: isSet(object.matched) ? globalThis.Number(object.matched) : 0,
    };
  },

  toJSON(message: TasksCancelResponse): unknown {
    const obj: any = {};
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    if (message.matched !== 0) {
      obj.matched = Math.round(message.matched);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TasksCancelResponse>, I>>(base?: I): TasksCancelResponse {
    return TasksCancelResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TasksCancelResponse>, I>>(object: I): TasksCancelResponse {
    const message = createBaseTasksCancelResponse() as any;
    message.cursor = object.cursor ?? "";
    message.now = object.now ?? undefined;
    message.matched = object.matched ?? 0;
    return message;
  },
};

function createBaseTaskOutputResponse(): TaskOutputResponse {
  return { output: new Uint8Array(0), state: 0 };
}

export const TaskOutputResponse = {
  encode(message: TaskOutputResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.output.length !== 0) {
      writer.uint32(10).bytes(message.output);
    }
    if (message.state !== 0) {
      writer.uint32(16).int32(message.state);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskOutputResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskOutputResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.output = reader.bytes();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskOutputResponse {
    return {
      output: isSet(object.output) ? bytesFromBase64(object.output) : new Uint8Array(0),
      state: isSet(object.state) ? taskStateFromJSON(object.state) : 0,
    };
  },

  toJSON(message: TaskOutputResponse): unknown {
    const obj: any = {};
    if (message.output.length !== 0) {
      obj.output = base64FromBytes(message.output);
    }
    if (message.state !== 0) {
      obj.state = taskStateToJSON(message.state);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskOutputResponse>, I>>(base?: I): TaskOutputResponse {
    return TaskOutputResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskOutputResponse>, I>>(object: I): TaskOutputResponse {
    const message = createBaseTaskOutputResponse() as any;
    message.output = object.output ?? new Uint8Array(0);
    message.state = object.state ?? 0;
    return message;
  },
};

function createBaseResultDBInfo(): ResultDBInfo {
  return { hostname: "", invocation: "" };
}

export const ResultDBInfo = {
  encode(message: ResultDBInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hostname !== "") {
      writer.uint32(10).string(message.hostname);
    }
    if (message.invocation !== "") {
      writer.uint32(18).string(message.invocation);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResultDBInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResultDBInfo() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.hostname = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.invocation = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ResultDBInfo {
    return {
      hostname: isSet(object.hostname) ? globalThis.String(object.hostname) : "",
      invocation: isSet(object.invocation) ? globalThis.String(object.invocation) : "",
    };
  },

  toJSON(message: ResultDBInfo): unknown {
    const obj: any = {};
    if (message.hostname !== "") {
      obj.hostname = message.hostname;
    }
    if (message.invocation !== "") {
      obj.invocation = message.invocation;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ResultDBInfo>, I>>(base?: I): ResultDBInfo {
    return ResultDBInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ResultDBInfo>, I>>(object: I): ResultDBInfo {
    const message = createBaseResultDBInfo() as any;
    message.hostname = object.hostname ?? "";
    message.invocation = object.invocation ?? "";
    return message;
  },
};

function createBaseTaskResultResponse(): TaskResultResponse {
  return {
    taskId: "",
    botDimensions: [],
    botId: "",
    botIdleSinceTs: undefined,
    botVersion: "",
    botLogsCloudProject: "",
    childrenTaskIds: [],
    completedTs: undefined,
    costSavedUsd: 0,
    createdTs: undefined,
    dedupedFrom: "",
    duration: 0,
    exitCode: "0",
    failure: false,
    internalFailure: false,
    modifiedTs: undefined,
    casOutputRoot: undefined,
    serverVersions: [],
    startedTs: undefined,
    state: 0,
    abandonedTs: undefined,
    costsUsd: [],
    name: "",
    tags: [],
    user: "",
    performanceStats: undefined,
    cipdPins: undefined,
    runId: "",
    currentTaskSlice: 0,
    resultdbInfo: undefined,
    missingCas: [],
    missingCipd: [],
  };
}

export const TaskResultResponse = {
  encode(message: TaskResultResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    for (const v of message.botDimensions) {
      StringListPair.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.botId !== "") {
      writer.uint32(26).string(message.botId);
    }
    if (message.botIdleSinceTs !== undefined) {
      Timestamp.encode(toTimestamp(message.botIdleSinceTs), writer.uint32(34).fork()).ldelim();
    }
    if (message.botVersion !== "") {
      writer.uint32(42).string(message.botVersion);
    }
    if (message.botLogsCloudProject !== "") {
      writer.uint32(50).string(message.botLogsCloudProject);
    }
    for (const v of message.childrenTaskIds) {
      writer.uint32(58).string(v!);
    }
    if (message.completedTs !== undefined) {
      Timestamp.encode(toTimestamp(message.completedTs), writer.uint32(66).fork()).ldelim();
    }
    if (message.costSavedUsd !== 0) {
      writer.uint32(77).float(message.costSavedUsd);
    }
    if (message.createdTs !== undefined) {
      Timestamp.encode(toTimestamp(message.createdTs), writer.uint32(82).fork()).ldelim();
    }
    if (message.dedupedFrom !== "") {
      writer.uint32(90).string(message.dedupedFrom);
    }
    if (message.duration !== 0) {
      writer.uint32(101).float(message.duration);
    }
    if (message.exitCode !== "0") {
      writer.uint32(104).int64(message.exitCode);
    }
    if (message.failure === true) {
      writer.uint32(112).bool(message.failure);
    }
    if (message.internalFailure === true) {
      writer.uint32(120).bool(message.internalFailure);
    }
    if (message.modifiedTs !== undefined) {
      Timestamp.encode(toTimestamp(message.modifiedTs), writer.uint32(130).fork()).ldelim();
    }
    if (message.casOutputRoot !== undefined) {
      CASReference.encode(message.casOutputRoot, writer.uint32(138).fork()).ldelim();
    }
    for (const v of message.serverVersions) {
      writer.uint32(146).string(v!);
    }
    if (message.startedTs !== undefined) {
      Timestamp.encode(toTimestamp(message.startedTs), writer.uint32(154).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(160).int32(message.state);
    }
    if (message.abandonedTs !== undefined) {
      Timestamp.encode(toTimestamp(message.abandonedTs), writer.uint32(170).fork()).ldelim();
    }
    writer.uint32(178).fork();
    for (const v of message.costsUsd) {
      writer.float(v);
    }
    writer.ldelim();
    if (message.name !== "") {
      writer.uint32(186).string(message.name);
    }
    for (const v of message.tags) {
      writer.uint32(194).string(v!);
    }
    if (message.user !== "") {
      writer.uint32(202).string(message.user);
    }
    if (message.performanceStats !== undefined) {
      PerformanceStats.encode(message.performanceStats, writer.uint32(210).fork()).ldelim();
    }
    if (message.cipdPins !== undefined) {
      CipdPins.encode(message.cipdPins, writer.uint32(218).fork()).ldelim();
    }
    if (message.runId !== "") {
      writer.uint32(226).string(message.runId);
    }
    if (message.currentTaskSlice !== 0) {
      writer.uint32(232).int32(message.currentTaskSlice);
    }
    if (message.resultdbInfo !== undefined) {
      ResultDBInfo.encode(message.resultdbInfo, writer.uint32(242).fork()).ldelim();
    }
    for (const v of message.missingCas) {
      CASReference.encode(v!, writer.uint32(250).fork()).ldelim();
    }
    for (const v of message.missingCipd) {
      CipdPackage.encode(v!, writer.uint32(258).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskResultResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskResultResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.botDimensions.push(StringListPair.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.botId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.botIdleSinceTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.botVersion = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.botLogsCloudProject = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.childrenTaskIds.push(reader.string());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.completedTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag !== 77) {
            break;
          }

          message.costSavedUsd = reader.float();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.createdTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.dedupedFrom = reader.string();
          continue;
        case 12:
          if (tag !== 101) {
            break;
          }

          message.duration = reader.float();
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.exitCode = longToString(reader.int64() as Long);
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.failure = reader.bool();
          continue;
        case 15:
          if (tag !== 120) {
            break;
          }

          message.internalFailure = reader.bool();
          continue;
        case 16:
          if (tag !== 130) {
            break;
          }

          message.modifiedTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 17:
          if (tag !== 138) {
            break;
          }

          message.casOutputRoot = CASReference.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag !== 146) {
            break;
          }

          message.serverVersions.push(reader.string());
          continue;
        case 19:
          if (tag !== 154) {
            break;
          }

          message.startedTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.abandonedTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 22:
          if (tag === 181) {
            message.costsUsd.push(reader.float());

            continue;
          }

          if (tag === 178) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.costsUsd.push(reader.float());
            }

            continue;
          }

          break;
        case 23:
          if (tag !== 186) {
            break;
          }

          message.name = reader.string();
          continue;
        case 24:
          if (tag !== 194) {
            break;
          }

          message.tags.push(reader.string());
          continue;
        case 25:
          if (tag !== 202) {
            break;
          }

          message.user = reader.string();
          continue;
        case 26:
          if (tag !== 210) {
            break;
          }

          message.performanceStats = PerformanceStats.decode(reader, reader.uint32());
          continue;
        case 27:
          if (tag !== 218) {
            break;
          }

          message.cipdPins = CipdPins.decode(reader, reader.uint32());
          continue;
        case 28:
          if (tag !== 226) {
            break;
          }

          message.runId = reader.string();
          continue;
        case 29:
          if (tag !== 232) {
            break;
          }

          message.currentTaskSlice = reader.int32();
          continue;
        case 30:
          if (tag !== 242) {
            break;
          }

          message.resultdbInfo = ResultDBInfo.decode(reader, reader.uint32());
          continue;
        case 31:
          if (tag !== 250) {
            break;
          }

          message.missingCas.push(CASReference.decode(reader, reader.uint32()));
          continue;
        case 32:
          if (tag !== 258) {
            break;
          }

          message.missingCipd.push(CipdPackage.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskResultResponse {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      botDimensions: globalThis.Array.isArray(object?.botDimensions)
        ? object.botDimensions.map((e: any) => StringListPair.fromJSON(e))
        : [],
      botId: isSet(object.botId) ? globalThis.String(object.botId) : "",
      botIdleSinceTs: isSet(object.botIdleSinceTs) ? globalThis.String(object.botIdleSinceTs) : undefined,
      botVersion: isSet(object.botVersion) ? globalThis.String(object.botVersion) : "",
      botLogsCloudProject: isSet(object.botLogsCloudProject) ? globalThis.String(object.botLogsCloudProject) : "",
      childrenTaskIds: globalThis.Array.isArray(object?.childrenTaskIds)
        ? object.childrenTaskIds.map((e: any) => globalThis.String(e))
        : [],
      completedTs: isSet(object.completedTs) ? globalThis.String(object.completedTs) : undefined,
      costSavedUsd: isSet(object.costSavedUsd) ? globalThis.Number(object.costSavedUsd) : 0,
      createdTs: isSet(object.createdTs) ? globalThis.String(object.createdTs) : undefined,
      dedupedFrom: isSet(object.dedupedFrom) ? globalThis.String(object.dedupedFrom) : "",
      duration: isSet(object.duration) ? globalThis.Number(object.duration) : 0,
      exitCode: isSet(object.exitCode) ? globalThis.String(object.exitCode) : "0",
      failure: isSet(object.failure) ? globalThis.Boolean(object.failure) : false,
      internalFailure: isSet(object.internalFailure) ? globalThis.Boolean(object.internalFailure) : false,
      modifiedTs: isSet(object.modifiedTs) ? globalThis.String(object.modifiedTs) : undefined,
      casOutputRoot: isSet(object.casOutputRoot) ? CASReference.fromJSON(object.casOutputRoot) : undefined,
      serverVersions: globalThis.Array.isArray(object?.serverVersions)
        ? object.serverVersions.map((e: any) => globalThis.String(e))
        : [],
      startedTs: isSet(object.startedTs) ? globalThis.String(object.startedTs) : undefined,
      state: isSet(object.state) ? taskStateFromJSON(object.state) : 0,
      abandonedTs: isSet(object.abandonedTs) ? globalThis.String(object.abandonedTs) : undefined,
      costsUsd: globalThis.Array.isArray(object?.costsUsd) ? object.costsUsd.map((e: any) => globalThis.Number(e)) : [],
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
      user: isSet(object.user) ? globalThis.String(object.user) : "",
      performanceStats: isSet(object.performanceStats) ? PerformanceStats.fromJSON(object.performanceStats) : undefined,
      cipdPins: isSet(object.cipdPins) ? CipdPins.fromJSON(object.cipdPins) : undefined,
      runId: isSet(object.runId) ? globalThis.String(object.runId) : "",
      currentTaskSlice: isSet(object.currentTaskSlice) ? globalThis.Number(object.currentTaskSlice) : 0,
      resultdbInfo: isSet(object.resultdbInfo) ? ResultDBInfo.fromJSON(object.resultdbInfo) : undefined,
      missingCas: globalThis.Array.isArray(object?.missingCas)
        ? object.missingCas.map((e: any) => CASReference.fromJSON(e))
        : [],
      missingCipd: globalThis.Array.isArray(object?.missingCipd)
        ? object.missingCipd.map((e: any) => CipdPackage.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TaskResultResponse): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.botDimensions?.length) {
      obj.botDimensions = message.botDimensions.map((e) => StringListPair.toJSON(e));
    }
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    if (message.botIdleSinceTs !== undefined) {
      obj.botIdleSinceTs = message.botIdleSinceTs;
    }
    if (message.botVersion !== "") {
      obj.botVersion = message.botVersion;
    }
    if (message.botLogsCloudProject !== "") {
      obj.botLogsCloudProject = message.botLogsCloudProject;
    }
    if (message.childrenTaskIds?.length) {
      obj.childrenTaskIds = message.childrenTaskIds;
    }
    if (message.completedTs !== undefined) {
      obj.completedTs = message.completedTs;
    }
    if (message.costSavedUsd !== 0) {
      obj.costSavedUsd = message.costSavedUsd;
    }
    if (message.createdTs !== undefined) {
      obj.createdTs = message.createdTs;
    }
    if (message.dedupedFrom !== "") {
      obj.dedupedFrom = message.dedupedFrom;
    }
    if (message.duration !== 0) {
      obj.duration = message.duration;
    }
    if (message.exitCode !== "0") {
      obj.exitCode = message.exitCode;
    }
    if (message.failure === true) {
      obj.failure = message.failure;
    }
    if (message.internalFailure === true) {
      obj.internalFailure = message.internalFailure;
    }
    if (message.modifiedTs !== undefined) {
      obj.modifiedTs = message.modifiedTs;
    }
    if (message.casOutputRoot !== undefined) {
      obj.casOutputRoot = CASReference.toJSON(message.casOutputRoot);
    }
    if (message.serverVersions?.length) {
      obj.serverVersions = message.serverVersions;
    }
    if (message.startedTs !== undefined) {
      obj.startedTs = message.startedTs;
    }
    if (message.state !== 0) {
      obj.state = taskStateToJSON(message.state);
    }
    if (message.abandonedTs !== undefined) {
      obj.abandonedTs = message.abandonedTs;
    }
    if (message.costsUsd?.length) {
      obj.costsUsd = message.costsUsd;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    if (message.user !== "") {
      obj.user = message.user;
    }
    if (message.performanceStats !== undefined) {
      obj.performanceStats = PerformanceStats.toJSON(message.performanceStats);
    }
    if (message.cipdPins !== undefined) {
      obj.cipdPins = CipdPins.toJSON(message.cipdPins);
    }
    if (message.runId !== "") {
      obj.runId = message.runId;
    }
    if (message.currentTaskSlice !== 0) {
      obj.currentTaskSlice = Math.round(message.currentTaskSlice);
    }
    if (message.resultdbInfo !== undefined) {
      obj.resultdbInfo = ResultDBInfo.toJSON(message.resultdbInfo);
    }
    if (message.missingCas?.length) {
      obj.missingCas = message.missingCas.map((e) => CASReference.toJSON(e));
    }
    if (message.missingCipd?.length) {
      obj.missingCipd = message.missingCipd.map((e) => CipdPackage.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskResultResponse>, I>>(base?: I): TaskResultResponse {
    return TaskResultResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskResultResponse>, I>>(object: I): TaskResultResponse {
    const message = createBaseTaskResultResponse() as any;
    message.taskId = object.taskId ?? "";
    message.botDimensions = object.botDimensions?.map((e) => StringListPair.fromPartial(e)) || [];
    message.botId = object.botId ?? "";
    message.botIdleSinceTs = object.botIdleSinceTs ?? undefined;
    message.botVersion = object.botVersion ?? "";
    message.botLogsCloudProject = object.botLogsCloudProject ?? "";
    message.childrenTaskIds = object.childrenTaskIds?.map((e) => e) || [];
    message.completedTs = object.completedTs ?? undefined;
    message.costSavedUsd = object.costSavedUsd ?? 0;
    message.createdTs = object.createdTs ?? undefined;
    message.dedupedFrom = object.dedupedFrom ?? "";
    message.duration = object.duration ?? 0;
    message.exitCode = object.exitCode ?? "0";
    message.failure = object.failure ?? false;
    message.internalFailure = object.internalFailure ?? false;
    message.modifiedTs = object.modifiedTs ?? undefined;
    message.casOutputRoot = (object.casOutputRoot !== undefined && object.casOutputRoot !== null)
      ? CASReference.fromPartial(object.casOutputRoot)
      : undefined;
    message.serverVersions = object.serverVersions?.map((e) => e) || [];
    message.startedTs = object.startedTs ?? undefined;
    message.state = object.state ?? 0;
    message.abandonedTs = object.abandonedTs ?? undefined;
    message.costsUsd = object.costsUsd?.map((e) => e) || [];
    message.name = object.name ?? "";
    message.tags = object.tags?.map((e) => e) || [];
    message.user = object.user ?? "";
    message.performanceStats = (object.performanceStats !== undefined && object.performanceStats !== null)
      ? PerformanceStats.fromPartial(object.performanceStats)
      : undefined;
    message.cipdPins = (object.cipdPins !== undefined && object.cipdPins !== null)
      ? CipdPins.fromPartial(object.cipdPins)
      : undefined;
    message.runId = object.runId ?? "";
    message.currentTaskSlice = object.currentTaskSlice ?? 0;
    message.resultdbInfo = (object.resultdbInfo !== undefined && object.resultdbInfo !== null)
      ? ResultDBInfo.fromPartial(object.resultdbInfo)
      : undefined;
    message.missingCas = object.missingCas?.map((e) => CASReference.fromPartial(e)) || [];
    message.missingCipd = object.missingCipd?.map((e) => CipdPackage.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTaskStates(): TaskStates {
  return { states: [] };
}

export const TaskStates = {
  encode(message: TaskStates, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.states) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskStates {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskStates() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 8) {
            message.states.push(reader.int32() as any);

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.states.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskStates {
    return {
      states: globalThis.Array.isArray(object?.states) ? object.states.map((e: any) => taskStateFromJSON(e)) : [],
    };
  },

  toJSON(message: TaskStates): unknown {
    const obj: any = {};
    if (message.states?.length) {
      obj.states = message.states.map((e) => taskStateToJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskStates>, I>>(base?: I): TaskStates {
    return TaskStates.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskStates>, I>>(object: I): TaskStates {
    const message = createBaseTaskStates() as any;
    message.states = object.states?.map((e) => e) || [];
    return message;
  },
};

function createBaseTaskListResponse(): TaskListResponse {
  return { cursor: "", items: [], now: undefined };
}

export const TaskListResponse = {
  encode(message: TaskListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== "") {
      writer.uint32(10).string(message.cursor);
    }
    for (const v of message.items) {
      TaskResultResponse.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskListResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskListResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.items.push(TaskResultResponse.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskListResponse {
    return {
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      items: globalThis.Array.isArray(object?.items)
        ? object.items.map((e: any) => TaskResultResponse.fromJSON(e))
        : [],
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
    };
  },

  toJSON(message: TaskListResponse): unknown {
    const obj: any = {};
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => TaskResultResponse.toJSON(e));
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskListResponse>, I>>(base?: I): TaskListResponse {
    return TaskListResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskListResponse>, I>>(object: I): TaskListResponse {
    const message = createBaseTaskListResponse() as any;
    message.cursor = object.cursor ?? "";
    message.items = object.items?.map((e) => TaskResultResponse.fromPartial(e)) || [];
    message.now = object.now ?? undefined;
    return message;
  },
};

function createBaseTaskRequestsResponse(): TaskRequestsResponse {
  return { cursor: "", items: [], now: undefined };
}

export const TaskRequestsResponse = {
  encode(message: TaskRequestsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== "") {
      writer.uint32(10).string(message.cursor);
    }
    for (const v of message.items) {
      TaskRequestResponse.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskRequestsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskRequestsResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.items.push(TaskRequestResponse.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskRequestsResponse {
    return {
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      items: globalThis.Array.isArray(object?.items)
        ? object.items.map((e: any) => TaskRequestResponse.fromJSON(e))
        : [],
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
    };
  },

  toJSON(message: TaskRequestsResponse): unknown {
    const obj: any = {};
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => TaskRequestResponse.toJSON(e));
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskRequestsResponse>, I>>(base?: I): TaskRequestsResponse {
    return TaskRequestsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskRequestsResponse>, I>>(object: I): TaskRequestsResponse {
    const message = createBaseTaskRequestsResponse() as any;
    message.cursor = object.cursor ?? "";
    message.items = object.items?.map((e) => TaskRequestResponse.fromPartial(e)) || [];
    message.now = object.now ?? undefined;
    return message;
  },
};

function createBaseTasksCount(): TasksCount {
  return { count: 0, now: undefined };
}

export const TasksCount = {
  encode(message: TasksCount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.count !== 0) {
      writer.uint32(8).int32(message.count);
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TasksCount {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTasksCount() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.count = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TasksCount {
    return {
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
    };
  },

  toJSON(message: TasksCount): unknown {
    const obj: any = {};
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TasksCount>, I>>(base?: I): TasksCount {
    return TasksCount.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TasksCount>, I>>(object: I): TasksCount {
    const message = createBaseTasksCount() as any;
    message.count = object.count ?? 0;
    message.now = object.now ?? undefined;
    return message;
  },
};

function createBaseTaskRequestMetadataResponse(): TaskRequestMetadataResponse {
  return { taskId: "", request: undefined, taskResult: undefined };
}

export const TaskRequestMetadataResponse = {
  encode(message: TaskRequestMetadataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    if (message.request !== undefined) {
      TaskRequestResponse.encode(message.request, writer.uint32(18).fork()).ldelim();
    }
    if (message.taskResult !== undefined) {
      TaskResultResponse.encode(message.taskResult, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskRequestMetadataResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskRequestMetadataResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.request = TaskRequestResponse.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.taskResult = TaskResultResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskRequestMetadataResponse {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      request: isSet(object.request) ? TaskRequestResponse.fromJSON(object.request) : undefined,
      taskResult: isSet(object.taskResult) ? TaskResultResponse.fromJSON(object.taskResult) : undefined,
    };
  },

  toJSON(message: TaskRequestMetadataResponse): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.request !== undefined) {
      obj.request = TaskRequestResponse.toJSON(message.request);
    }
    if (message.taskResult !== undefined) {
      obj.taskResult = TaskResultResponse.toJSON(message.taskResult);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskRequestMetadataResponse>, I>>(base?: I): TaskRequestMetadataResponse {
    return TaskRequestMetadataResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskRequestMetadataResponse>, I>>(object: I): TaskRequestMetadataResponse {
    const message = createBaseTaskRequestMetadataResponse() as any;
    message.taskId = object.taskId ?? "";
    message.request = (object.request !== undefined && object.request !== null)
      ? TaskRequestResponse.fromPartial(object.request)
      : undefined;
    message.taskResult = (object.taskResult !== undefined && object.taskResult !== null)
      ? TaskResultResponse.fromPartial(object.taskResult)
      : undefined;
    return message;
  },
};

function createBaseTaskQueue(): TaskQueue {
  return { dimensions: [], validUntilTs: undefined };
}

export const TaskQueue = {
  encode(message: TaskQueue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.dimensions) {
      StringPair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.validUntilTs !== undefined) {
      Timestamp.encode(toTimestamp(message.validUntilTs), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskQueue {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskQueue() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.dimensions.push(StringPair.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.validUntilTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskQueue {
    return {
      dimensions: globalThis.Array.isArray(object?.dimensions)
        ? object.dimensions.map((e: any) => StringPair.fromJSON(e))
        : [],
      validUntilTs: isSet(object.validUntilTs) ? globalThis.String(object.validUntilTs) : undefined,
    };
  },

  toJSON(message: TaskQueue): unknown {
    const obj: any = {};
    if (message.dimensions?.length) {
      obj.dimensions = message.dimensions.map((e) => StringPair.toJSON(e));
    }
    if (message.validUntilTs !== undefined) {
      obj.validUntilTs = message.validUntilTs;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskQueue>, I>>(base?: I): TaskQueue {
    return TaskQueue.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskQueue>, I>>(object: I): TaskQueue {
    const message = createBaseTaskQueue() as any;
    message.dimensions = object.dimensions?.map((e) => StringPair.fromPartial(e)) || [];
    message.validUntilTs = object.validUntilTs ?? undefined;
    return message;
  },
};

function createBaseTaskQueueList(): TaskQueueList {
  return { cursor: "", items: [], now: undefined };
}

export const TaskQueueList = {
  encode(message: TaskQueueList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== "") {
      writer.uint32(10).string(message.cursor);
    }
    for (const v of message.items) {
      TaskQueue.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskQueueList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskQueueList() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.items.push(TaskQueue.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskQueueList {
    return {
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e: any) => TaskQueue.fromJSON(e)) : [],
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
    };
  },

  toJSON(message: TaskQueueList): unknown {
    const obj: any = {};
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => TaskQueue.toJSON(e));
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskQueueList>, I>>(base?: I): TaskQueueList {
    return TaskQueueList.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskQueueList>, I>>(object: I): TaskQueueList {
    const message = createBaseTaskQueueList() as any;
    message.cursor = object.cursor ?? "";
    message.items = object.items?.map((e) => TaskQueue.fromPartial(e)) || [];
    message.now = object.now ?? undefined;
    return message;
  },
};

function createBaseBotInfo(): BotInfo {
  return {
    botId: "",
    taskId: "",
    externalIp: "",
    authenticatedAs: "",
    firstSeenTs: undefined,
    isDead: false,
    lastSeenTs: undefined,
    quarantined: false,
    maintenanceMsg: "",
    dimensions: [],
    taskName: "",
    version: "",
    state: "",
    deleted: false,
  };
}

export const BotInfo = {
  encode(message: BotInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botId !== "") {
      writer.uint32(10).string(message.botId);
    }
    if (message.taskId !== "") {
      writer.uint32(18).string(message.taskId);
    }
    if (message.externalIp !== "") {
      writer.uint32(26).string(message.externalIp);
    }
    if (message.authenticatedAs !== "") {
      writer.uint32(34).string(message.authenticatedAs);
    }
    if (message.firstSeenTs !== undefined) {
      Timestamp.encode(toTimestamp(message.firstSeenTs), writer.uint32(42).fork()).ldelim();
    }
    if (message.isDead === true) {
      writer.uint32(48).bool(message.isDead);
    }
    if (message.lastSeenTs !== undefined) {
      Timestamp.encode(toTimestamp(message.lastSeenTs), writer.uint32(58).fork()).ldelim();
    }
    if (message.quarantined === true) {
      writer.uint32(64).bool(message.quarantined);
    }
    if (message.maintenanceMsg !== "") {
      writer.uint32(74).string(message.maintenanceMsg);
    }
    for (const v of message.dimensions) {
      StringListPair.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    if (message.taskName !== "") {
      writer.uint32(90).string(message.taskName);
    }
    if (message.version !== "") {
      writer.uint32(98).string(message.version);
    }
    if (message.state !== "") {
      writer.uint32(106).string(message.state);
    }
    if (message.deleted === true) {
      writer.uint32(112).bool(message.deleted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotInfo() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.externalIp = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.authenticatedAs = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.firstSeenTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.isDead = reader.bool();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.lastSeenTs = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.quarantined = reader.bool();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.maintenanceMsg = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.dimensions.push(StringListPair.decode(reader, reader.uint32()));
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.taskName = reader.string();
          continue;
        case 12:
          if (tag !== 98) {
            break;
          }

          message.version = reader.string();
          continue;
        case 13:
          if (tag !== 106) {
            break;
          }

          message.state = reader.string();
          continue;
        case 14:
          if (tag !== 112) {
            break;
          }

          message.deleted = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotInfo {
    return {
      botId: isSet(object.botId) ? globalThis.String(object.botId) : "",
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      externalIp: isSet(object.externalIp) ? globalThis.String(object.externalIp) : "",
      authenticatedAs: isSet(object.authenticatedAs) ? globalThis.String(object.authenticatedAs) : "",
      firstSeenTs: isSet(object.firstSeenTs) ? globalThis.String(object.firstSeenTs) : undefined,
      isDead: isSet(object.isDead) ? globalThis.Boolean(object.isDead) : false,
      lastSeenTs: isSet(object.lastSeenTs) ? globalThis.String(object.lastSeenTs) : undefined,
      quarantined: isSet(object.quarantined) ? globalThis.Boolean(object.quarantined) : false,
      maintenanceMsg: isSet(object.maintenanceMsg) ? globalThis.String(object.maintenanceMsg) : "",
      dimensions: globalThis.Array.isArray(object?.dimensions)
        ? object.dimensions.map((e: any) => StringListPair.fromJSON(e))
        : [],
      taskName: isSet(object.taskName) ? globalThis.String(object.taskName) : "",
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      state: isSet(object.state) ? globalThis.String(object.state) : "",
      deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false,
    };
  },

  toJSON(message: BotInfo): unknown {
    const obj: any = {};
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.externalIp !== "") {
      obj.externalIp = message.externalIp;
    }
    if (message.authenticatedAs !== "") {
      obj.authenticatedAs = message.authenticatedAs;
    }
    if (message.firstSeenTs !== undefined) {
      obj.firstSeenTs = message.firstSeenTs;
    }
    if (message.isDead === true) {
      obj.isDead = message.isDead;
    }
    if (message.lastSeenTs !== undefined) {
      obj.lastSeenTs = message.lastSeenTs;
    }
    if (message.quarantined === true) {
      obj.quarantined = message.quarantined;
    }
    if (message.maintenanceMsg !== "") {
      obj.maintenanceMsg = message.maintenanceMsg;
    }
    if (message.dimensions?.length) {
      obj.dimensions = message.dimensions.map((e) => StringListPair.toJSON(e));
    }
    if (message.taskName !== "") {
      obj.taskName = message.taskName;
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.state !== "") {
      obj.state = message.state;
    }
    if (message.deleted === true) {
      obj.deleted = message.deleted;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotInfo>, I>>(base?: I): BotInfo {
    return BotInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotInfo>, I>>(object: I): BotInfo {
    const message = createBaseBotInfo() as any;
    message.botId = object.botId ?? "";
    message.taskId = object.taskId ?? "";
    message.externalIp = object.externalIp ?? "";
    message.authenticatedAs = object.authenticatedAs ?? "";
    message.firstSeenTs = object.firstSeenTs ?? undefined;
    message.isDead = object.isDead ?? false;
    message.lastSeenTs = object.lastSeenTs ?? undefined;
    message.quarantined = object.quarantined ?? false;
    message.maintenanceMsg = object.maintenanceMsg ?? "";
    message.dimensions = object.dimensions?.map((e) => StringListPair.fromPartial(e)) || [];
    message.taskName = object.taskName ?? "";
    message.version = object.version ?? "";
    message.state = object.state ?? "";
    message.deleted = object.deleted ?? false;
    return message;
  },
};

function createBaseBotInfoListResponse(): BotInfoListResponse {
  return { cursor: "", items: [], now: undefined, deathTimeout: 0 };
}

export const BotInfoListResponse = {
  encode(message: BotInfoListResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== "") {
      writer.uint32(10).string(message.cursor);
    }
    for (const v of message.items) {
      BotInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(26).fork()).ldelim();
    }
    if (message.deathTimeout !== 0) {
      writer.uint32(32).int32(message.deathTimeout);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotInfoListResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotInfoListResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.items.push(BotInfo.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.deathTimeout = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotInfoListResponse {
    return {
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e: any) => BotInfo.fromJSON(e)) : [],
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
      deathTimeout: isSet(object.deathTimeout) ? globalThis.Number(object.deathTimeout) : 0,
    };
  },

  toJSON(message: BotInfoListResponse): unknown {
    const obj: any = {};
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => BotInfo.toJSON(e));
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    if (message.deathTimeout !== 0) {
      obj.deathTimeout = Math.round(message.deathTimeout);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotInfoListResponse>, I>>(base?: I): BotInfoListResponse {
    return BotInfoListResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotInfoListResponse>, I>>(object: I): BotInfoListResponse {
    const message = createBaseBotInfoListResponse() as any;
    message.cursor = object.cursor ?? "";
    message.items = object.items?.map((e) => BotInfo.fromPartial(e)) || [];
    message.now = object.now ?? undefined;
    message.deathTimeout = object.deathTimeout ?? 0;
    return message;
  },
};

function createBaseBotsCount(): BotsCount {
  return { now: undefined, count: 0, quarantined: 0, maintenance: 0, dead: 0, busy: 0 };
}

export const BotsCount = {
  encode(message: BotsCount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(10).fork()).ldelim();
    }
    if (message.count !== 0) {
      writer.uint32(16).int32(message.count);
    }
    if (message.quarantined !== 0) {
      writer.uint32(24).int32(message.quarantined);
    }
    if (message.maintenance !== 0) {
      writer.uint32(32).int32(message.maintenance);
    }
    if (message.dead !== 0) {
      writer.uint32(40).int32(message.dead);
    }
    if (message.busy !== 0) {
      writer.uint32(48).int32(message.busy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotsCount {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotsCount() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.count = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.quarantined = reader.int32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.maintenance = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.dead = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.busy = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotsCount {
    return {
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      quarantined: isSet(object.quarantined) ? globalThis.Number(object.quarantined) : 0,
      maintenance: isSet(object.maintenance) ? globalThis.Number(object.maintenance) : 0,
      dead: isSet(object.dead) ? globalThis.Number(object.dead) : 0,
      busy: isSet(object.busy) ? globalThis.Number(object.busy) : 0,
    };
  },

  toJSON(message: BotsCount): unknown {
    const obj: any = {};
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.quarantined !== 0) {
      obj.quarantined = Math.round(message.quarantined);
    }
    if (message.maintenance !== 0) {
      obj.maintenance = Math.round(message.maintenance);
    }
    if (message.dead !== 0) {
      obj.dead = Math.round(message.dead);
    }
    if (message.busy !== 0) {
      obj.busy = Math.round(message.busy);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotsCount>, I>>(base?: I): BotsCount {
    return BotsCount.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotsCount>, I>>(object: I): BotsCount {
    const message = createBaseBotsCount() as any;
    message.now = object.now ?? undefined;
    message.count = object.count ?? 0;
    message.quarantined = object.quarantined ?? 0;
    message.maintenance = object.maintenance ?? 0;
    message.dead = object.dead ?? 0;
    message.busy = object.busy ?? 0;
    return message;
  },
};

function createBaseBotsDimensions(): BotsDimensions {
  return { botsDimensions: [], ts: undefined };
}

export const BotsDimensions = {
  encode(message: BotsDimensions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.botsDimensions) {
      StringListPair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.ts !== undefined) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotsDimensions {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotsDimensions() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botsDimensions.push(StringListPair.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotsDimensions {
    return {
      botsDimensions: globalThis.Array.isArray(object?.botsDimensions)
        ? object.botsDimensions.map((e: any) => StringListPair.fromJSON(e))
        : [],
      ts: isSet(object.ts) ? globalThis.String(object.ts) : undefined,
    };
  },

  toJSON(message: BotsDimensions): unknown {
    const obj: any = {};
    if (message.botsDimensions?.length) {
      obj.botsDimensions = message.botsDimensions.map((e) => StringListPair.toJSON(e));
    }
    if (message.ts !== undefined) {
      obj.ts = message.ts;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotsDimensions>, I>>(base?: I): BotsDimensions {
    return BotsDimensions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotsDimensions>, I>>(object: I): BotsDimensions {
    const message = createBaseBotsDimensions() as any;
    message.botsDimensions = object.botsDimensions?.map((e) => StringListPair.fromPartial(e)) || [];
    message.ts = object.ts ?? undefined;
    return message;
  },
};

function createBaseBotEventResponse(): BotEventResponse {
  return {
    ts: undefined,
    eventType: "",
    message: "",
    dimensions: [],
    state: "",
    externalIp: "",
    authenticatedAs: "",
    version: "",
    quarantined: false,
    maintenanceMsg: "",
    taskId: "",
  };
}

export const BotEventResponse = {
  encode(message: BotEventResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ts !== undefined) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(10).fork()).ldelim();
    }
    if (message.eventType !== "") {
      writer.uint32(18).string(message.eventType);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    for (const v of message.dimensions) {
      StringListPair.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.state !== "") {
      writer.uint32(42).string(message.state);
    }
    if (message.externalIp !== "") {
      writer.uint32(50).string(message.externalIp);
    }
    if (message.authenticatedAs !== "") {
      writer.uint32(58).string(message.authenticatedAs);
    }
    if (message.version !== "") {
      writer.uint32(66).string(message.version);
    }
    if (message.quarantined === true) {
      writer.uint32(72).bool(message.quarantined);
    }
    if (message.maintenanceMsg !== "") {
      writer.uint32(82).string(message.maintenanceMsg);
    }
    if (message.taskId !== "") {
      writer.uint32(90).string(message.taskId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotEventResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotEventResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.eventType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.dimensions.push(StringListPair.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.state = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.externalIp = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.authenticatedAs = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.version = reader.string();
          continue;
        case 9:
          if (tag !== 72) {
            break;
          }

          message.quarantined = reader.bool();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.maintenanceMsg = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.taskId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotEventResponse {
    return {
      ts: isSet(object.ts) ? globalThis.String(object.ts) : undefined,
      eventType: isSet(object.eventType) ? globalThis.String(object.eventType) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
      dimensions: globalThis.Array.isArray(object?.dimensions)
        ? object.dimensions.map((e: any) => StringListPair.fromJSON(e))
        : [],
      state: isSet(object.state) ? globalThis.String(object.state) : "",
      externalIp: isSet(object.externalIp) ? globalThis.String(object.externalIp) : "",
      authenticatedAs: isSet(object.authenticatedAs) ? globalThis.String(object.authenticatedAs) : "",
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      quarantined: isSet(object.quarantined) ? globalThis.Boolean(object.quarantined) : false,
      maintenanceMsg: isSet(object.maintenanceMsg) ? globalThis.String(object.maintenanceMsg) : "",
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
    };
  },

  toJSON(message: BotEventResponse): unknown {
    const obj: any = {};
    if (message.ts !== undefined) {
      obj.ts = message.ts;
    }
    if (message.eventType !== "") {
      obj.eventType = message.eventType;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.dimensions?.length) {
      obj.dimensions = message.dimensions.map((e) => StringListPair.toJSON(e));
    }
    if (message.state !== "") {
      obj.state = message.state;
    }
    if (message.externalIp !== "") {
      obj.externalIp = message.externalIp;
    }
    if (message.authenticatedAs !== "") {
      obj.authenticatedAs = message.authenticatedAs;
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.quarantined === true) {
      obj.quarantined = message.quarantined;
    }
    if (message.maintenanceMsg !== "") {
      obj.maintenanceMsg = message.maintenanceMsg;
    }
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotEventResponse>, I>>(base?: I): BotEventResponse {
    return BotEventResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotEventResponse>, I>>(object: I): BotEventResponse {
    const message = createBaseBotEventResponse() as any;
    message.ts = object.ts ?? undefined;
    message.eventType = object.eventType ?? "";
    message.message = object.message ?? "";
    message.dimensions = object.dimensions?.map((e) => StringListPair.fromPartial(e)) || [];
    message.state = object.state ?? "";
    message.externalIp = object.externalIp ?? "";
    message.authenticatedAs = object.authenticatedAs ?? "";
    message.version = object.version ?? "";
    message.quarantined = object.quarantined ?? false;
    message.maintenanceMsg = object.maintenanceMsg ?? "";
    message.taskId = object.taskId ?? "";
    return message;
  },
};

function createBaseBotEventsResponse(): BotEventsResponse {
  return { cursor: "", items: [], now: undefined };
}

export const BotEventsResponse = {
  encode(message: BotEventsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cursor !== "") {
      writer.uint32(10).string(message.cursor);
    }
    for (const v of message.items) {
      BotEventResponse.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.now !== undefined) {
      Timestamp.encode(toTimestamp(message.now), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotEventsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotEventsResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.items.push(BotEventResponse.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.now = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotEventsResponse {
    return {
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e: any) => BotEventResponse.fromJSON(e)) : [],
      now: isSet(object.now) ? globalThis.String(object.now) : undefined,
    };
  },

  toJSON(message: BotEventsResponse): unknown {
    const obj: any = {};
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => BotEventResponse.toJSON(e));
    }
    if (message.now !== undefined) {
      obj.now = message.now;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotEventsResponse>, I>>(base?: I): BotEventsResponse {
    return BotEventsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotEventsResponse>, I>>(object: I): BotEventsResponse {
    const message = createBaseBotEventsResponse() as any;
    message.cursor = object.cursor ?? "";
    message.items = object.items?.map((e) => BotEventResponse.fromPartial(e)) || [];
    message.now = object.now ?? undefined;
    return message;
  },
};

function createBaseDeleteResponse(): DeleteResponse {
  return { deleted: false };
}

export const DeleteResponse = {
  encode(message: DeleteResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deleted === true) {
      writer.uint32(8).bool(message.deleted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.deleted = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DeleteResponse {
    return { deleted: isSet(object.deleted) ? globalThis.Boolean(object.deleted) : false };
  },

  toJSON(message: DeleteResponse): unknown {
    const obj: any = {};
    if (message.deleted === true) {
      obj.deleted = message.deleted;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteResponse>, I>>(base?: I): DeleteResponse {
    return DeleteResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteResponse>, I>>(object: I): DeleteResponse {
    const message = createBaseDeleteResponse() as any;
    message.deleted = object.deleted ?? false;
    return message;
  },
};

function createBaseTerminateResponse(): TerminateResponse {
  return { taskId: "" };
}

export const TerminateResponse = {
  encode(message: TerminateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TerminateResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTerminateResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TerminateResponse {
    return { taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "" };
  },

  toJSON(message: TerminateResponse): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TerminateResponse>, I>>(base?: I): TerminateResponse {
    return TerminateResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TerminateResponse>, I>>(object: I): TerminateResponse {
    const message = createBaseTerminateResponse() as any;
    message.taskId = object.taskId ?? "";
    return message;
  },
};

function createBaseBotRequest(): BotRequest {
  return { botId: "" };
}

export const BotRequest = {
  encode(message: BotRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botId !== "") {
      writer.uint32(10).string(message.botId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotRequest {
    return { botId: isSet(object.botId) ? globalThis.String(object.botId) : "" };
  },

  toJSON(message: BotRequest): unknown {
    const obj: any = {};
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotRequest>, I>>(base?: I): BotRequest {
    return BotRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotRequest>, I>>(object: I): BotRequest {
    const message = createBaseBotRequest() as any;
    message.botId = object.botId ?? "";
    return message;
  },
};

function createBaseTerminateRequest(): TerminateRequest {
  return { botId: "", reason: "" };
}

export const TerminateRequest = {
  encode(message: TerminateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botId !== "") {
      writer.uint32(10).string(message.botId);
    }
    if (message.reason !== "") {
      writer.uint32(18).string(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TerminateRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTerminateRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.reason = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TerminateRequest {
    return {
      botId: isSet(object.botId) ? globalThis.String(object.botId) : "",
      reason: isSet(object.reason) ? globalThis.String(object.reason) : "",
    };
  },

  toJSON(message: TerminateRequest): unknown {
    const obj: any = {};
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    if (message.reason !== "") {
      obj.reason = message.reason;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TerminateRequest>, I>>(base?: I): TerminateRequest {
    return TerminateRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TerminateRequest>, I>>(object: I): TerminateRequest {
    const message = createBaseTerminateRequest() as any;
    message.botId = object.botId ?? "";
    message.reason = object.reason ?? "";
    return message;
  },
};

function createBaseBotEventsRequest(): BotEventsRequest {
  return { botId: "", limit: 0, cursor: "", start: undefined, end: undefined };
}

export const BotEventsRequest = {
  encode(message: BotEventsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botId !== "") {
      writer.uint32(10).string(message.botId);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(26).string(message.cursor);
    }
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(34).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotEventsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotEventsRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotEventsRequest {
    return {
      botId: isSet(object.botId) ? globalThis.String(object.botId) : "",
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      start: isSet(object.start) ? globalThis.String(object.start) : undefined,
      end: isSet(object.end) ? globalThis.String(object.end) : undefined,
    };
  },

  toJSON(message: BotEventsRequest): unknown {
    const obj: any = {};
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.start !== undefined) {
      obj.start = message.start;
    }
    if (message.end !== undefined) {
      obj.end = message.end;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotEventsRequest>, I>>(base?: I): BotEventsRequest {
    return BotEventsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotEventsRequest>, I>>(object: I): BotEventsRequest {
    const message = createBaseBotEventsRequest() as any;
    message.botId = object.botId ?? "";
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    return message;
  },
};

function createBaseBotTasksRequest(): BotTasksRequest {
  return {
    botId: "",
    limit: 0,
    cursor: "",
    start: undefined,
    end: undefined,
    state: 0,
    sort: 0,
    includePerformanceStats: false,
  };
}

export const BotTasksRequest = {
  encode(message: BotTasksRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botId !== "") {
      writer.uint32(10).string(message.botId);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(26).string(message.cursor);
    }
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(34).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(42).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(48).int32(message.state);
    }
    if (message.sort !== 0) {
      writer.uint32(56).int32(message.sort);
    }
    if (message.includePerformanceStats === true) {
      writer.uint32(64).bool(message.includePerformanceStats);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotTasksRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotTasksRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.sort = reader.int32() as any;
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.includePerformanceStats = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotTasksRequest {
    return {
      botId: isSet(object.botId) ? globalThis.String(object.botId) : "",
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      start: isSet(object.start) ? globalThis.String(object.start) : undefined,
      end: isSet(object.end) ? globalThis.String(object.end) : undefined,
      state: isSet(object.state) ? stateQueryFromJSON(object.state) : 0,
      sort: isSet(object.sort) ? sortQueryFromJSON(object.sort) : 0,
      includePerformanceStats: isSet(object.includePerformanceStats)
        ? globalThis.Boolean(object.includePerformanceStats)
        : false,
    };
  },

  toJSON(message: BotTasksRequest): unknown {
    const obj: any = {};
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.start !== undefined) {
      obj.start = message.start;
    }
    if (message.end !== undefined) {
      obj.end = message.end;
    }
    if (message.state !== 0) {
      obj.state = stateQueryToJSON(message.state);
    }
    if (message.sort !== 0) {
      obj.sort = sortQueryToJSON(message.sort);
    }
    if (message.includePerformanceStats === true) {
      obj.includePerformanceStats = message.includePerformanceStats;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotTasksRequest>, I>>(base?: I): BotTasksRequest {
    return BotTasksRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotTasksRequest>, I>>(object: I): BotTasksRequest {
    const message = createBaseBotTasksRequest() as any;
    message.botId = object.botId ?? "";
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    message.state = object.state ?? 0;
    message.sort = object.sort ?? 0;
    message.includePerformanceStats = object.includePerformanceStats ?? false;
    return message;
  },
};

function createBaseBotsRequest(): BotsRequest {
  return { limit: 0, cursor: "", dimensions: [], quarantined: 0, inMaintenance: 0, isDead: 0, isBusy: 0 };
}

export const BotsRequest = {
  encode(message: BotsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(18).string(message.cursor);
    }
    for (const v of message.dimensions) {
      StringPair.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.quarantined !== 0) {
      writer.uint32(32).int32(message.quarantined);
    }
    if (message.inMaintenance !== 0) {
      writer.uint32(40).int32(message.inMaintenance);
    }
    if (message.isDead !== 0) {
      writer.uint32(48).int32(message.isDead);
    }
    if (message.isBusy !== 0) {
      writer.uint32(56).int32(message.isBusy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotsRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.dimensions.push(StringPair.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.quarantined = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.inMaintenance = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.isDead = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.isBusy = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotsRequest {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      dimensions: globalThis.Array.isArray(object?.dimensions)
        ? object.dimensions.map((e: any) => StringPair.fromJSON(e))
        : [],
      quarantined: isSet(object.quarantined) ? nullableBoolFromJSON(object.quarantined) : 0,
      inMaintenance: isSet(object.inMaintenance) ? nullableBoolFromJSON(object.inMaintenance) : 0,
      isDead: isSet(object.isDead) ? nullableBoolFromJSON(object.isDead) : 0,
      isBusy: isSet(object.isBusy) ? nullableBoolFromJSON(object.isBusy) : 0,
    };
  },

  toJSON(message: BotsRequest): unknown {
    const obj: any = {};
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.dimensions?.length) {
      obj.dimensions = message.dimensions.map((e) => StringPair.toJSON(e));
    }
    if (message.quarantined !== 0) {
      obj.quarantined = nullableBoolToJSON(message.quarantined);
    }
    if (message.inMaintenance !== 0) {
      obj.inMaintenance = nullableBoolToJSON(message.inMaintenance);
    }
    if (message.isDead !== 0) {
      obj.isDead = nullableBoolToJSON(message.isDead);
    }
    if (message.isBusy !== 0) {
      obj.isBusy = nullableBoolToJSON(message.isBusy);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotsRequest>, I>>(base?: I): BotsRequest {
    return BotsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotsRequest>, I>>(object: I): BotsRequest {
    const message = createBaseBotsRequest() as any;
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    message.dimensions = object.dimensions?.map((e) => StringPair.fromPartial(e)) || [];
    message.quarantined = object.quarantined ?? 0;
    message.inMaintenance = object.inMaintenance ?? 0;
    message.isDead = object.isDead ?? 0;
    message.isBusy = object.isBusy ?? 0;
    return message;
  },
};

function createBaseBotsCountRequest(): BotsCountRequest {
  return { dimensions: [] };
}

export const BotsCountRequest = {
  encode(message: BotsCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.dimensions) {
      StringPair.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotsCountRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotsCountRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.dimensions.push(StringPair.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotsCountRequest {
    return {
      dimensions: globalThis.Array.isArray(object?.dimensions)
        ? object.dimensions.map((e: any) => StringPair.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BotsCountRequest): unknown {
    const obj: any = {};
    if (message.dimensions?.length) {
      obj.dimensions = message.dimensions.map((e) => StringPair.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotsCountRequest>, I>>(base?: I): BotsCountRequest {
    return BotsCountRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotsCountRequest>, I>>(object: I): BotsCountRequest {
    const message = createBaseBotsCountRequest() as any;
    message.dimensions = object.dimensions?.map((e) => StringPair.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBotsDimensionsRequest(): BotsDimensionsRequest {
  return { pool: "" };
}

export const BotsDimensionsRequest = {
  encode(message: BotsDimensionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pool !== "") {
      writer.uint32(10).string(message.pool);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BotsDimensionsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBotsDimensionsRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pool = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BotsDimensionsRequest {
    return { pool: isSet(object.pool) ? globalThis.String(object.pool) : "" };
  },

  toJSON(message: BotsDimensionsRequest): unknown {
    const obj: any = {};
    if (message.pool !== "") {
      obj.pool = message.pool;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BotsDimensionsRequest>, I>>(base?: I): BotsDimensionsRequest {
    return BotsDimensionsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BotsDimensionsRequest>, I>>(object: I): BotsDimensionsRequest {
    const message = createBaseBotsDimensionsRequest() as any;
    message.pool = object.pool ?? "";
    return message;
  },
};

function createBasePermissionsRequest(): PermissionsRequest {
  return { botId: "", taskId: "", tags: [] };
}

export const PermissionsRequest = {
  encode(message: PermissionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.botId !== "") {
      writer.uint32(10).string(message.botId);
    }
    if (message.taskId !== "") {
      writer.uint32(18).string(message.taskId);
    }
    for (const v of message.tags) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PermissionsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePermissionsRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.botId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.tags.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PermissionsRequest {
    return {
      botId: isSet(object.botId) ? globalThis.String(object.botId) : "",
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: PermissionsRequest): unknown {
    const obj: any = {};
    if (message.botId !== "") {
      obj.botId = message.botId;
    }
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PermissionsRequest>, I>>(base?: I): PermissionsRequest {
    return PermissionsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PermissionsRequest>, I>>(object: I): PermissionsRequest {
    const message = createBasePermissionsRequest() as any;
    message.botId = object.botId ?? "";
    message.taskId = object.taskId ?? "";
    message.tags = object.tags?.map((e) => e) || [];
    return message;
  },
};

function createBaseTaskStatesRequest(): TaskStatesRequest {
  return { taskId: [] };
}

export const TaskStatesRequest = {
  encode(message: TaskStatesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.taskId) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskStatesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskStatesRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskStatesRequest {
    return {
      taskId: globalThis.Array.isArray(object?.taskId) ? object.taskId.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: TaskStatesRequest): unknown {
    const obj: any = {};
    if (message.taskId?.length) {
      obj.taskId = message.taskId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskStatesRequest>, I>>(base?: I): TaskStatesRequest {
    return TaskStatesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskStatesRequest>, I>>(object: I): TaskStatesRequest {
    const message = createBaseTaskStatesRequest() as any;
    message.taskId = object.taskId?.map((e) => e) || [];
    return message;
  },
};

function createBaseTasksWithPerfRequest(): TasksWithPerfRequest {
  return {
    limit: 0,
    cursor: "",
    start: undefined,
    end: undefined,
    state: 0,
    sort: 0,
    tags: [],
    includePerformanceStats: false,
  };
}

export const TasksWithPerfRequest = {
  encode(message: TasksWithPerfRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(18).string(message.cursor);
    }
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(26).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(34).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(40).int32(message.state);
    }
    if (message.sort !== 0) {
      writer.uint32(48).int32(message.sort);
    }
    for (const v of message.tags) {
      writer.uint32(58).string(v!);
    }
    if (message.includePerformanceStats === true) {
      writer.uint32(64).bool(message.includePerformanceStats);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TasksWithPerfRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTasksWithPerfRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.sort = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.tags.push(reader.string());
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.includePerformanceStats = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TasksWithPerfRequest {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      start: isSet(object.start) ? globalThis.String(object.start) : undefined,
      end: isSet(object.end) ? globalThis.String(object.end) : undefined,
      state: isSet(object.state) ? stateQueryFromJSON(object.state) : 0,
      sort: isSet(object.sort) ? sortQueryFromJSON(object.sort) : 0,
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
      includePerformanceStats: isSet(object.includePerformanceStats)
        ? globalThis.Boolean(object.includePerformanceStats)
        : false,
    };
  },

  toJSON(message: TasksWithPerfRequest): unknown {
    const obj: any = {};
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.start !== undefined) {
      obj.start = message.start;
    }
    if (message.end !== undefined) {
      obj.end = message.end;
    }
    if (message.state !== 0) {
      obj.state = stateQueryToJSON(message.state);
    }
    if (message.sort !== 0) {
      obj.sort = sortQueryToJSON(message.sort);
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    if (message.includePerformanceStats === true) {
      obj.includePerformanceStats = message.includePerformanceStats;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TasksWithPerfRequest>, I>>(base?: I): TasksWithPerfRequest {
    return TasksWithPerfRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TasksWithPerfRequest>, I>>(object: I): TasksWithPerfRequest {
    const message = createBaseTasksWithPerfRequest() as any;
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    message.state = object.state ?? 0;
    message.sort = object.sort ?? 0;
    message.tags = object.tags?.map((e) => e) || [];
    message.includePerformanceStats = object.includePerformanceStats ?? false;
    return message;
  },
};

function createBaseTasksRequest(): TasksRequest {
  return { limit: 0, cursor: "", start: undefined, end: undefined, state: 0, sort: 0, tags: [] };
}

export const TasksRequest = {
  encode(message: TasksRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(18).string(message.cursor);
    }
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(26).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(34).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(40).int32(message.state);
    }
    if (message.sort !== 0) {
      writer.uint32(48).int32(message.sort);
    }
    for (const v of message.tags) {
      writer.uint32(58).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TasksRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTasksRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cursor = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.sort = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.tags.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TasksRequest {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
      start: isSet(object.start) ? globalThis.String(object.start) : undefined,
      end: isSet(object.end) ? globalThis.String(object.end) : undefined,
      state: isSet(object.state) ? stateQueryFromJSON(object.state) : 0,
      sort: isSet(object.sort) ? sortQueryFromJSON(object.sort) : 0,
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: TasksRequest): unknown {
    const obj: any = {};
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    if (message.start !== undefined) {
      obj.start = message.start;
    }
    if (message.end !== undefined) {
      obj.end = message.end;
    }
    if (message.state !== 0) {
      obj.state = stateQueryToJSON(message.state);
    }
    if (message.sort !== 0) {
      obj.sort = sortQueryToJSON(message.sort);
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TasksRequest>, I>>(base?: I): TasksRequest {
    return TasksRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TasksRequest>, I>>(object: I): TasksRequest {
    const message = createBaseTasksRequest() as any;
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    message.state = object.state ?? 0;
    message.sort = object.sort ?? 0;
    message.tags = object.tags?.map((e) => e) || [];
    return message;
  },
};

function createBaseTasksCountRequest(): TasksCountRequest {
  return { start: undefined, end: undefined, state: 0, tags: [] };
}

export const TasksCountRequest = {
  encode(message: TasksCountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(10).fork()).ldelim();
    }
    if (message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(18).fork()).ldelim();
    }
    if (message.state !== 0) {
      writer.uint32(24).int32(message.state);
    }
    for (const v of message.tags) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TasksCountRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTasksCountRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.tags.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TasksCountRequest {
    return {
      start: isSet(object.start) ? globalThis.String(object.start) : undefined,
      end: isSet(object.end) ? globalThis.String(object.end) : undefined,
      state: isSet(object.state) ? stateQueryFromJSON(object.state) : 0,
      tags: globalThis.Array.isArray(object?.tags) ? object.tags.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: TasksCountRequest): unknown {
    const obj: any = {};
    if (message.start !== undefined) {
      obj.start = message.start;
    }
    if (message.end !== undefined) {
      obj.end = message.end;
    }
    if (message.state !== 0) {
      obj.state = stateQueryToJSON(message.state);
    }
    if (message.tags?.length) {
      obj.tags = message.tags;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TasksCountRequest>, I>>(base?: I): TasksCountRequest {
    return TasksCountRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TasksCountRequest>, I>>(object: I): TasksCountRequest {
    const message = createBaseTasksCountRequest() as any;
    message.start = object.start ?? undefined;
    message.end = object.end ?? undefined;
    message.state = object.state ?? 0;
    message.tags = object.tags?.map((e) => e) || [];
    return message;
  },
};

function createBaseTaskIdRequest(): TaskIdRequest {
  return { taskId: "" };
}

export const TaskIdRequest = {
  encode(message: TaskIdRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskIdRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskIdRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskIdRequest {
    return { taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "" };
  },

  toJSON(message: TaskIdRequest): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskIdRequest>, I>>(base?: I): TaskIdRequest {
    return TaskIdRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskIdRequest>, I>>(object: I): TaskIdRequest {
    const message = createBaseTaskIdRequest() as any;
    message.taskId = object.taskId ?? "";
    return message;
  },
};

function createBaseTaskIdWithOffsetRequest(): TaskIdWithOffsetRequest {
  return { taskId: "", offset: "0", length: "0" };
}

export const TaskIdWithOffsetRequest = {
  encode(message: TaskIdWithOffsetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    if (message.offset !== "0") {
      writer.uint32(16).int64(message.offset);
    }
    if (message.length !== "0") {
      writer.uint32(24).int64(message.length);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskIdWithOffsetRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskIdWithOffsetRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.offset = longToString(reader.int64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.length = longToString(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskIdWithOffsetRequest {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      offset: isSet(object.offset) ? globalThis.String(object.offset) : "0",
      length: isSet(object.length) ? globalThis.String(object.length) : "0",
    };
  },

  toJSON(message: TaskIdWithOffsetRequest): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.offset !== "0") {
      obj.offset = message.offset;
    }
    if (message.length !== "0") {
      obj.length = message.length;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskIdWithOffsetRequest>, I>>(base?: I): TaskIdWithOffsetRequest {
    return TaskIdWithOffsetRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskIdWithOffsetRequest>, I>>(object: I): TaskIdWithOffsetRequest {
    const message = createBaseTaskIdWithOffsetRequest() as any;
    message.taskId = object.taskId ?? "";
    message.offset = object.offset ?? "0";
    message.length = object.length ?? "0";
    return message;
  },
};

function createBaseTaskIdWithPerfRequest(): TaskIdWithPerfRequest {
  return { taskId: "", includePerformanceStats: false };
}

export const TaskIdWithPerfRequest = {
  encode(message: TaskIdWithPerfRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    if (message.includePerformanceStats === true) {
      writer.uint32(16).bool(message.includePerformanceStats);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskIdWithPerfRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskIdWithPerfRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.includePerformanceStats = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskIdWithPerfRequest {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      includePerformanceStats: isSet(object.includePerformanceStats)
        ? globalThis.Boolean(object.includePerformanceStats)
        : false,
    };
  },

  toJSON(message: TaskIdWithPerfRequest): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.includePerformanceStats === true) {
      obj.includePerformanceStats = message.includePerformanceStats;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskIdWithPerfRequest>, I>>(base?: I): TaskIdWithPerfRequest {
    return TaskIdWithPerfRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskIdWithPerfRequest>, I>>(object: I): TaskIdWithPerfRequest {
    const message = createBaseTaskIdWithPerfRequest() as any;
    message.taskId = object.taskId ?? "";
    message.includePerformanceStats = object.includePerformanceStats ?? false;
    return message;
  },
};

function createBaseTaskQueuesRequest(): TaskQueuesRequest {
  return { limit: 0, cursor: "" };
}

export const TaskQueuesRequest = {
  encode(message: TaskQueuesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.limit !== 0) {
      writer.uint32(8).int32(message.limit);
    }
    if (message.cursor !== "") {
      writer.uint32(18).string(message.cursor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TaskQueuesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTaskQueuesRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cursor = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TaskQueuesRequest {
    return {
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      cursor: isSet(object.cursor) ? globalThis.String(object.cursor) : "",
    };
  },

  toJSON(message: TaskQueuesRequest): unknown {
    const obj: any = {};
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.cursor !== "") {
      obj.cursor = message.cursor;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TaskQueuesRequest>, I>>(base?: I): TaskQueuesRequest {
    return TaskQueuesRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TaskQueuesRequest>, I>>(object: I): TaskQueuesRequest {
    const message = createBaseTaskQueuesRequest() as any;
    message.limit = object.limit ?? 0;
    message.cursor = object.cursor ?? "";
    return message;
  },
};

function createBaseBatchGetResultRequest(): BatchGetResultRequest {
  return { taskIds: [], includePerformanceStats: false };
}

export const BatchGetResultRequest = {
  encode(message: BatchGetResultRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.taskIds) {
      writer.uint32(10).string(v!);
    }
    if (message.includePerformanceStats === true) {
      writer.uint32(16).bool(message.includePerformanceStats);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchGetResultRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchGetResultRequest() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskIds.push(reader.string());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.includePerformanceStats = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BatchGetResultRequest {
    return {
      taskIds: globalThis.Array.isArray(object?.taskIds) ? object.taskIds.map((e: any) => globalThis.String(e)) : [],
      includePerformanceStats: isSet(object.includePerformanceStats)
        ? globalThis.Boolean(object.includePerformanceStats)
        : false,
    };
  },

  toJSON(message: BatchGetResultRequest): unknown {
    const obj: any = {};
    if (message.taskIds?.length) {
      obj.taskIds = message.taskIds;
    }
    if (message.includePerformanceStats === true) {
      obj.includePerformanceStats = message.includePerformanceStats;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BatchGetResultRequest>, I>>(base?: I): BatchGetResultRequest {
    return BatchGetResultRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BatchGetResultRequest>, I>>(object: I): BatchGetResultRequest {
    const message = createBaseBatchGetResultRequest() as any;
    message.taskIds = object.taskIds?.map((e) => e) || [];
    message.includePerformanceStats = object.includePerformanceStats ?? false;
    return message;
  },
};

function createBaseBatchGetResultResponse(): BatchGetResultResponse {
  return { results: [] };
}

export const BatchGetResultResponse = {
  encode(message: BatchGetResultResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.results) {
      BatchGetResultResponse_ResultOrError.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchGetResultResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchGetResultResponse() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.results.push(BatchGetResultResponse_ResultOrError.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BatchGetResultResponse {
    return {
      results: globalThis.Array.isArray(object?.results)
        ? object.results.map((e: any) => BatchGetResultResponse_ResultOrError.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BatchGetResultResponse): unknown {
    const obj: any = {};
    if (message.results?.length) {
      obj.results = message.results.map((e) => BatchGetResultResponse_ResultOrError.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BatchGetResultResponse>, I>>(base?: I): BatchGetResultResponse {
    return BatchGetResultResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BatchGetResultResponse>, I>>(object: I): BatchGetResultResponse {
    const message = createBaseBatchGetResultResponse() as any;
    message.results = object.results?.map((e) => BatchGetResultResponse_ResultOrError.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBatchGetResultResponse_ResultOrError(): BatchGetResultResponse_ResultOrError {
  return { taskId: "", result: undefined, error: undefined };
}

export const BatchGetResultResponse_ResultOrError = {
  encode(message: BatchGetResultResponse_ResultOrError, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    if (message.result !== undefined) {
      TaskResultResponse.encode(message.result, writer.uint32(18).fork()).ldelim();
    }
    if (message.error !== undefined) {
      Status.encode(message.error, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchGetResultResponse_ResultOrError {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchGetResultResponse_ResultOrError() as any;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.taskId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.result = TaskResultResponse.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.error = Status.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BatchGetResultResponse_ResultOrError {
    return {
      taskId: isSet(object.taskId) ? globalThis.String(object.taskId) : "",
      result: isSet(object.result) ? TaskResultResponse.fromJSON(object.result) : undefined,
      error: isSet(object.error) ? Status.fromJSON(object.error) : undefined,
    };
  },

  toJSON(message: BatchGetResultResponse_ResultOrError): unknown {
    const obj: any = {};
    if (message.taskId !== "") {
      obj.taskId = message.taskId;
    }
    if (message.result !== undefined) {
      obj.result = TaskResultResponse.toJSON(message.result);
    }
    if (message.error !== undefined) {
      obj.error = Status.toJSON(message.error);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BatchGetResultResponse_ResultOrError>, I>>(
    base?: I,
  ): BatchGetResultResponse_ResultOrError {
    return BatchGetResultResponse_ResultOrError.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BatchGetResultResponse_ResultOrError>, I>>(
    object: I,
  ): BatchGetResultResponse_ResultOrError {
    const message = createBaseBatchGetResultResponse_ResultOrError() as any;
    message.taskId = object.taskId ?? "";
    message.result = (object.result !== undefined && object.result !== null)
      ? TaskResultResponse.fromPartial(object.result)
      : undefined;
    message.error = (object.error !== undefined && object.error !== null)
      ? Status.fromPartial(object.error)
      : undefined;
    return message;
  },
};

export interface Bots {
  /** GetBot returns information on a single bot */
  GetBot(request: BotRequest): Promise<BotInfo>;
  /**
   * DeleteBot makes Swarming forget about a single bot.
   *
   * This includes the event history, task history and current state (dimensions,
   * cache state, etc). Once deleted, Swarming will not send tasks to this bot.
   * A still running bot will fininsh executing its task and then not have any
   * further tasks queued on it.
   *
   * For non-GCE-Provider bots, this does not remove any data on the bot
   * machine itself, and if the bot is still running on that machine, it will
   * likely show up again in swarming shortly after calling this API.
   *
   * If this bot is managed with GCE Provider, the underlying VM will be recycled
   * and all data on that VM will be lost.
   *
   * If you wish to shut the bot down, call TerminateBot.
   */
  DeleteBot(request: BotRequest): Promise<DeleteResponse>;
  /**
   * ListBotEvents returns a section of the Events (limited in quantity, time range)
   * related to a single Bot.
   *
   * The bot in question must still be 'known' to Swarming.
   */
  ListBotEvents(request: BotEventsRequest): Promise<BotEventsResponse>;
  /**
   * TerminateBot asks a bot to terminate itself gracefully.
   * The bot will stay in the DB, use 'delete' to remove it from the DB
   * afterward. This request returns a pseudo-taskid that can be waited for to
   * wait for the bot to turn down.
   * This command is particularly useful when a privileged user needs to safely
   * debug a machine specific issue. The user can trigger a terminate for one of
   * the bot exhibiting the issue, wait for the pseudo-task to run then access
   * the machine with the guarantee that the bot is not running anymore.
   */
  TerminateBot(request: TerminateRequest): Promise<TerminateResponse>;
  /**
   * ListBotTasks returns a section of the Task history (limited in quantity, time
   * range) in the context of a single bot.
   *
   * The bot in question must still be 'known' to Swarming.
   */
  ListBotTasks(request: BotTasksRequest): Promise<TaskListResponse>;
  /** ListBots returns the state of a filtered (dimensions, state) list of known bots. */
  ListBots(request: BotsRequest): Promise<BotInfoListResponse>;
  /** CountBots returns the number of bots which match given set of filters. */
  CountBots(request: BotsCountRequest): Promise<BotsCount>;
  /**
   * GetBotDimensions returns a list of known dimensions/values for bots currently
   * connected to a given pool.
   */
  GetBotDimensions(request: BotsDimensionsRequest): Promise<BotsDimensions>;
}

export const BotsServiceName = "swarming.v2.Bots";
export class BotsClientImpl implements Bots {
  static readonly DEFAULT_SERVICE = BotsServiceName;
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || BotsServiceName;
    this.rpc = rpc;
    this.GetBot = this.GetBot.bind(this);
    this.DeleteBot = this.DeleteBot.bind(this);
    this.ListBotEvents = this.ListBotEvents.bind(this);
    this.TerminateBot = this.TerminateBot.bind(this);
    this.ListBotTasks = this.ListBotTasks.bind(this);
    this.ListBots = this.ListBots.bind(this);
    this.CountBots = this.CountBots.bind(this);
    this.GetBotDimensions = this.GetBotDimensions.bind(this);
  }
  GetBot(request: BotRequest): Promise<BotInfo> {
    const data = BotRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBot", data);
    return promise.then((data) => BotInfo.decode(_m0.Reader.create(data)));
  }

  DeleteBot(request: BotRequest): Promise<DeleteResponse> {
    const data = BotRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteBot", data);
    return promise.then((data) => DeleteResponse.decode(_m0.Reader.create(data)));
  }

  ListBotEvents(request: BotEventsRequest): Promise<BotEventsResponse> {
    const data = BotEventsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListBotEvents", data);
    return promise.then((data) => BotEventsResponse.decode(_m0.Reader.create(data)));
  }

  TerminateBot(request: TerminateRequest): Promise<TerminateResponse> {
    const data = TerminateRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "TerminateBot", data);
    return promise.then((data) => TerminateResponse.decode(_m0.Reader.create(data)));
  }

  ListBotTasks(request: BotTasksRequest): Promise<TaskListResponse> {
    const data = BotTasksRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListBotTasks", data);
    return promise.then((data) => TaskListResponse.decode(_m0.Reader.create(data)));
  }

  ListBots(request: BotsRequest): Promise<BotInfoListResponse> {
    const data = BotsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListBots", data);
    return promise.then((data) => BotInfoListResponse.decode(_m0.Reader.create(data)));
  }

  CountBots(request: BotsCountRequest): Promise<BotsCount> {
    const data = BotsCountRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CountBots", data);
    return promise.then((data) => BotsCount.decode(_m0.Reader.create(data)));
  }

  GetBotDimensions(request: BotsDimensionsRequest): Promise<BotsDimensions> {
    const data = BotsDimensionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBotDimensions", data);
    return promise.then((data) => BotsDimensions.decode(_m0.Reader.create(data)));
  }
}

export interface Tasks {
  /**
   * GetResult reports the result of the task corresponding to a task ID.
   * It can be a 'run' ID specifying a specific retry or a 'summary' ID hidding
   * the fact that a task may have been retried transparently, when a bot reports
   * BOT_DIED.
   * A summary ID ends with '0', a run ID ends with '1' or '2'.
   *
   * TODO(vadimsh): Require the summary ID ending with '0'.
   */
  GetResult(request: TaskIdWithPerfRequest): Promise<TaskResultResponse>;
  /** BatchGetResult returns results of many tasks at once. */
  BatchGetResult(request: BatchGetResultRequest): Promise<BatchGetResultResponse>;
  /** GetRequest returns the task request corresponding to a task ID. */
  GetRequest(request: TaskIdRequest): Promise<TaskRequestResponse>;
  /** CancelTask cancels a task. If a bot was running the task, the bot will forcibly cancel the task. */
  CancelTask(request: TaskCancelRequest): Promise<CancelResponse>;
  /** GetStdout returns the output of the task corresponding to a task ID. */
  GetStdout(request: TaskIdWithOffsetRequest): Promise<TaskOutputResponse>;
  /**
   * NewTask creates a new task.
   * The task will be enqueued in the tasks list and will be executed at the
   * earliest opportunity by a bot that has at least the dimensions as described
   * in the task request.
   */
  NewTask(request: NewTaskRequest): Promise<TaskRequestMetadataResponse>;
  /**
   * ListTasks returns full task results based on the filters.
   * This endpoint is significantly slower than 'count'. Use 'count' when
   * possible. If you just want the state of tasks, use 'get_states'.
   */
  ListTasks(request: TasksWithPerfRequest): Promise<TaskListResponse>;
  /** ListTaskStates returns task state for a specific set of tasks.""" */
  ListTaskStates(request: TaskStatesRequest): Promise<TaskStates>;
  /** GetTaskRequests returns the task request corresponding to a task ID. */
  ListTaskRequests(request: TasksRequest): Promise<TaskRequestsResponse>;
  /**
   * CancelTasks cancels a subset of pending tasks based on the tags.
   * Cancellation happens asynchronously, so when this call returns,
   * cancellations will not have completed yet.
   */
  CancelTasks(request: TasksCancelRequest): Promise<TasksCancelResponse>;
  /** CountTasks returns the number of tasks in a given state.""" */
  CountTasks(request: TasksCountRequest): Promise<TasksCount>;
}

export const TasksServiceName = "swarming.v2.Tasks";
export class TasksClientImpl implements Tasks {
  static readonly DEFAULT_SERVICE = TasksServiceName;
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || TasksServiceName;
    this.rpc = rpc;
    this.GetResult = this.GetResult.bind(this);
    this.BatchGetResult = this.BatchGetResult.bind(this);
    this.GetRequest = this.GetRequest.bind(this);
    this.CancelTask = this.CancelTask.bind(this);
    this.GetStdout = this.GetStdout.bind(this);
    this.NewTask = this.NewTask.bind(this);
    this.ListTasks = this.ListTasks.bind(this);
    this.ListTaskStates = this.ListTaskStates.bind(this);
    this.ListTaskRequests = this.ListTaskRequests.bind(this);
    this.CancelTasks = this.CancelTasks.bind(this);
    this.CountTasks = this.CountTasks.bind(this);
  }
  GetResult(request: TaskIdWithPerfRequest): Promise<TaskResultResponse> {
    const data = TaskIdWithPerfRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetResult", data);
    return promise.then((data) => TaskResultResponse.decode(_m0.Reader.create(data)));
  }

  BatchGetResult(request: BatchGetResultRequest): Promise<BatchGetResultResponse> {
    const data = BatchGetResultRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "BatchGetResult", data);
    return promise.then((data) => BatchGetResultResponse.decode(_m0.Reader.create(data)));
  }

  GetRequest(request: TaskIdRequest): Promise<TaskRequestResponse> {
    const data = TaskIdRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetRequest", data);
    return promise.then((data) => TaskRequestResponse.decode(_m0.Reader.create(data)));
  }

  CancelTask(request: TaskCancelRequest): Promise<CancelResponse> {
    const data = TaskCancelRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CancelTask", data);
    return promise.then((data) => CancelResponse.decode(_m0.Reader.create(data)));
  }

  GetStdout(request: TaskIdWithOffsetRequest): Promise<TaskOutputResponse> {
    const data = TaskIdWithOffsetRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetStdout", data);
    return promise.then((data) => TaskOutputResponse.decode(_m0.Reader.create(data)));
  }

  NewTask(request: NewTaskRequest): Promise<TaskRequestMetadataResponse> {
    const data = NewTaskRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "NewTask", data);
    return promise.then((data) => TaskRequestMetadataResponse.decode(_m0.Reader.create(data)));
  }

  ListTasks(request: TasksWithPerfRequest): Promise<TaskListResponse> {
    const data = TasksWithPerfRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListTasks", data);
    return promise.then((data) => TaskListResponse.decode(_m0.Reader.create(data)));
  }

  ListTaskStates(request: TaskStatesRequest): Promise<TaskStates> {
    const data = TaskStatesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListTaskStates", data);
    return promise.then((data) => TaskStates.decode(_m0.Reader.create(data)));
  }

  ListTaskRequests(request: TasksRequest): Promise<TaskRequestsResponse> {
    const data = TasksRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListTaskRequests", data);
    return promise.then((data) => TaskRequestsResponse.decode(_m0.Reader.create(data)));
  }

  CancelTasks(request: TasksCancelRequest): Promise<TasksCancelResponse> {
    const data = TasksCancelRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CancelTasks", data);
    return promise.then((data) => TasksCancelResponse.decode(_m0.Reader.create(data)));
  }

  CountTasks(request: TasksCountRequest): Promise<TasksCount> {
    const data = TasksCountRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CountTasks", data);
    return promise.then((data) => TasksCount.decode(_m0.Reader.create(data)));
  }
}

export interface Swarming {
  /**
   * ListQueues returns a list of task queues. Each queue contains a list of dimensions
   * associated with that queue and an expiry date for each dimension.
   */
  ListQueues(request: TaskQueuesRequest): Promise<TaskQueueList>;
  /** GetDetails returns information about the server */
  GetDetails(request: Empty): Promise<ServerDetails>;
  /**
   * GetToken returns a token to bootstrap a new bot.
   * This may seem strange to be a POST and not a GET, but it's very
   * important to make sure GET requests are idempotent and safe
   * to be pre-fetched; generating a token is neither of those things.
   */
  GetToken(request: Empty): Promise<BootstrapToken>;
  /** GetPermissions returns the caller's permissions. */
  GetPermissions(request: PermissionsRequest): Promise<ClientPermissions>;
  /** GetBootStrap returns the current version of bootstrap.py. */
  GetBootstrap(request: Empty): Promise<FileContent>;
  /** GetBotConfig returns the current version of bot_config.py. */
  GetBotConfig(request: Empty): Promise<FileContent>;
}

export const SwarmingServiceName = "swarming.v2.Swarming";
export class SwarmingClientImpl implements Swarming {
  static readonly DEFAULT_SERVICE = SwarmingServiceName;
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || SwarmingServiceName;
    this.rpc = rpc;
    this.ListQueues = this.ListQueues.bind(this);
    this.GetDetails = this.GetDetails.bind(this);
    this.GetToken = this.GetToken.bind(this);
    this.GetPermissions = this.GetPermissions.bind(this);
    this.GetBootstrap = this.GetBootstrap.bind(this);
    this.GetBotConfig = this.GetBotConfig.bind(this);
  }
  ListQueues(request: TaskQueuesRequest): Promise<TaskQueueList> {
    const data = TaskQueuesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ListQueues", data);
    return promise.then((data) => TaskQueueList.decode(_m0.Reader.create(data)));
  }

  GetDetails(request: Empty): Promise<ServerDetails> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetDetails", data);
    return promise.then((data) => ServerDetails.decode(_m0.Reader.create(data)));
  }

  GetToken(request: Empty): Promise<BootstrapToken> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetToken", data);
    return promise.then((data) => BootstrapToken.decode(_m0.Reader.create(data)));
  }

  GetPermissions(request: PermissionsRequest): Promise<ClientPermissions> {
    const data = PermissionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPermissions", data);
    return promise.then((data) => ClientPermissions.decode(_m0.Reader.create(data)));
  }

  GetBootstrap(request: Empty): Promise<FileContent> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBootstrap", data);
    return promise.then((data) => FileContent.decode(_m0.Reader.create(data)));
  }

  GetBotConfig(request: Empty): Promise<FileContent> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBotConfig", data);
    return promise.then((data) => FileContent.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(dateStr: string): Timestamp {
  const date = new globalThis.Date(dateStr);
  const seconds = Math.trunc(date.getTime() / 1_000).toString();
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): string {
  let millis = (globalThis.Number(t.seconds) || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis).toISOString();
}

function longToString(long: Long) {
  return long.toString();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}