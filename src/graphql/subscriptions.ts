/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String) {
    onCreateUser(owner: $owner) {
      id
      sub
      email
      requests {
        items {
          id
          receiver
          status
          createdAt
          updatedAt
          userRequestsId
          owner
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String) {
    onUpdateUser(owner: $owner) {
      id
      sub
      email
      requests {
        items {
          id
          receiver
          status
          createdAt
          updatedAt
          userRequestsId
          owner
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String) {
    onDeleteUser(owner: $owner) {
      id
      sub
      email
      requests {
        items {
          id
          receiver
          status
          createdAt
          updatedAt
          userRequestsId
          owner
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
export const onCreateConnectionRequest = /* GraphQL */ `
  subscription OnCreateConnectionRequest($owner: String, $receiver: String) {
    onCreateConnectionRequest(owner: $owner, receiver: $receiver) {
      id
      receiver
      status
      createdAt
      updatedAt
      userRequestsId
      owner
    }
  }
`;
export const onUpdateConnectionRequest = /* GraphQL */ `
  subscription OnUpdateConnectionRequest($owner: String, $receiver: String) {
    onUpdateConnectionRequest(owner: $owner, receiver: $receiver) {
      id
      receiver
      status
      createdAt
      updatedAt
      userRequestsId
      owner
    }
  }
`;
export const onDeleteConnectionRequest = /* GraphQL */ `
  subscription OnDeleteConnectionRequest($owner: String, $receiver: String) {
    onDeleteConnectionRequest(owner: $owner, receiver: $receiver) {
      id
      receiver
      status
      createdAt
      updatedAt
      userRequestsId
      owner
    }
  }
`;
export const onCreateMovie = /* GraphQL */ `
  subscription OnCreateMovie {
    onCreateMovie {
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
export const onUpdateMovie = /* GraphQL */ `
  subscription OnUpdateMovie {
    onUpdateMovie {
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
export const onDeleteMovie = /* GraphQL */ `
  subscription OnDeleteMovie {
    onDeleteMovie {
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
export const onCreateMovieReaction = /* GraphQL */ `
  subscription OnCreateMovieReaction($owner: String) {
    onCreateMovieReaction(owner: $owner) {
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
export const onUpdateMovieReaction = /* GraphQL */ `
  subscription OnUpdateMovieReaction($owner: String) {
    onUpdateMovieReaction(owner: $owner) {
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
export const onDeleteMovieReaction = /* GraphQL */ `
  subscription OnDeleteMovieReaction($owner: String) {
    onDeleteMovieReaction(owner: $owner) {
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
