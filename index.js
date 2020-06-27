$(function (){
  tickNow = 0;
  stageSelected = 0;
  counterNum = 3;
  gameTick = 0;
  gameStarted = false;
  levelStarted = false;

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
  function thingsPositionSet() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    $('#levelBlocks').css('margin-left', (screenWidth/2-(screenHeight/10+10)*4.5) + 'px');
    $('.stageBlock').css({height: (screenHeight/10+10) + 'px', width: (screenHeight/10+10) + 'px', 'background-size': (screenHeight/10+10) + 'px ' + (screenHeight/10+10) + 'px'});
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
  function levelStart() {
    for (var i = 0; i < 3; i++) {
      setTimeout ( function () {
        counterNum--;
        $('#counter').html(function (index,html) {
          return counterNum;
        });
        if (counterNum == 0) {
          $('#counter').hide();
        }
      }, 500*i);
    }
    setTimeout( function (){
      gameTick = 0;
      gameLoop = setInterval (function () {
        gameTick++;
        $('.node').each(function(index) {
          $(this).css('left', (6.6666*index-gameTick) + 'vh')
        });
      }, 50);
    }, (1500+240000*levelData[stageSelected-1][0][1][0]/levelData[stageSelected-1][0][0]));
  }

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
              levelStart();
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
      $('<div>').addClass('block').addClass('block1').addClass('block' + i + 'x' + j).appendTo('.node' + i);
    }
  }
  markStage();
});
