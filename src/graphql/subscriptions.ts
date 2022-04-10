/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateConnectionRequest = /* GraphQL */ `
  subscription OnCreateConnectionRequest($sender: String, $receiver: String) {
    onCreateConnectionRequest(sender: $sender, receiver: $receiver) {
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
export const onUpdateConnectionRequest = /* GraphQL */ `
  subscription OnUpdateConnectionRequest($sender: String, $receiver: String) {
    onUpdateConnectionRequest(sender: $sender, receiver: $receiver) {
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
export const onDeleteConnectionRequest = /* GraphQL */ `
  subscription OnDeleteConnectionRequest($sender: String, $receiver: String) {
    onDeleteConnectionRequest(sender: $sender, receiver: $receiver) {
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
export const onCreateMovie = /* GraphQL */ `
  subscription OnCreateMovie {
    onCreateMovie {
      id
      identifier
      createdAt
      name
      coverUri
      rating
      ratingCount
      description
      categories
      trailerUri
      updatedAt
      owner
    }
  }
`;
export const onUpdateMovie = /* GraphQL */ `
  subscription OnUpdateMovie {
    onUpdateMovie {
      id
      identifier
      createdAt
      name
      coverUri
      rating
      ratingCount
      description
      categories
      trailerUri
      updatedAt
      owner
    }
  }
`;
export const onDeleteMovie = /* GraphQL */ `
  subscription OnDeleteMovie {
    onDeleteMovie {
      id
      identifier
      createdAt
      name
      coverUri
      rating
      ratingCount
      description
      categories
      trailerUri
      updatedAt
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
        identifier
        createdAt
        name
        coverUri
        rating
        ratingCount
        description
        categories
        trailerUri
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
export const onUpdateMovieReaction = /* GraphQL */ `
  subscription OnUpdateMovieReaction($owner: String) {
    onUpdateMovieReaction(owner: $owner) {
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
        categories
        trailerUri
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
export const onDeleteMovieReaction = /* GraphQL */ `
  subscription OnDeleteMovieReaction($owner: String) {
    onDeleteMovieReaction(owner: $owner) {
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
        categories
        trailerUri
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
