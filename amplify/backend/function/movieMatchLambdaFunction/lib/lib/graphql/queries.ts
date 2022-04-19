/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      sub
      email
      requests {
        items {
          id
          sender
          receiver
          status
          createdAt
          updatedAt
          userRequestsId
        }
        nextToken
      }
      movieReactions {
        items {
          id
          movie {
            id
            identifier
            createdAt
            name
            coverUri
            rating
            ratingCount
            description
            genres
            trailerUri
            releaseYear
            updatedAt
            owner
          }
          createdAt
          reaction
          updatedAt
          userMovieReactionsId
          movieReactionMovieId
          owner
        }
        nextToken
      }
      movieMatches
      searchOptions {
        region
        includeAdult
        releasedAfterYear
        genres
      }
      connectedUser
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sub
        email
        requests {
          items {
            id
            sender
            receiver
            status
            createdAt
            updatedAt
            userRequestsId
          }
          nextToken
        }
        movieReactions {
          items {
            id
            movie {
              id
              identifier
              createdAt
              name
              coverUri
              rating
              ratingCount
              description
              genres
              trailerUri
              releaseYear
              updatedAt
              owner
            }
            createdAt
            reaction
            updatedAt
            userMovieReactionsId
            movieReactionMovieId
            owner
          }
          nextToken
        }
        movieMatches
        searchOptions {
          region
          includeAdult
          releasedAfterYear
          genres
        }
        connectedUser
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getConnectionRequest = /* GraphQL */ `
  query GetConnectionRequest($id: ID!) {
    getConnectionRequest(id: $id) {
      id
      sender
      receiver
      status
      createdAt
      updatedAt
      userRequestsId
    }
  }
`;
export const listConnectionRequests = /* GraphQL */ `
  query ListConnectionRequests(
    $id: ID
    $filter: ModelConnectionRequestFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listConnectionRequests(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sender
        receiver
        status
        createdAt
        updatedAt
        userRequestsId
      }
      nextToken
    }
  }
`;
export const getMovie = /* GraphQL */ `
  query GetMovie($id: ID!) {
    getMovie(id: $id) {
      id
      identifier
      createdAt
      name
      coverUri
      rating
      ratingCount
      description
      genres
      trailerUri
      releaseYear
      updatedAt
      owner
    }
  }
`;
export const listMovies = /* GraphQL */ `
  query ListMovies(
    $id: ID
    $filter: ModelMovieFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMovies(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const movieByIdentifier = /* GraphQL */ `
  query MovieByIdentifier(
    $identifier: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelMovieFilterInput
    $limit: Int
    $nextToken: String
  ) {
    movieByIdentifier(
      identifier: $identifier
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getMovieReaction = /* GraphQL */ `
  query GetMovieReaction($id: ID!) {
    getMovieReaction(id: $id) {
      id
      movie {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
      createdAt
      reaction
      updatedAt
      userMovieReactionsId
      movieReactionMovieId
      owner
    }
  }
`;
export const listMovieReactions = /* GraphQL */ `
  query ListMovieReactions(
    $id: ID
    $filter: ModelMovieReactionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listMovieReactions(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        movie {
          id
          identifier
          createdAt
          name
          coverUri
          rating
          ratingCount
          description
          genres
          trailerUri
          releaseYear
          updatedAt
          owner
        }
        createdAt
        reaction
        updatedAt
        userMovieReactionsId
        movieReactionMovieId
        owner
      }
      nextToken
    }
  }
`;
export const discoverMovies = /* GraphQL */ `
  query DiscoverMovies($input: DiscoverMoviesInput) {
    discoverMovies(input: $input) {
      items {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
    }
  }
`;
export const pageCountForOptions = /* GraphQL */ `
  query PageCountForOptions($input: DiscoverMoviesInput) {
    pageCountForOptions(input: $input)
  }
`;
export const getApiMovie = /* GraphQL */ `
  query GetApiMovie($input: GetApiMoviesInput) {
    getApiMovie(input: $input) {
      id
      poster_path
      adult
      overview
      release_date
      genre_ids
      original_title
      original_language
      title
      backdrop_path
      popularity
      vote_count
      video
      vote_average
    }
  }
`;
export const findMovieMatches = /* GraphQL */ `
  query FindMovieMatches {
    findMovieMatches {
      allMatches {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
      newMatches {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
    }
  }
`;
export const listPartnerPendingMovieMatches = /* GraphQL */ `
  query ListPartnerPendingMovieMatches {
    listPartnerPendingMovieMatches {
      items {
        id
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        genres
        trailerUri
        releaseYear
        updatedAt
        owner
      }
    }
  }
`;
