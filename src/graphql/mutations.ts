/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createConnectionRequest = /* GraphQL */ `
  mutation CreateConnectionRequest(
    $input: CreateConnectionRequestInput!
    $condition: ModelConnectionRequestConditionInput
  ) {
    createConnectionRequest(input: $input, condition: $condition) {
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
export const updateConnectionRequest = /* GraphQL */ `
  mutation UpdateConnectionRequest(
    $input: UpdateConnectionRequestInput!
    $condition: ModelConnectionRequestConditionInput
  ) {
    updateConnectionRequest(input: $input, condition: $condition) {
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
export const deleteConnectionRequest = /* GraphQL */ `
  mutation DeleteConnectionRequest(
    $input: DeleteConnectionRequestInput!
    $condition: ModelConnectionRequestConditionInput
  ) {
    deleteConnectionRequest(input: $input, condition: $condition) {
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
export const createMovie = /* GraphQL */ `
  mutation CreateMovie(
    $input: CreateMovieInput!
    $condition: ModelMovieConditionInput
  ) {
    createMovie(input: $input, condition: $condition) {
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
export const updateMovie = /* GraphQL */ `
  mutation UpdateMovie(
    $input: UpdateMovieInput!
    $condition: ModelMovieConditionInput
  ) {
    updateMovie(input: $input, condition: $condition) {
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
export const deleteMovie = /* GraphQL */ `
  mutation DeleteMovie(
    $input: DeleteMovieInput!
    $condition: ModelMovieConditionInput
  ) {
    deleteMovie(input: $input, condition: $condition) {
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
export const createMovieReaction = /* GraphQL */ `
  mutation CreateMovieReaction(
    $input: CreateMovieReactionInput!
    $condition: ModelMovieReactionConditionInput
  ) {
    createMovieReaction(input: $input, condition: $condition) {
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
export const updateMovieReaction = /* GraphQL */ `
  mutation UpdateMovieReaction(
    $input: UpdateMovieReactionInput!
    $condition: ModelMovieReactionConditionInput
  ) {
    updateMovieReaction(input: $input, condition: $condition) {
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
export const deleteMovieReaction = /* GraphQL */ `
  mutation DeleteMovieReaction(
    $input: DeleteMovieReactionInput!
    $condition: ModelMovieReactionConditionInput
  ) {
    deleteMovieReaction(input: $input, condition: $condition) {
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
export const acceptRequest = /* GraphQL */ `
  mutation AcceptRequest($input: AcceptRequestInput!) {
    acceptRequest(input: $input)
  }
`;
