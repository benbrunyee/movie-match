/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  sub: string,
  email: string,
  movieMatches?: Array< string > | null,
  connectedUser?: string | null,
};

export type ModelUserConditionInput = {
  sub?: ModelIDInput | null,
  email?: ModelStringInput | null,
  movieMatches?: ModelIDInput | null,
  connectedUser?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type User = {
  __typename: "User",
  id: string,
  sub: string,
  email: string,
  requests?: ModelConnectionRequestConnection | null,
  movieReactions?: ModelMovieReactionConnection | null,
  movieMatches?: Array< string > | null,
  connectedUser?: string | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type ModelConnectionRequestConnection = {
  __typename: "ModelConnectionRequestConnection",
  items:  Array<ConnectionRequest | null >,
  nextToken?: string | null,
};

export type ConnectionRequest = {
  __typename: "ConnectionRequest",
  id: string,
  sender: string,
  receiver: string,
  status: ConnectionRequestStatus,
  createdAt: string,
  updatedAt: string,
  userRequestsId?: string | null,
};

export enum ConnectionRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}


export type ModelMovieReactionConnection = {
  __typename: "ModelMovieReactionConnection",
  items:  Array<MovieReaction | null >,
  nextToken?: string | null,
};

export type MovieReaction = {
  __typename: "MovieReaction",
  id: string,
  movie: Movie,
  createdAt: string,
  reaction: Reaction,
  updatedAt: string,
  userMovieReactionsId?: string | null,
  movieReactionMovieId: string,
  owner?: string | null,
};

export type Movie = {
  __typename: "Movie",
  id: string,
  identifier: number,
  createdAt: string,
  name: string,
  coverUri?: string | null,
  rating?: number | null,
  ratingCount?: number | null,
  description: string,
  categories: Array< string >,
  trailerUri?: string | null,
  updatedAt: string,
  owner?: string | null,
};

export enum Reaction {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}


export type UpdateUserInput = {
  id: string,
  sub?: string | null,
  email?: string | null,
  movieMatches?: Array< string > | null,
  connectedUser?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateConnectionRequestInput = {
  id?: string | null,
  sender: string,
  receiver: string,
  status: ConnectionRequestStatus,
  userRequestsId?: string | null,
};

export type ModelConnectionRequestConditionInput = {
  sender?: ModelIDInput | null,
  receiver?: ModelIDInput | null,
  status?: ModelConnectionRequestStatusInput | null,
  and?: Array< ModelConnectionRequestConditionInput | null > | null,
  or?: Array< ModelConnectionRequestConditionInput | null > | null,
  not?: ModelConnectionRequestConditionInput | null,
  userRequestsId?: ModelIDInput | null,
};

export type ModelConnectionRequestStatusInput = {
  eq?: ConnectionRequestStatus | null,
  ne?: ConnectionRequestStatus | null,
};

export type UpdateConnectionRequestInput = {
  id: string,
  sender?: string | null,
  receiver?: string | null,
  status?: ConnectionRequestStatus | null,
  userRequestsId?: string | null,
};

export type DeleteConnectionRequestInput = {
  id: string,
};

export type CreateMovieInput = {
  id?: string | null,
  identifier: number,
  createdAt?: string | null,
  name: string,
  coverUri?: string | null,
  rating?: number | null,
  ratingCount?: number | null,
  description: string,
  categories: Array< string >,
  trailerUri?: string | null,
};

export type ModelMovieConditionInput = {
  identifier?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  coverUri?: ModelStringInput | null,
  rating?: ModelFloatInput | null,
  ratingCount?: ModelIntInput | null,
  description?: ModelStringInput | null,
  categories?: ModelStringInput | null,
  trailerUri?: ModelStringInput | null,
  and?: Array< ModelMovieConditionInput | null > | null,
  or?: Array< ModelMovieConditionInput | null > | null,
  not?: ModelMovieConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateMovieInput = {
  id: string,
  identifier?: number | null,
  createdAt?: string | null,
  name?: string | null,
  coverUri?: string | null,
  rating?: number | null,
  ratingCount?: number | null,
  description?: string | null,
  categories?: Array< string > | null,
  trailerUri?: string | null,
};

export type DeleteMovieInput = {
  id: string,
};

export type CreateMovieReactionInput = {
  id?: string | null,
  createdAt?: string | null,
  reaction: Reaction,
  userMovieReactionsId?: string | null,
  movieReactionMovieId: string,
};

export type ModelMovieReactionConditionInput = {
  createdAt?: ModelStringInput | null,
  reaction?: ModelReactionInput | null,
  and?: Array< ModelMovieReactionConditionInput | null > | null,
  or?: Array< ModelMovieReactionConditionInput | null > | null,
  not?: ModelMovieReactionConditionInput | null,
  userMovieReactionsId?: ModelIDInput | null,
  movieReactionMovieId?: ModelIDInput | null,
};

export type ModelReactionInput = {
  eq?: Reaction | null,
  ne?: Reaction | null,
};

export type UpdateMovieReactionInput = {
  id: string,
  createdAt?: string | null,
  reaction?: Reaction | null,
  userMovieReactionsId?: string | null,
  movieReactionMovieId?: string | null,
};

export type DeleteMovieReactionInput = {
  id: string,
};

export type AcceptRequestInput = {
  requestId: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  sub?: ModelIDInput | null,
  email?: ModelStringInput | null,
  movieMatches?: ModelIDInput | null,
  connectedUser?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelConnectionRequestFilterInput = {
  id?: ModelIDInput | null,
  sender?: ModelIDInput | null,
  receiver?: ModelIDInput | null,
  status?: ModelConnectionRequestStatusInput | null,
  and?: Array< ModelConnectionRequestFilterInput | null > | null,
  or?: Array< ModelConnectionRequestFilterInput | null > | null,
  not?: ModelConnectionRequestFilterInput | null,
  userRequestsId?: ModelIDInput | null,
};

export type ModelMovieFilterInput = {
  id?: ModelIDInput | null,
  identifier?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  coverUri?: ModelStringInput | null,
  rating?: ModelFloatInput | null,
  ratingCount?: ModelIntInput | null,
  description?: ModelStringInput | null,
  categories?: ModelStringInput | null,
  trailerUri?: ModelStringInput | null,
  and?: Array< ModelMovieFilterInput | null > | null,
  or?: Array< ModelMovieFilterInput | null > | null,
  not?: ModelMovieFilterInput | null,
};

export type ModelMovieConnection = {
  __typename: "ModelMovieConnection",
  items:  Array<Movie | null >,
  nextToken?: string | null,
};

export type ModelMovieReactionFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  reaction?: ModelReactionInput | null,
  and?: Array< ModelMovieReactionFilterInput | null > | null,
  or?: Array< ModelMovieReactionFilterInput | null > | null,
  not?: ModelMovieReactionFilterInput | null,
  userMovieReactionsId?: ModelIDInput | null,
  movieReactionMovieId?: ModelIDInput | null,
};

export type DiscoverMoviesInput = {
  page?: number | null,
};

export type QueryMovieList = {
  __typename: "QueryMovieList",
  items:  Array<Movie >,
};

export type GetApiMoviesInput = {
  id: number,
};

export type MovieApiOutput = {
  __typename: "MovieApiOutput",
  id: number,
  poster_path?: string | null,
  adult: boolean,
  overview: string,
  release_date: string,
  genre_ids: Array< number >,
  original_title: string,
  original_language: string,
  title: string,
  backdrop_path?: string | null,
  popularity: number,
  vote_count: number,
  video: boolean,
  vote_average: number,
};

export type FindMovieMatchesList = {
  __typename: "FindMovieMatchesList",
  allMatches: Array< string >,
  newMatches: Array< string >,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    sub: string,
    email: string,
    requests?:  {
      __typename: "ModelConnectionRequestConnection",
      items:  Array< {
        __typename: "ConnectionRequest",
        id: string,
        sender: string,
        receiver: string,
        status: ConnectionRequestStatus,
        createdAt: string,
        updatedAt: string,
        userRequestsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieReactions?:  {
      __typename: "ModelMovieReactionConnection",
      items:  Array< {
        __typename: "MovieReaction",
        id: string,
        movie:  {
          __typename: "Movie",
          id: string,
          identifier: number,
          createdAt: string,
          name: string,
          coverUri?: string | null,
          rating?: number | null,
          ratingCount?: number | null,
          description: string,
          categories: Array< string >,
          trailerUri?: string | null,
          updatedAt: string,
          owner?: string | null,
        },
        createdAt: string,
        reaction: Reaction,
        updatedAt: string,
        userMovieReactionsId?: string | null,
        movieReactionMovieId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieMatches?: Array< string > | null,
    connectedUser?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    sub: string,
    email: string,
    requests?:  {
      __typename: "ModelConnectionRequestConnection",
      items:  Array< {
        __typename: "ConnectionRequest",
        id: string,
        sender: string,
        receiver: string,
        status: ConnectionRequestStatus,
        createdAt: string,
        updatedAt: string,
        userRequestsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieReactions?:  {
      __typename: "ModelMovieReactionConnection",
      items:  Array< {
        __typename: "MovieReaction",
        id: string,
        movie:  {
          __typename: "Movie",
          id: string,
          identifier: number,
          createdAt: string,
          name: string,
          coverUri?: string | null,
          rating?: number | null,
          ratingCount?: number | null,
          description: string,
          categories: Array< string >,
          trailerUri?: string | null,
          updatedAt: string,
          owner?: string | null,
        },
        createdAt: string,
        reaction: Reaction,
        updatedAt: string,
        userMovieReactionsId?: string | null,
        movieReactionMovieId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieMatches?: Array< string > | null,
    connectedUser?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    sub: string,
    email: string,
    requests?:  {
      __typename: "ModelConnectionRequestConnection",
      items:  Array< {
        __typename: "ConnectionRequest",
        id: string,
        sender: string,
        receiver: string,
        status: ConnectionRequestStatus,
        createdAt: string,
        updatedAt: string,
        userRequestsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieReactions?:  {
      __typename: "ModelMovieReactionConnection",
      items:  Array< {
        __typename: "MovieReaction",
        id: string,
        movie:  {
          __typename: "Movie",
          id: string,
          identifier: number,
          createdAt: string,
          name: string,
          coverUri?: string | null,
          rating?: number | null,
          ratingCount?: number | null,
          description: string,
          categories: Array< string >,
          trailerUri?: string | null,
          updatedAt: string,
          owner?: string | null,
        },
        createdAt: string,
        reaction: Reaction,
        updatedAt: string,
        userMovieReactionsId?: string | null,
        movieReactionMovieId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieMatches?: Array< string > | null,
    connectedUser?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateConnectionRequestMutationVariables = {
  input: CreateConnectionRequestInput,
  condition?: ModelConnectionRequestConditionInput | null,
};

export type CreateConnectionRequestMutation = {
  createConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type UpdateConnectionRequestMutationVariables = {
  input: UpdateConnectionRequestInput,
  condition?: ModelConnectionRequestConditionInput | null,
};

export type UpdateConnectionRequestMutation = {
  updateConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type DeleteConnectionRequestMutationVariables = {
  input: DeleteConnectionRequestInput,
  condition?: ModelConnectionRequestConditionInput | null,
};

export type DeleteConnectionRequestMutation = {
  deleteConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type CreateMovieMutationVariables = {
  input: CreateMovieInput,
  condition?: ModelMovieConditionInput | null,
};

export type CreateMovieMutation = {
  createMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateMovieMutationVariables = {
  input: UpdateMovieInput,
  condition?: ModelMovieConditionInput | null,
};

export type UpdateMovieMutation = {
  updateMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteMovieMutationVariables = {
  input: DeleteMovieInput,
  condition?: ModelMovieConditionInput | null,
};

export type DeleteMovieMutation = {
  deleteMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateMovieReactionMutationVariables = {
  input: CreateMovieReactionInput,
  condition?: ModelMovieReactionConditionInput | null,
};

export type CreateMovieReactionMutation = {
  createMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};

export type UpdateMovieReactionMutationVariables = {
  input: UpdateMovieReactionInput,
  condition?: ModelMovieReactionConditionInput | null,
};

export type UpdateMovieReactionMutation = {
  updateMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};

export type DeleteMovieReactionMutationVariables = {
  input: DeleteMovieReactionInput,
  condition?: ModelMovieReactionConditionInput | null,
};

export type DeleteMovieReactionMutation = {
  deleteMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};

export type AcceptRequestMutationVariables = {
  input: AcceptRequestInput,
};

export type AcceptRequestMutation = {
  acceptRequest?: string | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    sub: string,
    email: string,
    requests?:  {
      __typename: "ModelConnectionRequestConnection",
      items:  Array< {
        __typename: "ConnectionRequest",
        id: string,
        sender: string,
        receiver: string,
        status: ConnectionRequestStatus,
        createdAt: string,
        updatedAt: string,
        userRequestsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieReactions?:  {
      __typename: "ModelMovieReactionConnection",
      items:  Array< {
        __typename: "MovieReaction",
        id: string,
        movie:  {
          __typename: "Movie",
          id: string,
          identifier: number,
          createdAt: string,
          name: string,
          coverUri?: string | null,
          rating?: number | null,
          ratingCount?: number | null,
          description: string,
          categories: Array< string >,
          trailerUri?: string | null,
          updatedAt: string,
          owner?: string | null,
        },
        createdAt: string,
        reaction: Reaction,
        updatedAt: string,
        userMovieReactionsId?: string | null,
        movieReactionMovieId: string,
        owner?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    movieMatches?: Array< string > | null,
    connectedUser?: string | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  id?: string | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      sub: string,
      email: string,
      requests?:  {
        __typename: "ModelConnectionRequestConnection",
        items:  Array< {
          __typename: "ConnectionRequest",
          id: string,
          sender: string,
          receiver: string,
          status: ConnectionRequestStatus,
          createdAt: string,
          updatedAt: string,
          userRequestsId?: string | null,
        } | null >,
        nextToken?: string | null,
      } | null,
      movieReactions?:  {
        __typename: "ModelMovieReactionConnection",
        items:  Array< {
          __typename: "MovieReaction",
          id: string,
          movie:  {
            __typename: "Movie",
            id: string,
            identifier: number,
            createdAt: string,
            name: string,
            coverUri?: string | null,
            rating?: number | null,
            ratingCount?: number | null,
            description: string,
            categories: Array< string >,
            trailerUri?: string | null,
            updatedAt: string,
            owner?: string | null,
          },
          createdAt: string,
          reaction: Reaction,
          updatedAt: string,
          userMovieReactionsId?: string | null,
          movieReactionMovieId: string,
          owner?: string | null,
        } | null >,
        nextToken?: string | null,
      } | null,
      movieMatches?: Array< string > | null,
      connectedUser?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetConnectionRequestQueryVariables = {
  id: string,
};

export type GetConnectionRequestQuery = {
  getConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type ListConnectionRequestsQueryVariables = {
  id?: string | null,
  filter?: ModelConnectionRequestFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListConnectionRequestsQuery = {
  listConnectionRequests?:  {
    __typename: "ModelConnectionRequestConnection",
    items:  Array< {
      __typename: "ConnectionRequest",
      id: string,
      sender: string,
      receiver: string,
      status: ConnectionRequestStatus,
      createdAt: string,
      updatedAt: string,
      userRequestsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMovieQueryVariables = {
  id: string,
};

export type GetMovieQuery = {
  getMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListMoviesQueryVariables = {
  id?: string | null,
  filter?: ModelMovieFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListMoviesQuery = {
  listMovies?:  {
    __typename: "ModelMovieConnection",
    items:  Array< {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MovieByIdentifierQueryVariables = {
  identifier: number,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMovieFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MovieByIdentifierQuery = {
  movieByIdentifier?:  {
    __typename: "ModelMovieConnection",
    items:  Array< {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMovieReactionQueryVariables = {
  id: string,
};

export type GetMovieReactionQuery = {
  getMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};

export type ListMovieReactionsQueryVariables = {
  id?: string | null,
  filter?: ModelMovieReactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListMovieReactionsQuery = {
  listMovieReactions?:  {
    __typename: "ModelMovieReactionConnection",
    items:  Array< {
      __typename: "MovieReaction",
      id: string,
      movie:  {
        __typename: "Movie",
        id: string,
        identifier: number,
        createdAt: string,
        name: string,
        coverUri?: string | null,
        rating?: number | null,
        ratingCount?: number | null,
        description: string,
        categories: Array< string >,
        trailerUri?: string | null,
        updatedAt: string,
        owner?: string | null,
      },
      createdAt: string,
      reaction: Reaction,
      updatedAt: string,
      userMovieReactionsId?: string | null,
      movieReactionMovieId: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type DiscoverMoviesQueryVariables = {
  input?: DiscoverMoviesInput | null,
};

export type DiscoverMoviesQuery = {
  discoverMovies?:  {
    __typename: "QueryMovieList",
    items:  Array< {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    } >,
  } | null,
};

export type GetApiMovieQueryVariables = {
  input?: GetApiMoviesInput | null,
};

export type GetApiMovieQuery = {
  getApiMovie?:  {
    __typename: "MovieApiOutput",
    id: number,
    poster_path?: string | null,
    adult: boolean,
    overview: string,
    release_date: string,
    genre_ids: Array< number >,
    original_title: string,
    original_language: string,
    title: string,
    backdrop_path?: string | null,
    popularity: number,
    vote_count: number,
    video: boolean,
    vote_average: number,
  } | null,
};

export type FindMovieMatchesQuery = {
  findMovieMatches?:  {
    __typename: "FindMovieMatchesList",
    allMatches: Array< string >,
    newMatches: Array< string >,
  } | null,
};

export type ListPartnerPendingMovieMatchesQuery = {
  listPartnerPendingMovieMatches?:  {
    __typename: "QueryMovieList",
    items:  Array< {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    } >,
  } | null,
};

export type OnCreateConnectionRequestSubscriptionVariables = {
  sender?: string | null,
  receiver?: string | null,
};

export type OnCreateConnectionRequestSubscription = {
  onCreateConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type OnUpdateConnectionRequestSubscriptionVariables = {
  sender?: string | null,
  receiver?: string | null,
};

export type OnUpdateConnectionRequestSubscription = {
  onUpdateConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type OnDeleteConnectionRequestSubscriptionVariables = {
  sender?: string | null,
  receiver?: string | null,
};

export type OnDeleteConnectionRequestSubscription = {
  onDeleteConnectionRequest?:  {
    __typename: "ConnectionRequest",
    id: string,
    sender: string,
    receiver: string,
    status: ConnectionRequestStatus,
    createdAt: string,
    updatedAt: string,
    userRequestsId?: string | null,
  } | null,
};

export type OnCreateMovieSubscription = {
  onCreateMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateMovieSubscription = {
  onUpdateMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteMovieSubscription = {
  onDeleteMovie?:  {
    __typename: "Movie",
    id: string,
    identifier: number,
    createdAt: string,
    name: string,
    coverUri?: string | null,
    rating?: number | null,
    ratingCount?: number | null,
    description: string,
    categories: Array< string >,
    trailerUri?: string | null,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateMovieReactionSubscriptionVariables = {
  owner?: string | null,
};

export type OnCreateMovieReactionSubscription = {
  onCreateMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateMovieReactionSubscriptionVariables = {
  owner?: string | null,
};

export type OnUpdateMovieReactionSubscription = {
  onUpdateMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteMovieReactionSubscriptionVariables = {
  owner?: string | null,
};

export type OnDeleteMovieReactionSubscription = {
  onDeleteMovieReaction?:  {
    __typename: "MovieReaction",
    id: string,
    movie:  {
      __typename: "Movie",
      id: string,
      identifier: number,
      createdAt: string,
      name: string,
      coverUri?: string | null,
      rating?: number | null,
      ratingCount?: number | null,
      description: string,
      categories: Array< string >,
      trailerUri?: string | null,
      updatedAt: string,
      owner?: string | null,
    },
    createdAt: string,
    reaction: Reaction,
    updatedAt: string,
    userMovieReactionsId?: string | null,
    movieReactionMovieId: string,
    owner?: string | null,
  } | null,
};
