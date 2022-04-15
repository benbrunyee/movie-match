"use strict";
exports.__esModule = true;
exports.acceptRequest = exports.deleteMovieReaction = exports.updateMovieReaction = exports.createMovieReaction = exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.deleteConnectionRequest = exports.updateConnectionRequest = exports.createConnectionRequest = exports.deleteUser = exports.updateUser = exports.createUser = void 0;
exports.createUser = "\n  mutation CreateUser(\n    $input: CreateUserInput!\n    $condition: ModelUserConditionInput\n  ) {\n    createUser(input: $input, condition: $condition) {\n      id\n      sub\n      email\n      requests {\n        items {\n          id\n          sender\n          receiver\n          status\n          createdAt\n          updatedAt\n          userRequestsId\n        }\n        nextToken\n      }\n      movieReactions {\n        items {\n          id\n          movie {\n            id\n            identifier\n            createdAt\n            name\n            coverUri\n            rating\n            ratingCount\n            description\n            genres\n            trailerUri\n            updatedAt\n            owner\n          }\n          createdAt\n          reaction\n          updatedAt\n          userMovieReactionsId\n          movieReactionMovieId\n          owner\n        }\n        nextToken\n      }\n      movieMatches\n      searchOptions {\n        region\n        includeAdult\n        releasedAfterYear\n        genres\n      }\n      connectedUser\n      createdAt\n      updatedAt\n      owner\n    }\n  }\n";
exports.updateUser = "\n  mutation UpdateUser(\n    $input: UpdateUserInput!\n    $condition: ModelUserConditionInput\n  ) {\n    updateUser(input: $input, condition: $condition) {\n      id\n      sub\n      email\n      requests {\n        items {\n          id\n          sender\n          receiver\n          status\n          createdAt\n          updatedAt\n          userRequestsId\n        }\n        nextToken\n      }\n      movieReactions {\n        items {\n          id\n          movie {\n            id\n            identifier\n            createdAt\n            name\n            coverUri\n            rating\n            ratingCount\n            description\n            genres\n            trailerUri\n            updatedAt\n            owner\n          }\n          createdAt\n          reaction\n          updatedAt\n          userMovieReactionsId\n          movieReactionMovieId\n          owner\n        }\n        nextToken\n      }\n      movieMatches\n      searchOptions {\n        region\n        includeAdult\n        releasedAfterYear\n        genres\n      }\n      connectedUser\n      createdAt\n      updatedAt\n      owner\n    }\n  }\n";
exports.deleteUser = "\n  mutation DeleteUser(\n    $input: DeleteUserInput!\n    $condition: ModelUserConditionInput\n  ) {\n    deleteUser(input: $input, condition: $condition) {\n      id\n      sub\n      email\n      requests {\n        items {\n          id\n          sender\n          receiver\n          status\n          createdAt\n          updatedAt\n          userRequestsId\n        }\n        nextToken\n      }\n      movieReactions {\n        items {\n          id\n          movie {\n            id\n            identifier\n            createdAt\n            name\n            coverUri\n            rating\n            ratingCount\n            description\n            genres\n            trailerUri\n            updatedAt\n            owner\n          }\n          createdAt\n          reaction\n          updatedAt\n          userMovieReactionsId\n          movieReactionMovieId\n          owner\n        }\n        nextToken\n      }\n      movieMatches\n      searchOptions {\n        region\n        includeAdult\n        releasedAfterYear\n        genres\n      }\n      connectedUser\n      createdAt\n      updatedAt\n      owner\n    }\n  }\n";
exports.createConnectionRequest = "\n  mutation CreateConnectionRequest(\n    $input: CreateConnectionRequestInput!\n    $condition: ModelConnectionRequestConditionInput\n  ) {\n    createConnectionRequest(input: $input, condition: $condition) {\n      id\n      sender\n      receiver\n      status\n      createdAt\n      updatedAt\n      userRequestsId\n    }\n  }\n";
exports.updateConnectionRequest = "\n  mutation UpdateConnectionRequest(\n    $input: UpdateConnectionRequestInput!\n    $condition: ModelConnectionRequestConditionInput\n  ) {\n    updateConnectionRequest(input: $input, condition: $condition) {\n      id\n      sender\n      receiver\n      status\n      createdAt\n      updatedAt\n      userRequestsId\n    }\n  }\n";
exports.deleteConnectionRequest = "\n  mutation DeleteConnectionRequest(\n    $input: DeleteConnectionRequestInput!\n    $condition: ModelConnectionRequestConditionInput\n  ) {\n    deleteConnectionRequest(input: $input, condition: $condition) {\n      id\n      sender\n      receiver\n      status\n      createdAt\n      updatedAt\n      userRequestsId\n    }\n  }\n";
exports.createMovie = "\n  mutation CreateMovie(\n    $input: CreateMovieInput!\n    $condition: ModelMovieConditionInput\n  ) {\n    createMovie(input: $input, condition: $condition) {\n      id\n      identifier\n      createdAt\n      name\n      coverUri\n      rating\n      ratingCount\n      description\n      genres\n      trailerUri\n      updatedAt\n      owner\n    }\n  }\n";
exports.updateMovie = "\n  mutation UpdateMovie(\n    $input: UpdateMovieInput!\n    $condition: ModelMovieConditionInput\n  ) {\n    updateMovie(input: $input, condition: $condition) {\n      id\n      identifier\n      createdAt\n      name\n      coverUri\n      rating\n      ratingCount\n      description\n      genres\n      trailerUri\n      updatedAt\n      owner\n    }\n  }\n";
exports.deleteMovie = "\n  mutation DeleteMovie(\n    $input: DeleteMovieInput!\n    $condition: ModelMovieConditionInput\n  ) {\n    deleteMovie(input: $input, condition: $condition) {\n      id\n      identifier\n      createdAt\n      name\n      coverUri\n      rating\n      ratingCount\n      description\n      genres\n      trailerUri\n      updatedAt\n      owner\n    }\n  }\n";
exports.createMovieReaction = "\n  mutation CreateMovieReaction(\n    $input: CreateMovieReactionInput!\n    $condition: ModelMovieReactionConditionInput\n  ) {\n    createMovieReaction(input: $input, condition: $condition) {\n      id\n      movie {\n        id\n        identifier\n        createdAt\n        name\n        coverUri\n        rating\n        ratingCount\n        description\n        genres\n        trailerUri\n        updatedAt\n        owner\n      }\n      createdAt\n      reaction\n      updatedAt\n      userMovieReactionsId\n      movieReactionMovieId\n      owner\n    }\n  }\n";
exports.updateMovieReaction = "\n  mutation UpdateMovieReaction(\n    $input: UpdateMovieReactionInput!\n    $condition: ModelMovieReactionConditionInput\n  ) {\n    updateMovieReaction(input: $input, condition: $condition) {\n      id\n      movie {\n        id\n        identifier\n        createdAt\n        name\n        coverUri\n        rating\n        ratingCount\n        description\n        genres\n        trailerUri\n        updatedAt\n        owner\n      }\n      createdAt\n      reaction\n      updatedAt\n      userMovieReactionsId\n      movieReactionMovieId\n      owner\n    }\n  }\n";
exports.deleteMovieReaction = "\n  mutation DeleteMovieReaction(\n    $input: DeleteMovieReactionInput!\n    $condition: ModelMovieReactionConditionInput\n  ) {\n    deleteMovieReaction(input: $input, condition: $condition) {\n      id\n      movie {\n        id\n        identifier\n        createdAt\n        name\n        coverUri\n        rating\n        ratingCount\n        description\n        genres\n        trailerUri\n        updatedAt\n        owner\n      }\n      createdAt\n      reaction\n      updatedAt\n      userMovieReactionsId\n      movieReactionMovieId\n      owner\n    }\n  }\n";
exports.acceptRequest = "\n  mutation AcceptRequest($input: AcceptRequestInput!) {\n    acceptRequest(input: $input)\n  }\n";
