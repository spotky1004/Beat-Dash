$(function (){
  tickNow = 0;
  gameStarted = false;

  function markStage() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    $('#levelBlocks').css('margin-left', (screenWidth/2-(screenHeight/10+10)*4.5) + 'px');
    $('.stageBlock').css({height: (screenHeight/10+10) + 'px', width: (screenHeight/10+10) + 'px', 'background-size': (screenHeight/10+10) + 'px ' + (screenHeight/10+10) + 'px'})
    for (var i = 0; i < 81; i++) {
      $('.stageBlcokImg:eq(' + i + ')').removeClass('stageLocked').removeClass('stageOpened').removeClass('stageCompeleted').removeClass('perfectCompeleted').removeClass('speedCompeleted').removeClass('masterCompeleted').addClass(((levelOpened[i] == 5) ? 'masterCompeleted' : ((levelOpened[i] == 4) ? 'speedCompeleted' : ((levelOpened[i] == 3) ? 'perfectCompeleted' : ((levelOpened[i] == 2) ? 'stageCompeleted' : ((levelOpened[i] == 1) ? 'stageOpened' : 'stageLocked' )) ))));
      $('.stageBlock:eq(' + i + ')').css('background-image', 'url(Image/Bridge/' + ((levelOpened[i-9] >= 1 && i > 8 && levelOpened[i] >= 1) ? '1' : '0') + ((levelOpened[i+1] >= 1 && i%9 != 8 && levelOpened[i] >= 1) ? '1' : '0') + ((levelOpened[i+9] >= 1 && i < 72 && levelOpened[i] >= 1) ? '1' : '0') + ((levelOpened[i-1] >= 1 && i%9 != 0 && levelOpened[i] >= 1) ? '1' : '0') + '.png)');
      ((leverPointer[i] == 0) ? $('.stageBlock:eq(' + i + ')').css('opacity', '0') : 0 );
    }
  }

  setInterval( function () {
    animateProgress = (tickNow%120)/120;
    tickNow++;
  }, 33);
  setInterval( function () {
    $('#gameLevelSelect').css('background-image', 'url(https://api.thumbr.it/whitenoise-361x370.png?background=2b2b2bff&noise=525252&density=' + ((tickNow%17)/5+21) + '&opacity=55)');
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

  for (var i = 0; i < 9; i++) {
    $('<div>').addClass('stageLine').appendTo('#levelBlocks');
  }
  for (var i = 0; i < 81; i++) {
    $('<span>').addClass('stageBlcok' + i).addClass('stageBlock').appendTo('.stageLine:eq(' + Math.floor(i/9) + ')');
    $('<div>').addClass('stageBlcokImg').appendTo('.stageBlcok' + i);
  }
  markStage();
});
