"use strict";
exports.__esModule = true;
exports.onDeleteMovieReaction = exports.onUpdateMovieReaction = exports.onCreateMovieReaction = exports.onDeleteMovie = exports.onUpdateMovie = exports.onCreateMovie = exports.onDeleteConnectionRequest = exports.onUpdateConnectionRequest = exports.onCreateConnectionRequest = void 0;
exports.onCreateConnectionRequest = "\n  subscription OnCreateConnectionRequest($sender: String, $receiver: String) {\n    onCreateConnectionRequest(sender: $sender, receiver: $receiver) {\n      id\n      sender\n      receiver\n      status\n      createdAt\n      updatedAt\n      userRequestsId\n    }\n  }\n";
exports.onUpdateConnectionRequest = "\n  subscription OnUpdateConnectionRequest($sender: String, $receiver: String) {\n    onUpdateConnectionRequest(sender: $sender, receiver: $receiver) {\n      id\n      sender\n      receiver\n      status\n      createdAt\n      updatedAt\n      userRequestsId\n    }\n  }\n";
exports.onDeleteConnectionRequest = "\n  subscription OnDeleteConnectionRequest($sender: String, $receiver: String) {\n    onDeleteConnectionRequest(sender: $sender, receiver: $receiver) {\n      id\n      sender\n      receiver\n      status\n      createdAt\n      updatedAt\n      userRequestsId\n    }\n  }\n";
exports.onCreateMovie = "\n  subscription OnCreateMovie {\n    onCreateMovie {\n      id\n      identifier\n      createdAt\n      name\n      coverUri\n      rating\n      ratingCount\n      description\n      categories\n      trailerUri\n      updatedAt\n      owner\n    }\n  }\n";
exports.onUpdateMovie = "\n  subscription OnUpdateMovie {\n    onUpdateMovie {\n      id\n      identifier\n      createdAt\n      name\n      coverUri\n      rating\n      ratingCount\n      description\n      categories\n      trailerUri\n      updatedAt\n      owner\n    }\n  }\n";
exports.onDeleteMovie = "\n  subscription OnDeleteMovie {\n    onDeleteMovie {\n      id\n      identifier\n      createdAt\n      name\n      coverUri\n      rating\n      ratingCount\n      description\n      categories\n      trailerUri\n      updatedAt\n      owner\n    }\n  }\n";
exports.onCreateMovieReaction = "\n  subscription OnCreateMovieReaction($owner: String) {\n    onCreateMovieReaction(owner: $owner) {\n      id\n      movie {\n        id\n        identifier\n        createdAt\n        name\n        coverUri\n        rating\n        ratingCount\n        description\n        categories\n        trailerUri\n        updatedAt\n        owner\n      }\n      createdAt\n      reaction\n      updatedAt\n      userMovieReactionsId\n      movieReactionMovieId\n      owner\n    }\n  }\n";
exports.onUpdateMovieReaction = "\n  subscription OnUpdateMovieReaction($owner: String) {\n    onUpdateMovieReaction(owner: $owner) {\n      id\n      movie {\n        id\n        identifier\n        createdAt\n        name\n        coverUri\n        rating\n        ratingCount\n        description\n        categories\n        trailerUri\n        updatedAt\n        owner\n      }\n      createdAt\n      reaction\n      updatedAt\n      userMovieReactionsId\n      movieReactionMovieId\n      owner\n    }\n  }\n";
exports.onDeleteMovieReaction = "\n  subscription OnDeleteMovieReaction($owner: String) {\n    onDeleteMovieReaction(owner: $owner) {\n      id\n      movie {\n        id\n        identifier\n        createdAt\n        name\n        coverUri\n        rating\n        ratingCount\n        description\n        categories\n        trailerUri\n        updatedAt\n        owner\n      }\n      createdAt\n      reaction\n      updatedAt\n      userMovieReactionsId\n      movieReactionMovieId\n      owner\n    }\n  }\n";
