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
    playerKeyShift = [0, 0, 0, 0];
    levelNow--;
    thisLevelData = levelData[levelNow];
    $('#gameTopLayer > span:eq(0)').html(function (index,html) {
      return 'Stage - ' + (levelNow+1);
    });
    $('#gameTopLayer > span:eq(1)').html(function (index,html) {
      return stageName[levelNow] + ' / ' + thisLevelData[0][0] + ' BPM';
    });
    linePerNode = levelData[levelNow][0][2];
    maxNode = Math.floor(50/linePerNode);
    for (var i = thisLevelData[0][1][0]; i < maxNode+1; i++) {
      pushedChunk = pushArrayBy(chunkGens[linePerNode-1][thisLevelData[1][i-thisLevelData[0][1][0]][0]], thisLevelData[1][i][1]*linePerNode);
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
          chunkNumO = Math.floor(i-thisLevelData[0][1][0]-1+lNode-1/thisLevelData[0][2]);
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
      audio = new Audio('Song/play button.mp3');
      audio.play();
      audio = new Audio('Song/main.mp3');
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
    $('<span>').addClass('node').addClass('node' + i).css('left', (6.6666*i) + 'vh').appendTo('#gameNode');
    for (var j = 0; j < 9; j++) {
      $('<div>').addClass('block').appendTo('.node' + i);
    }
  }
  markStage();
});
