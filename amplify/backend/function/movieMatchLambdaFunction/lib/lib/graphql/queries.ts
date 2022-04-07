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
      likedMovies {
        items {
          id
          movie {
            id
            name
            identifier
            coverUri
            rating
            ratingCount
            description
            categories
            trailerUri
            createdAt
            updatedAt
            userMovieMatchesId
            owner
          }
          reaction
          createdAt
          updatedAt
          userLikedMoviesId
          movieReactionMovieId
          owner
        }
        nextToken
      }
      movieMatches {
        items {
          id
          name
          identifier
          coverUri
          rating
          ratingCount
          description
          categories
          trailerUri
          createdAt
          updatedAt
          userMovieMatchesId
          owner
        }
        nextToken
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
        likedMovies {
          items {
            id
            movie {
              id
              name
              identifier
              coverUri
              rating
              ratingCount
              description
              categories
              trailerUri
              createdAt
              updatedAt
              userMovieMatchesId
              owner
            }
            reaction
            createdAt
            updatedAt
            userLikedMoviesId
            movieReactionMovieId
            owner
          }
          nextToken
        }
        movieMatches {
          items {
            id
            name
            identifier
            coverUri
            rating
            ratingCount
            description
            categories
            trailerUri
            createdAt
            updatedAt
            userMovieMatchesId
            owner
          }
          nextToken
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
      name
      identifier
      coverUri
      rating
      ratingCount
      description
      categories
      trailerUri
      createdAt
      updatedAt
      userMovieMatchesId
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
        name
        identifier
        coverUri
        rating
        ratingCount
        description
        categories
        trailerUri
        createdAt
        updatedAt
        userMovieMatchesId
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
        name
        identifier
        coverUri
        rating
        ratingCount
        description
        categories
        trailerUri
        createdAt
        updatedAt
        userMovieMatchesId
        owner
      }
      reaction
      createdAt
      updatedAt
      userLikedMoviesId
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
          name
          identifier
          coverUri
          rating
          ratingCount
          description
          categories
          trailerUri
          createdAt
          updatedAt
          userMovieMatchesId
          owner
        }
        reaction
        createdAt
        updatedAt
        userLikedMoviesId
        movieReactionMovieId
        owner
      }
      nextToken
    }
  }
`;
