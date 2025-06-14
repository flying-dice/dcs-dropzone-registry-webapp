/**
 * Generated by orval v7.7.0 🍺
 * Do not edit manually.
 * DCS Dropzone Registry
 * DCS Dropzone Registry API
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * The health status of the server.
 */
export const HealthValue = {
  /** The health status of the server. */
  status: "UP",
} as const;
export type Health = typeof HealthValue;

/**
 * A summary of a mod
 */
export interface ModSummary {
  /** @pattern ^[a-z0-9-]+$ */
  id: string;
  /** The homepage of the mod */
  homepage: string;
  /** The name of the mod */
  name: string;
  /** A short description of the mod to be displayed in the mod tile */
  description: string;
  /** The authors of the mod as a list of strings */
  authors: string[];
  /** The tags of the mod, these are used to filter mods in the mod browser */
  tags: string[];
  /** The category of the mod, this is used to group mods in the mod browser */
  category: string;
  /** The license of the mod */
  license: string;
  /** The latest version of the mod to be pushed to the subscribers */
  latest?: string;
  /** The dependencies of the mod */
  dependencies: string[];
  /** The URL of the image to display in the mod tile */
  imageUrl?: string;
  published: boolean;
  /**
   * The maintainers of the mod
   * @minItems 1
   */
  maintainers: string[];
}

export type ModVersionsItemAssetsItemLinksItem = {
  /** The name of the file # separates download path and internal zip path */
  source: string;
  /** The name of the installation location relative to install path */
  target: string;
  /** Run on simulation (mission) start, note that this will execute the script before the mission environment is sanitized */
  runonstart?: boolean;
};

export type ModVersionsItemAssetsItem = {
  /** The URL of the file to download */
  remoteSource: string;
  links: ModVersionsItemAssetsItemLinksItem[];
};

export type ModVersionsItem = {
  /** The release page of the release */
  releasepage: string;
  /** The name of the release */
  name: string;
  /** The version of the release */
  version: string;
  /** The date of the release */
  date: string;
  /** Executable file specifically Tools */
  exePath?: string;
  /** The array of files to install */
  assets: ModVersionsItemAssetsItem[];
};

/**
 * A mod
 */
export interface Mod {
  /** @pattern ^[a-z0-9-]+$ */
  id: string;
  /** The homepage of the mod */
  homepage: string;
  /** The name of the mod */
  name: string;
  /** A short description of the mod to be displayed in the mod tile */
  description: string;
  /** The authors of the mod as a list of strings */
  authors?: string[];
  /** The tags of the mod, these are used to filter mods in the mod browser */
  tags?: string[];
  /** The category of the mod, this is used to group mods in the mod browser */
  category?: string;
  /** The license of the mod */
  license?: string;
  /** The latest version of the mod to be pushed to the subscribers */
  latest?: string;
  /** The dependencies of the mod */
  dependencies?: string[];
  /** The versions of the mod */
  versions?: ModVersionsItem[];
  /** The URL of the image to display in the mod tile */
  imageUrl?: string;
  /** The content of the mod */
  content?: string;
  published?: boolean;
  /**
   * The maintainers of the mod
   * @minItems 1
   */
  maintainers: string[];
}

/**
 * The currently authenticated user
 */
export interface AuthenticatedUser {
  /** The user's unique ID as a string, which is provided by the OAuth provider */
  id: string;
  /** The user's name, if available. This is not always provided by the OAuth provider */
  name?: string;
  /** The user's login, which is unique to the OAuth provider */
  login: string;
  /** The user's avatar URL, which can be used to display the user's profile picture */
  avatarUrl: string;
  /** The user's profile URL, which can be used to view the user's profile on the OAuth provider's website */
  profileUrl: string;
  /** Whether the user is a sudo user */
  sudo: boolean;
}

export type GetSudoModSchema200 = { [key: string]: unknown };

export type GetAuthByProviderCallbackParams = {
  code: string;
  state: string;
};

export type GetRegistryIndex200ItemAuthorsItem = {
  name: string;
  avatar?: string;
  url?: string;
};

export type GetRegistryIndex200Item = {
  /** The name of the mod */
  name: string;
  /** A short description of the mod to be displayed in the mod tile */
  description: string;
  authors: GetRegistryIndex200ItemAuthorsItem[];
  /** The tags of the mod, these are used to filter mods in the mod browser */
  tags: string[];
  /** The category of the mod, this is used to group mods in the mod browser */
  category: string;
  latest: string;
  /** The dependencies of the mod */
  dependencies?: string[];
  /** @pattern ^[a-z0-9-]+$ */
  id: string;
  imageUrl: string;
};

export type GetRegistryEntry200AuthorsItem = {
  name: string;
  avatar?: string;
  url?: string;
};

export type GetRegistryEntry200VersionsItemAssetsItemLinksItem = {
  /** The name of the file # separates download path and internal zip path */
  source: string;
  /** The name of the installation location relative to install path */
  target: string;
  /** Run on simulation (mission) start, note that this will execute the script before the mission environment is sanitized */
  runonstart?: boolean;
};

export type GetRegistryEntry200VersionsItemAssetsItem = {
  /** The URL of the file to download */
  remoteSource: string;
  links: GetRegistryEntry200VersionsItemAssetsItemLinksItem[];
};

export type GetRegistryEntry200VersionsItem = {
  /** The release page of the release */
  releasepage: string;
  /** The name of the release */
  name: string;
  /** The version of the release */
  version: string;
  /** The date of the release */
  date: string;
  /** Executable file specifically Tools */
  exePath?: string;
  /** The array of files to install */
  assets: GetRegistryEntry200VersionsItemAssetsItem[];
};

export type GetRegistryEntry200 = {
  /** The homepage of the mod */
  homepage: string;
  /** The name of the mod */
  name: string;
  /** A short description of the mod to be displayed in the mod tile */
  description: string;
  authors: GetRegistryEntry200AuthorsItem[];
  /** The tags of the mod, these are used to filter mods in the mod browser */
  tags: string[];
  /** The category of the mod, this is used to group mods in the mod browser */
  category: string;
  /** The license of the mod */
  license: string;
  latest: string;
  /** The dependencies of the mod */
  dependencies?: string[];
  /** The versions of the mod */
  versions: GetRegistryEntry200VersionsItem[];
  /** @pattern ^[a-z0-9-]+$ */
  id: string;
  imageUrl: string;
  content: string;
};

type AwaitedInput<T> = PromiseLike<T> | T;

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

/**
 * Check the health of the server.
 * @summary Health Check
 */
export const getApiHealth = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Health>> => {
  return axios.get(
    `/api/health`,
    options,
  );
};

export const getGetApiHealthQueryKey = () => {
  return [`/api/health`] as const;
};

export const getGetApiHealthQueryOptions = <
  TData = Awaited<ReturnType<typeof getApiHealth>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getApiHealth>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetApiHealthQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiHealth>>> = (
    { signal },
  ) => getApiHealth({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getApiHealth>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetApiHealthQueryResult = NonNullable<
  Awaited<ReturnType<typeof getApiHealth>>
>;
export type GetApiHealthQueryError = AxiosError<unknown>;

/**
 * @summary Health Check
 */

export function useGetApiHealth<
  TData = Awaited<ReturnType<typeof getApiHealth>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getApiHealth>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetApiHealthQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Returns a list of all mods maintained by the authenticated user.
 * @summary Get All User Mods
 */
export const getUserMods = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<ModSummary[]>> => {
  return axios.get(
    `/api/user-mods`,
    options,
  );
};

export const getGetUserModsQueryKey = () => {
  return [`/api/user-mods`] as const;
};

export const getGetUserModsQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserMods>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUserMods>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUserModsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserMods>>> = (
    { signal },
  ) => getUserMods({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getUserMods>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetUserModsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserMods>>
>;
export type GetUserModsQueryError = AxiosError<unknown>;

/**
 * @summary Get All User Mods
 */

export function useGetUserMods<
  TData = Awaited<ReturnType<typeof getUserMods>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUserMods>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUserModsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Returns the mod with the specified ID if it is maintained by the authenticated user. If the mod exists, but is not maintained by the authenticated user, a 403 Forbidden error is returned.
 * @summary Get User Mod By ID
 */
export const getUserModById = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Mod>> => {
  return axios.get(
    `/api/user-mods/${id}`,
    options,
  );
};

export const getGetUserModByIdQueryKey = (id: string) => {
  return [`/api/user-mods/${id}`] as const;
};

export const getGetUserModByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getUserModById>>,
  TError = AxiosError<void>,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUserModById>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetUserModByIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserModById>>> = (
    { signal },
  ) => getUserModById(id, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getUserModById>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetUserModByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getUserModById>>
>;
export type GetUserModByIdQueryError = AxiosError<void>;

/**
 * @summary Get User Mod By ID
 */

export function useGetUserModById<
  TData = Awaited<ReturnType<typeof getUserModById>>,
  TError = AxiosError<void>,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getUserModById>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetUserModByIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Updates the mod with the specified ID if it is maintained by the authenticated user. If the mod exists, but is not maintained by the authenticated user, a 403 Forbidden error is returned.
 * @summary Update User Mod
 */
export const updateUserMod = (
  id: string,
  mod: Mod,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Mod>> => {
  return axios.put(
    `/api/user-mods/${id}`,
    mod,
    options,
  );
};

export const getUpdateUserModMutationOptions = <
  TError = AxiosError<void>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateUserMod>>,
      TError,
      { id: string; data: Mod },
      TContext
    >;
    axios?: AxiosRequestConfig;
  },
): UseMutationOptions<
  Awaited<ReturnType<typeof updateUserMod>>,
  TError,
  { id: string; data: Mod },
  TContext
> => {
  const mutationKey = ["updateUserMod"];
  const { mutation: mutationOptions, axios: axiosOptions } = options
    ? options.mutation && "mutationKey" in options.mutation &&
        options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, axios: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof updateUserMod>>,
    { id: string; data: Mod }
  > = (props) => {
    const { id, data } = props ?? {};

    return updateUserMod(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type UpdateUserModMutationResult = NonNullable<
  Awaited<ReturnType<typeof updateUserMod>>
>;
export type UpdateUserModMutationBody = Mod;
export type UpdateUserModMutationError = AxiosError<void>;

/**
 * @summary Update User Mod
 */
export const useUpdateUserMod = <TError = AxiosError<void>, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof updateUserMod>>,
      TError,
      { id: string; data: Mod },
      TContext
    >;
    axios?: AxiosRequestConfig;
  },
): UseMutationResult<
  Awaited<ReturnType<typeof updateUserMod>>,
  TError,
  { id: string; data: Mod },
  TContext
> => {
  const mutationOptions = getUpdateUserModMutationOptions(options);

  return useMutation(mutationOptions);
};

/**
 * Returns the schema for a mod.
 * @summary Get Sudo Mod Schema
 */
export const getSudoModSchema = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetSudoModSchema200>> => {
  return axios.get(
    `/api/sudo-mods/schema`,
    options,
  );
};

export const getGetSudoModSchemaQueryKey = () => {
  return [`/api/sudo-mods/schema`] as const;
};

export const getGetSudoModSchemaQueryOptions = <
  TData = Awaited<ReturnType<typeof getSudoModSchema>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getSudoModSchema>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSudoModSchemaQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSudoModSchema>>> = (
    { signal },
  ) => getSudoModSchema({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<
      Awaited<ReturnType<typeof getSudoModSchema>>,
      TError,
      TData
    >
    & { queryKey: QueryKey };
};

export type GetSudoModSchemaQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSudoModSchema>>
>;
export type GetSudoModSchemaQueryError = AxiosError<unknown>;

/**
 * @summary Get Sudo Mod Schema
 */

export function useGetSudoModSchema<
  TData = Awaited<ReturnType<typeof getSudoModSchema>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getSudoModSchema>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetSudoModSchemaQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Returns a list of all mods.
 * @summary Get All User Mods.
 */
export const getSudoMods = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Mod[]>> => {
  return axios.get(
    `/api/sudo-mods`,
    options,
  );
};

export const getGetSudoModsQueryKey = () => {
  return [`/api/sudo-mods`] as const;
};

export const getGetSudoModsQueryOptions = <
  TData = Awaited<ReturnType<typeof getSudoMods>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getSudoMods>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSudoModsQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSudoMods>>> = (
    { signal },
  ) => getSudoMods({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getSudoMods>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetSudoModsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSudoMods>>
>;
export type GetSudoModsQueryError = AxiosError<unknown>;

/**
 * @summary Get All User Mods.
 */

export function useGetSudoMods<
  TData = Awaited<ReturnType<typeof getSudoMods>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getSudoMods>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetSudoModsQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Returns the mod with the specified ID.
 * @summary Get User Mod By ID.
 */
export const getSudoModById = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Mod>> => {
  return axios.get(
    `/api/sudo-mods/${id}`,
    options,
  );
};

export const getGetSudoModByIdQueryKey = (id: string) => {
  return [`/api/sudo-mods/${id}`] as const;
};

export const getGetSudoModByIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getSudoModById>>,
  TError = AxiosError<void>,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getSudoModById>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSudoModByIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSudoModById>>> = (
    { signal },
  ) => getSudoModById(id, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getSudoModById>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetSudoModByIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSudoModById>>
>;
export type GetSudoModByIdQueryError = AxiosError<void>;

/**
 * @summary Get User Mod By ID.
 */

export function useGetSudoModById<
  TData = Awaited<ReturnType<typeof getSudoModById>>,
  TError = AxiosError<void>,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getSudoModById>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetSudoModByIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Updates the mod with the specified ID.
 * @summary Update User Mod
 */
export const setSudoModbyId = (
  id: string,
  mod: Mod,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<Mod>> => {
  return axios.put(
    `/api/sudo-mods/${id}`,
    mod,
    options,
  );
};

export const getSetSudoModbyIdMutationOptions = <
  TError = AxiosError<void>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof setSudoModbyId>>,
      TError,
      { id: string; data: Mod },
      TContext
    >;
    axios?: AxiosRequestConfig;
  },
): UseMutationOptions<
  Awaited<ReturnType<typeof setSudoModbyId>>,
  TError,
  { id: string; data: Mod },
  TContext
> => {
  const mutationKey = ["setSudoModbyId"];
  const { mutation: mutationOptions, axios: axiosOptions } = options
    ? options.mutation && "mutationKey" in options.mutation &&
        options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, axios: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof setSudoModbyId>>,
    { id: string; data: Mod }
  > = (props) => {
    const { id, data } = props ?? {};

    return setSudoModbyId(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type SetSudoModbyIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof setSudoModbyId>>
>;
export type SetSudoModbyIdMutationBody = Mod;
export type SetSudoModbyIdMutationError = AxiosError<void>;

/**
 * @summary Update User Mod
 */
export const useSetSudoModbyId = <
  TError = AxiosError<void>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof setSudoModbyId>>,
      TError,
      { id: string; data: Mod },
      TContext
    >;
    axios?: AxiosRequestConfig;
  },
): UseMutationResult<
  Awaited<ReturnType<typeof setSudoModbyId>>,
  TError,
  { id: string; data: Mod },
  TContext
> => {
  const mutationOptions = getSetSudoModbyIdMutationOptions(options);

  return useMutation(mutationOptions);
};

/**
 * Deletes the mod with the specified ID.
 * @summary Delete User Mod By ID.
 */
export const deleteSudoModById = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<void>> => {
  return axios.delete(
    `/api/sudo-mods/${id}`,
    options,
  );
};

export const getDeleteSudoModByIdMutationOptions = <
  TError = AxiosError<void>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteSudoModById>>,
      TError,
      { id: string },
      TContext
    >;
    axios?: AxiosRequestConfig;
  },
): UseMutationOptions<
  Awaited<ReturnType<typeof deleteSudoModById>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationKey = ["deleteSudoModById"];
  const { mutation: mutationOptions, axios: axiosOptions } = options
    ? options.mutation && "mutationKey" in options.mutation &&
        options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey }, axios: undefined };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteSudoModById>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteSudoModById(id, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteSudoModByIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteSudoModById>>
>;

export type DeleteSudoModByIdMutationError = AxiosError<void>;

/**
 * @summary Delete User Mod By ID.
 */
export const useDeleteSudoModById = <
  TError = AxiosError<void>,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteSudoModById>>,
      TError,
      { id: string },
      TContext
    >;
    axios?: AxiosRequestConfig;
  },
): UseMutationResult<
  Awaited<ReturnType<typeof deleteSudoModById>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteSudoModByIdMutationOptions(options);

  return useMutation(mutationOptions);
};

/**
 * Handles the OAuth provider's callback after the user has authenticated. The callback URL includes the user's access token and other information.
 * @summary OAuth provider callback
 */
export const getAuthByProviderCallback = (
  provider: "github",
  params: GetAuthByProviderCallbackParams,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<unknown>> => {
  return axios.get(
    `/auth/${provider}/callback`,
    {
      ...options,
      params: { ...params, ...options?.params },
    },
  );
};

export const getGetAuthByProviderCallbackQueryKey = (
  provider: "github",
  params: GetAuthByProviderCallbackParams,
) => {
  return [`/auth/${provider}/callback`, ...(params ? [params] : [])] as const;
};

export const getGetAuthByProviderCallbackQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthByProviderCallback>>,
  TError = AxiosError<unknown>,
>(
  provider: "github",
  params: GetAuthByProviderCallbackParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthByProviderCallback>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ??
    getGetAuthByProviderCallbackQueryKey(provider, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAuthByProviderCallback>>
  > = ({ signal }) =>
    getAuthByProviderCallback(provider, params, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!provider, ...queryOptions } as
    & UseQueryOptions<
      Awaited<ReturnType<typeof getAuthByProviderCallback>>,
      TError,
      TData
    >
    & { queryKey: QueryKey };
};

export type GetAuthByProviderCallbackQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthByProviderCallback>>
>;
export type GetAuthByProviderCallbackQueryError = AxiosError<unknown>;

/**
 * @summary OAuth provider callback
 */

export function useGetAuthByProviderCallback<
  TData = Awaited<ReturnType<typeof getAuthByProviderCallback>>,
  TError = AxiosError<unknown>,
>(
  provider: "github",
  params: GetAuthByProviderCallbackParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthByProviderCallback>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAuthByProviderCallbackQueryOptions(
    provider,
    params,
    options,
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Redirects the user to the OAuth provider's authorization page (e.g., GitHub) to initiate the authentication process.
 * @summary Redirect to OAuth provider login page
 */
export const getAuthByProviderLogin = (
  provider: "github",
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<unknown>> => {
  return axios.get(
    `/auth/${provider}/login`,
    options,
  );
};

export const getGetAuthByProviderLoginQueryKey = (provider: "github") => {
  return [`/auth/${provider}/login`] as const;
};

export const getGetAuthByProviderLoginQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthByProviderLogin>>,
  TError = AxiosError<unknown>,
>(
  provider: "github",
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthByProviderLogin>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ??
    getGetAuthByProviderLoginQueryKey(provider);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAuthByProviderLogin>>
  > = ({ signal }) =>
    getAuthByProviderLogin(provider, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!provider, ...queryOptions } as
    & UseQueryOptions<
      Awaited<ReturnType<typeof getAuthByProviderLogin>>,
      TError,
      TData
    >
    & { queryKey: QueryKey };
};

export type GetAuthByProviderLoginQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthByProviderLogin>>
>;
export type GetAuthByProviderLoginQueryError = AxiosError<unknown>;

/**
 * @summary Redirect to OAuth provider login page
 */

export function useGetAuthByProviderLogin<
  TData = Awaited<ReturnType<typeof getAuthByProviderLogin>>,
  TError = AxiosError<unknown>,
>(
  provider: "github",
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthByProviderLogin>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAuthByProviderLoginQueryOptions(provider, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Returns the details of the authenticated user, including their ID, login, avatar URL, and profile URL.
 Requires a valid authentication session (cookie-based authentication).
 * @summary Get authenticated user data
 */
export const getAuthUser = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<AuthenticatedUser>> => {
  return axios.get(
    `/auth/user`,
    options,
  );
};

export const getGetAuthUserQueryKey = () => {
  return [`/auth/user`] as const;
};

export const getGetAuthUserQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthUser>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthUser>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthUserQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthUser>>> = (
    { signal },
  ) => getAuthUser({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getAuthUser>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetAuthUserQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthUser>>
>;
export type GetAuthUserQueryError = AxiosError<unknown>;

/**
 * @summary Get authenticated user data
 */

export function useGetAuthUser<
  TData = Awaited<ReturnType<typeof getAuthUser>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthUser>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAuthUserQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Logs the user out by clearing the session cookie.
 * @summary Logout
 */
export const getAuthLogout = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<unknown>> => {
  return axios.get(
    `/auth/logout`,
    options,
  );
};

export const getGetAuthLogoutQueryKey = () => {
  return [`/auth/logout`] as const;
};

export const getGetAuthLogoutQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthLogout>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthLogout>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthLogoutQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthLogout>>> = (
    { signal },
  ) => getAuthLogout({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<Awaited<ReturnType<typeof getAuthLogout>>, TError, TData>
    & { queryKey: QueryKey };
};

export type GetAuthLogoutQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthLogout>>
>;
export type GetAuthLogoutQueryError = AxiosError<unknown>;

/**
 * @summary Logout
 */

export function useGetAuthLogout<
  TData = Awaited<ReturnType<typeof getAuthLogout>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getAuthLogout>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetAuthLogoutQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Get Registry Index
 */
export const getRegistryIndex = (
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetRegistryIndex200Item[]>> => {
  return axios.get(
    `/api/registry/index.json`,
    options,
  );
};

export const getGetRegistryIndexQueryKey = () => {
  return [`/api/registry/index.json`] as const;
};

export const getGetRegistryIndexQueryOptions = <
  TData = Awaited<ReturnType<typeof getRegistryIndex>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRegistryIndex>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRegistryIndexQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getRegistryIndex>>> = (
    { signal },
  ) => getRegistryIndex({ signal, ...axiosOptions });

  return { queryKey, queryFn, ...queryOptions } as
    & UseQueryOptions<
      Awaited<ReturnType<typeof getRegistryIndex>>,
      TError,
      TData
    >
    & { queryKey: QueryKey };
};

export type GetRegistryIndexQueryResult = NonNullable<
  Awaited<ReturnType<typeof getRegistryIndex>>
>;
export type GetRegistryIndexQueryError = AxiosError<unknown>;

/**
 * @summary Get Registry Index
 */

export function useGetRegistryIndex<
  TData = Awaited<ReturnType<typeof getRegistryIndex>>,
  TError = AxiosError<unknown>,
>(
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRegistryIndex>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetRegistryIndexQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * @summary Get Registry Entry
 */
export const getRegistryEntry = (
  id: string,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<GetRegistryEntry200>> => {
  return axios.get(
    `/api/registry/${id}/index.json`,
    options,
  );
};

export const getGetRegistryEntryQueryKey = (id: string) => {
  return [`/api/registry/${id}/index.json`] as const;
};

export const getGetRegistryEntryQueryOptions = <
  TData = Awaited<ReturnType<typeof getRegistryEntry>>,
  TError = AxiosError<unknown>,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRegistryEntry>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
) => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRegistryEntryQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getRegistryEntry>>> = (
    { signal },
  ) => getRegistryEntry(id, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as
    & UseQueryOptions<
      Awaited<ReturnType<typeof getRegistryEntry>>,
      TError,
      TData
    >
    & { queryKey: QueryKey };
};

export type GetRegistryEntryQueryResult = NonNullable<
  Awaited<ReturnType<typeof getRegistryEntry>>
>;
export type GetRegistryEntryQueryError = AxiosError<unknown>;

/**
 * @summary Get Registry Entry
 */

export function useGetRegistryEntry<
  TData = Awaited<ReturnType<typeof getRegistryEntry>>,
  TError = AxiosError<unknown>,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof getRegistryEntry>>,
      TError,
      TData
    >;
    axios?: AxiosRequestConfig;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetRegistryEntryQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
