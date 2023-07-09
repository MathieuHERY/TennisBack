exports.drawScore = (matchDescription,players) => {
    let matchParams = {
      matchScore: [
        [0, 0]
      ],
      pointPerGame: [0, 0],
      translatePointPerGame: [0, 0],
      tieBreak: false,
      sets: [0, 0],
      setIndex: 0,
      winner: null,
      scoreCalc: false,
    };
  
    matchParams = {
      ...matchParams,
      ...{
        matchDescription: matchDescription
      },
      ...{
        players: players
      }
    };
  
  
    for (let i = 0; i < matchParams.matchDescription.length; i++) {
      if (matchParams.winner === null) {
  
        // on calcul qui a gagné le point
  
        const result = drawPoint(matchParams.matchDescription[i], matchParams);
  
        // on récupère l'index du player qui mène au nombre de points dans le jeu en cours dans le set en cours
  
        const playerLeadingPoint = result.pointPerGame.indexOf(
          Math.max(...result.pointPerGame)
        );
  
        // on récupère l'index du player qui mène au nombre de jeux dans le set en cours
  
        const playerLeadingSet = result.matchScore[
          result.setIndex
        ].indexOf(Math.max(...result.matchScore[result.setIndex]));
  
        result.scoreCalc = true;
  
        if (result.tieBreak) {
  
          // on vérifie le nombre de points gagnés dans le tie-break
  
          drawTieBreak(playerLeadingPoint, result);
  
        } else {
  
          //on vérifie si le jeu est remporté par le player ayant le plus de points dans le jeu en cours
  
         updateGame(playerLeadingPoint, result);
          
        }
  
        drawSet(playerLeadingSet, result);
  
        // on vérifie si le match est remporté par le player qui mène au nombre de sets gagnés
  
        const winner = drawWinner(playerLeadingSet, result);
        matchParams = winner
  
      }
    }
    return matchParams;
  }
  
  // on incrémente le point gagné par le player dans le jeu en cours
  
  function drawPoint(point, matchParams) {
    for (let x = 0; x < matchParams.players.length; x++) {
      if (point.userWinner === matchParams.players[x].name) {
        matchParams.pointPerGame[x] =
          matchParams.pointPerGame[x] + 1;
      }
    }
    
    const translatedPoint = translatePoint(matchParams)
    return translatedPoint
  }
  
  
  // traduction des points du jeu en cours selon la nomenclature du score du tennis
  
  function translatePoint(matchParams) {
    const playerLeadingPoint = matchParams.pointPerGame.indexOf(
      Math.max(...matchParams.pointPerGame)
    );
    const leader = matchParams.pointPerGame[playerLeadingPoint]
    if(leader <= 3){
      for (let i = 0; i < matchParams.pointPerGame.length; i++) {
        switch (matchParams.pointPerGame[i]) {
          case 0:
            matchParams.translatePointPerGame[i] = "0";
            break;
          case 1:
            matchParams.translatePointPerGame[i] = "15";
            break;
          case 2:
            matchParams.translatePointPerGame[i] = "30";
            break;
          case 3:
            matchParams.translatePointPerGame[i] = "40";
            break;
          default:
            matchParams.translatePointPerGame[i] = "0";
        }
      }} else {
        const playerLoosingPoint = matchParams.pointPerGame.indexOf(
          Math.min(...matchParams.pointPerGame)
        );
        const looser = matchParams.pointPerGame[playerLoosingPoint]
        if (leader === looser) {
          matchParams.translatePointPerGame = ["40", "40"]
        } else {
          matchParams.translatePointPerGame[playerLeadingPoint] = "AV";
          matchParams.translatePointPerGame[playerLoosingPoint] = "-";
        }
      }
      return matchParams
    }
    
  
  // on vérifie si le jeu est remporté par le player ayant le plus de points dans le jeu en cours
  
  function updateGame(playerLeadingPoint, matchParams) {
    if (
      matchParams.pointPerGame[playerLeadingPoint] >= 4 &&
      Math.abs(matchParams.pointPerGame[0] - matchParams.pointPerGame[1]) >= 2
    ) {
      const score = updateScore(playerLeadingPoint, matchParams);
      matchParams = score
    }
    return matchParams
  }
  
  function drawTieBreak(playerLeading, matchParams) {
    if (
      matchParams.pointPerGame[playerLeading] >= 7 &&
      Math.abs(matchParams.pointPerGame[0] - matchParams.pointPerGame[1]) >= 2
    ) {
      updateScore(playerLeading, matchParams);
    }
  }
  
  // on incrémente le nombre de jeux gagnés par le player qui a gagné le jeu précédent et on réinitialise les points du prochain jeu
  
  function updateScore(playerLeading, matchParams) {
    matchParams.matchScore[matchParams.setIndex][playerLeading] =
      matchParams.matchScore[matchParams.setIndex][playerLeading] + 1;
    matchParams.pointPerGame = [0, 0];
    matchParams.translatePointPerGame = [0, 0];
    return matchParams
  }
  
  // on incrémente le nombre de sets gagnés par le player qui a gagné le set précédent et on réinitialise le nombre de jeux du prochain set
  
  function updateSet(playerLeading,matchParams ) {
    matchParams.matchScore.push([0, 0]);
    matchParams.sets[playerLeading] = matchParams.sets[playerLeading] + 1;
    matchParams.setIndex = matchParams.setIndex + 1;
    return matchParams
  }
  
  // on vérifie si le set est remporté par le player ayant le plus de jeux dans le set en cours
  
  function drawSet(playerLeading, matchParams) {
    if (matchParams.tieBreak) {
      if (
        matchParams.matchScore[matchParams.setIndex][playerLeading] >= 6 &&
        Math.abs(
          matchParams.matchScore[matchParams.setIndex][0] -
            matchParams.matchScore[matchParams.setIndex][1]
        ) === 1
      ) {
        matchParams.tieBreak = false;
        updateSet(playerLeading, matchParams);
      }
    } else {
      if (
        matchParams.matchScore[matchParams.setIndex][playerLeading] >= 6 &&
        Math.abs(
          matchParams.matchScore[matchParams.setIndex][0] -
            matchParams.matchScore[matchParams.setIndex][1]
        ) >= 2
      ) {
        updateSet(playerLeading, matchParams);
      } else {
        if (
          matchParams.matchScore[matchParams.setIndex][0] === 6 &&
          matchParams.matchScore[matchParams.setIndex][1] === 6
        ) {
          matchParams.tieBreak = true;
        }
      }
    }
    return matchParams
  }
  
  // on vérifie si le player qui mène au nombre de sets gagnés a gagné 3 sets
  
  function drawWinner(playerLeading, matchParams) {
    if (matchParams.sets[playerLeading] === 3 && matchParams.setIndex <= 5) {
      matchParams.matchScore.pop();
      matchParams.winner = matchParams.players[playerLeading].name;
    }
    return matchParams
  }
  
  