$(function (){
  tickNow = 0;
  stageSelected = 0;
  counterNum = 3;
  levelStartTick = 0;
  nodeNow = 0;
  keypress = {};
  gameStarted = false;
  levelStarted = false;
  pSpeed = 0;
  magnetUsed = [0, 0]
  keyToggle = [0, 0, 0, 0];
  playerX = 0;
  playerY = 0;
  thisLevelData = 0;
  lStart = 0;
  aChunk = [];
  pScore = 0;
  levelInter1 = 0;
  levelInter2 = 0;
  timeNow = new Date().getTime();
  lastTick = new Date().getTime();

  $(document).keydown(function(e){
  	keypress[e.which.toString()] = true;
  });
  $(document).keyup(function(e){
  	keypress[e.which.toString()] = false;
  });

  function pushArrayBy(arr, num) {
    newArr = [];
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[(num+i)%arr.length]);
    }
    return newArr;
  }
  function thingsPositionSet() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    $('#levelBlocks').css('margin-left', (screenWidth/2-(screenHeight/10+10)*4.5) + 'px');
    $('.stageBlock').css({height: (screenHeight/10+10) + 'px', width: (screenHeight/10+10) + 'px', 'background-size': (screenHeight/10+10) + 'px ' + (screenHeight/10+10) + 'px'});
  }

  function markStage() {
    for (var i = 0; i < 81; i++) {
      $('.stageBlcokImg:eq(' + i + ')').removeClass('stageLocked').removeClass('stageOpened').removeClass('stageCompeleted').removeClass('perfectCompeleted').removeClass('speedCompeleted').removeClass('masterCompeleted').addClass(((levelOpened[i] == 5) ? 'masterCompeleted' : ((levelOpened[i] == 4) ? 'speedCompeleted' : ((levelOpened[i] == 3) ? 'perfectCompeleted' : ((levelOpened[i] == 2) ? 'stageCompeleted' : ((levelOpened[i] == 1) ? 'stageOpened' : 'stageLocked' )) ))));
      $('.stageBlock:eq(' + i + ')').css('background-image', 'url(Image/Bridge/' + ((levelOpened[i-9] >= 1 && i > 8 && levelOpened[i] >= 1) ? '1' : '0') + ((levelOpened[i+1] >= 1 && i%9 != 8 && levelOpened[i] >= 1) ? '1' : '0') + ((levelOpened[i+9] >= 1 && i < 72 && levelOpened[i] >= 1) ? '1' : '0') + ((levelOpened[i-1] >= 1 && i%9 != 0 && levelOpened[i] >= 1) ? '1' : '0') + '.png)');
      ((leverPointer[i] == 0) ? $('.stageBlock:eq(' + i + ')').css('opacity', '0') : 0 );
      if (levelOpened[i] >= 1) {
        $('.stageBlcokImg:eq(' + i + ')').css('background-image', 'url(Image/Stage/' + Number(leverPointer[i]) + '.png)')
      }
    }
  }
  function openDialog() {
    $('#levelDialog').show();
    $('#levelDialogBg').show();
    $('#levelDialogName').html(function (index,html) {
      return 'Stage ' + stageSelected + ' - ' + stageName[stageSelected-1];
    });
  }
  function closeDialog() {
    $('#levelDialog').hide();
    $('#levelDialogBg').hide();
  }

  function levelStart(levelNow) {
    closeDialog();
    playerKeyShift = [0, 0, 0, 0];
    levelNow--;
    thisLevelData = levelData[levelNow];
    lStart = new Date().getTime();
    setMapArr();
    renderLevel();
    $('#gameTopLayer > span:eq(0)').html(function (index,html) {
      return 'Stage - ' + (levelNow+1);
    });
    $('#gameTopLayer > span:eq(1)').html(function (index,html) {
      return stageName[levelNow] + ' / ' + lBPM + ' BPM';
    });
    playerY = 5;
    pScore = 100;
    for (var i = 0; i < 4; i++) {
      setTimeout ( function () {
        counterNum--;
        $('#counter').html(function (index,html) {
          return counterNum;
        });
        if (counterNum == -1) {
          $('#counter').hide();
          lStart = new Date().getTime();
        }
      }, 500*(i+1));
    }
    setTimeout( function () {
      // set Nodes moving & vars
      tLast = new Date().getTime();
      $.keyframe.define([{
  	    name: 'goLeft',
        from: {
          'transform' : 'translateX(0)'
        },
        to: {
          'transform' : 'translateX(-' + 6.6666*thisLevelData[0][2] + 'vh)'
        }
      }]);
      $('#innerNode').playKeyframe (
        'goLeft ' + thisLevelData[0][2]/(lBPM/60) + 's linear infinite',
      );
      pSpeed = 0;
      renderLevel();
      // game loop
      levelInter1 = setInterval( function () {
        setLevelVar();
        tGain = (tNow-tLast)/1000;
        playerMove();
        playerCollision();
        $('#gameTopLayer > span:eq(2)').html(function (index,html) {
          return pScore.toFixed(2) + '%';
        });
        tLast = tNow;
        if (fNode > thisLevelData[1].length+thisLevelData[0][1]) {
          levelCompelete(levelNow);
        }
      }, 15);
      // render level
      levelInter2 = setInterval( function () {
        renderLevel();
      }, thisLevelData[0][2]/(lBPM/60)*1000);
    }, 2000);
    /*
    linePerNode = levelData[levelNow][0][2];
    maxNode = Math.floor(50/linePerNode);
    for (var i = thisLevelData[0][1]; i < maxNode+1; i++) {
      pushedChunk = pushArrayBy(chunkGens[linePerNode-1][thisLevelData[1][i-thisLevelData[0][1]][0]], thisLevelData[1][i][1]*linePerNode);
      for (var j = 0; j < linePerNode*9; j++) {
        indexThis = ((j%9*linePerNode)+Math.floor(j/9))+i*linePerNode*9;
        $('.block:eq(' + (j+i*linePerNode*9) + ')').addClass('block' + (pushedChunk[((j%9*linePerNode)+Math.floor(j/9))]));
      }
    }
    for (var i = 0; i < 4; i++) {
      setTimeout ( function () {
        counterNum--;
        $('#counter').html(function (index,html) {
          return counterNum;
        });
        if (counterNum == -1) {
          $('#counter').hide();
          timeNow = new Date().getTime();
          levelStartTick = timeNow;
        }
      }, 500*i);
    }
    playerY = 5;
    setTimeout( function (){
      gameLoop = setInterval (function () {
        timeNow = new Date().getTime();
        timeSpent = (timeNow-levelStartTick)/1000;
        timeGain = (timeNow-lastTick)/1000;
        lNode = timeSpent/60*thisLevelData[0][0]/thisLevelData[0][2];
        fNode = Math.floor(lNode);
        beatSpent = Math.floor(lNode*linePerNode);
        playerX = lNode*linePerNode;
        playerY = Math.floor((playerY-pSpeed/(1.5**(timeGain*300))*3)*1000)/1000;
        pSpeed = Math.floor((pSpeed-pSpeed/(1.5**(timeGain*300)))*1000)/1000;
        if (playerY < 0 && pSpeed > 0) {
          pSpeed = -0.7;
        } else if (playerY > 9 && pSpeed < 0) {
          pSpeed = 0.45;
        }
        if ((pSpeed > 0 && pSpeed <= 0.01) || (pSpeed < 0 && pSpeed >= -0.01)) {
          playerY = Math.round(playerY);
          pSpeed = 0;
        }
        screenHeight = $(window).height();
        $('.node').each(function(index) {
          $(this).css('left', (6.6666*((index)%50)-thisLevelData[0][0]*timeSpent/10) + 'vh');
        });
        $('#player').css('top', (1.3333+playerY*6.6666) + 'vh');
        cChunk = [];
        for (var i = 0; i < 3; i++) {
          cChunkO = [];
          chunkNumO = Math.floor(i-thisLevelData[0][1]-1+lNode-1/thisLevelData[0][2]);
          if (0 <= chunkNumO) {
            chunkScan = thisLevelData[1][chunkNumO];
            cChunkO = pushArrayBy(chunkGens[linePerNode-1][chunkScan[0]], linePerNode*chunkScan[1]);
          } else {
            for (var j = 0; j < linePerNode*9; j++) {
              cChunkO.push(0);
            }
          }
          for (var j = 0; j < linePerNode*9; j++) {
            cChunk.push(cChunkO[(j%9)*thisLevelData[0][2]+Math.floor(j/9)]);
          }
        }
        $('#gameTopLayer > span:eq(1)').html(function (index,html) {
          return cChunk;
        });
        lastTick = timeNow;
      }, 15);
    }, 1500);
    */
  }
  function setLevelVar() {
    tNow = new Date().getTime();
    tSpent = (tNow-lStart)/1000;
    lBPN = thisLevelData[0][2];
    lBPM = thisLevelData[0][0];
    lNode = thisLevelData[0][1]+thisLevelData[1].length;
    tBeat = lBPM/60*tSpent;
    tNode = tBeat/thisLevelData[0][2];
    fBeat = Math.floor(tBeat);
    fNode = Math.floor(tNode);
    f2Node = Math.floor(tNode+0.5);
    mNode = Math.floor(50/thisLevelData[0][2]);
  }
  function setMapArr() {
    setLevelVar();
    // make arr to render & player collision
    aChunk = [];
    for (var i = 0; i < thisLevelData[0][1]+thisLevelData[1].length+35; i++) {
      if (i == 0) {
        // start fill node
        for (var j = 0; j < 36; j++) {
          aChunk.push(0);
        }
      } else if (i < thisLevelData[0][1]) {
        // offset node
        for (var j = 0; j < 9*lBPN; j++) {
          aChunk.push(0);
        }
      } else if (i < thisLevelData[1].length+thisLevelData[0][1]) {
        // main node
        pushedArr = pushArrayBy(chunkGens[lBPN-1][thisLevelData[1][i-thisLevelData[0][1]][0]], lBPN*thisLevelData[1][i-thisLevelData[0][1]][1]);
        for (var j = 0; j < 9*lBPN; j++) {
          aChunk.push(pushedArr[(j%9)*lBPN+Math.floor(j/9)]);
        }
      } else {
        // end fill node
        for (var j = 0; j < 9*lBPN; j++) {
          aChunk.push(0);
        }
      }
    }
  }
  function renderLevel() {
    setLevelVar();
    $('.block').removeClass('block1');
    for (var i = 0; i < 450; i++) {
      if (aChunk[9*lBPN*f2Node-36+i] == 1) {
        $('.block:eq(' + i + ')').addClass('block1');
      }
    }
  }
  function playerMove() {
    playerY = Math.floor((playerY-pSpeed/(1.5**(tGain*200))*3)*1000)/1000;
    pSpeed = Math.floor((pSpeed-pSpeed/(1.5**(tGain*200)))*1000)/1000;
    if (playerY < 0 && pSpeed > 0) {
      pSpeed = -0.7;
    } else if (playerY > 9 && pSpeed < 0) {
      pSpeed = 0.45;
    }
    if ((pSpeed > 0 && pSpeed <= 0.005) || (pSpeed < 0 && pSpeed >= -0.005)) {
      playerY = Math.round(playerY);
      pSpeed = 0;
    }
    $('#player').css('top', (1.3333+playerY*6.6666) + 'vh');
  }
  function playerCollision() {
    if ((aChunk[9*Math.ceil(tBeat+1)-9+Math.ceil(playerY)] == 1 || aChunk[9*Math.floor(tBeat+1)-9+Math.ceil(playerY)] == 1) && (0 < playerY && playerY < 9)) {
      pScore -= 100*tGain/Math.sqrt(thisLevelData[1].length);
    }
    if (pScore < 0) {
      pScore = 0;
      levelFail();
    }
  }
  function levelFail() {
    $.keyframe.define([{
      name: 'gameOver',
      from: {
        'filter' : 'brightness(1)'
      },
      '20%': {
        'filter' : 'brightness(1)'
      },
      to: {
        'filter' : 'brightness(0)'
      }
    }]);
    $('#mainGameScreen').playKeyframe (
      'gameOver 1s ease forwards',
    );
    setTimeout( function () {
      $('#mainGameScreen').attr({
        'style' : 'animation: goGone 1.5s linear forwards, gameOver 1s ease forwards;'
      });
      setTimeout( function (){
        $('#mainGameScreen').hide();
        $('#gameLoading').show();
        $('#gameLoading').attr({
          'style' : 'animation: goApper 1.5s linear forwards;'
        });
        setTimeout( function (){
          $('#gameLoading').attr({
            'style' : 'animation: goGone 1.5s linear forwards;'
          });
          setTimeout( function (){
            $('#gameLoading').hide();
            $('#gameLevelSelect').show();
            $('#gameLevelSelect').attr({
              'style' : 'animation: goApper 1.5s linear forwards;'
            });
          }, 1700);
        }, 2500);
      }, 1700);
    }, 1000);
    levelEnd();
  }
  function levelCompelete(lNow) {
    lNow++;
    console.log(lNow);
    for (var i = 0; i < leverPointer.length; i++) {
      if (lNow == leverPointer[i]) {
        levelOpened[i] = 2;
      } else if ((lNow+1) == leverPointer[i]) {
        levelOpened[i] = 1;
      }
    }
    $.keyframe.define([{
      name: 'gameOver',
      from: {
        'filter' : 'brightness(1)'
      },
      '20%': {
        'filter' : 'brightness(1)'
      },
      to: {
        'filter' : 'brightness(1.5)'
      }
    }]);
    $('#mainGameScreen').playKeyframe (
      'gameOver 3s ease forwards',
    );
    setTimeout( function () {
      $('#mainGameScreen').attr({
        'style' : 'animation: goGone 1.5s linear forwards, gameOver 1s ease forwards;'
      });
      setTimeout( function (){
        $('#mainGameScreen').hide();
        $('#gameLoading').show();
        $('#gameLoading').attr({
          'style' : 'animation: goApper 1.5s linear forwards;'
        });
        setTimeout( function (){
          $('#gameLoading').attr({
            'style' : 'animation: goGone 1.5s linear forwards;'
          });
          setTimeout( function (){
            $('#gameLoading').hide();
            $('#gameLevelSelect').show();
            $('#gameLevelSelect').attr({
              'style' : 'animation: goApper 1.5s linear forwards;'
            });
          }, 1700);
        }, 2500);
      }, 1700);
    }, 3000);
    markStage();
    levelEnd();
  }
  function levelEnd() {
    clearInterval(levelInter1);
    clearInterval(levelInter2);
    levelStarted = false;
  }

  setInterval( function () {
    if (keypress[38] && !keyToggle[0]) {
      pSpeed++;
      keyToggle[0]++;
    } else if (!keypress[38]) {
      keyToggle[0] = 0;
    }
    if (keypress[40] && !keyToggle[1]) {
      pSpeed--;
      keyToggle[1]++;
    } else if (!keypress[40]) {
      keyToggle[1] = 0;
    }
  }, 10);
  setInterval( function () {
    animateProgress = (tickNow%120)/120;
    tickNow++;
  }, 33);
  setInterval( function () {
    /* $('#gameLevelSelect').css('background-image', 'url(http://api.thumbr.it/whitenoise-361x370.png?background=2b2b2bff&noise=525252&density=' + ((tickNow%17)/5+21) + '&opacity=55)'); */
    thingsPositionSet();
  }, 200);

  $(document).on('click','#startButton',function() {
    if (!gameStarted) {
      audio = new Audio('sound/play button.mp3');
      audio.play();
      audio = new Audio('sound/main.mp3');
      backgroundSound = setInterval( function (){
        /* audio.play(); */
      }, 3000);
      gameStarted = true;
      $('#gameMainScreen').attr({
        'style' : 'animation: backgroundMove 10s linear infinite, goGone 1.5s linear forwards;'
      });
      setTimeout( function (){
        $('#gameMainScreen').hide();
        $('#gameLoading').show();
        $('#gameLoading').attr({
          'style' : 'animation: goApper 1.5s linear forwards;'
        });
        setTimeout( function (){
          $('#gameLoading').attr({
            'style' : 'animation: goGone 1.5s linear forwards;'
          });
          setTimeout( function (){
            $('#gameLoading').hide();
            $('#gameLevelSelect').show();
            $('#gameLevelSelect').attr({
              'style' : 'animation: goApper 1.5s linear forwards;'
            });
          }, 1700);
        }, 2500);
      }, 1700);
      /* clearTimeout(backgroundSound); */
    }
  });
  $(document).on('click','.stageBlcokImg',function() {
    indexThis = $('.stageBlcokImg').index(this);
    stageSelected = leverPointer[indexThis];
    if (levelOpened[indexThis] >= 1) {
      openDialog();
    }
  });
  $(document).on('click','#closeDialog',function() {
    stageSelected = 0;
    closeDialog();
  });
  $(document).on('click','#stageStartButton',function() {
    counterNum = 3;
    $('#counter').html(function (index,html) {
      return '3';
    });
    if (!levelStarted) {
      $('#gameLevelSelect').attr({
        'style' : 'animation: goGone 1.5s linear forwards;'
      });
      setTimeout( function (){
        $('#gameLevelSelect').hide();
        $('#gameLoading').show();
        $('#gameLoading').attr({
          'style' : 'animation: goApper 1.5s linear forwards;'
        });
        setTimeout( function (){
          $('#gameLoading').attr({
            'style' : 'animation: goGone 1.5s linear forwards;'
          });
          setTimeout( function (){
            $('#gameLoading').hide();
            $('#mainGameScreen').show();
            $('#mainGameScreen').attr({
              'style' : 'animation: goApper .5s linear forwards;'
            });
            setTimeout( function (){
              $('#counter').show();
              levelStart(stageSelected);
            }, 500);
          }, 1700);
        }, 2500);
      }, 1700);
    }
    levelStarted = true;
  });

  for (var i = 0; i < 9; i++) {
    $('<div>').addClass('stageLine').appendTo('#levelBlocks');
  }
  for (var i = 0; i < 81; i++) {
    $('<span>').addClass('stageBlcok' + i).addClass('stageBlock').appendTo('.stageLine:eq(' + Math.floor(i/9) + ')');
    $('<div>').addClass('stageBlcokImg').appendTo('.stageBlcok' + i);
  }
  for (var i = 0; i < 50; i++) {
    $('<span>').addClass('node').addClass('node' + i).css('left', (6.6666*i) + 'vh').appendTo('#innerNode');
    for (var j = 0; j < 9; j++) {
      $('<div>').addClass('block').appendTo('.node' + i);
    }
  }
  markStage();
});
