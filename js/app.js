$(document).ready(function() {
  var $space = $(".space"),
      $area = $(".area"),
      $points = $("#points").find("span"),
      $pointsEnd = $("#pointsEnd").find("span"),
      $gameOver = $(".game-over"),
      $reload = $("#reload"),
      $invaders,
      moveInterval,
      blastInterval,
      bombInterval,
      invadersMoveInterval,
      invadersMoveDownInterval,
      edgeLeft = false,
      edgeRight = false,
      currentX = 10,
      currentY = 19,
      blastX = currentX,
      blastY = 18,
      bombX = 0,
      bombY = 0,
      shooting = false,
      speed = 50,
      bombSpeed = 75,
      blastSpeed = 50,
      invadersMoveSpeed = 1500,
      allowed = true,
      points = 0;

  // make user
  coordinates(currentX, currentY).addClass("user");

  // make invaders
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j < 16; j++) {
      if (j%2 === 0) {
        var $invaderContent = $("<div>",{"class":"invader-content"});
        coordinates(j, i).addClass("invader")
                          .attr("data-x", j)
                          .attr("data-y", i)
                          .append($invaderContent);
        $invaders = $(".invader");
      }
    }
  }
  // initiate invaders attack
  invaderAttack();

// initiate invaders move
  invadersMovingInterval("right");


  function coordinates(x, y) {
      return $area.eq(x + (y * 20));
  }
  function go(dir) {
    window.clearInterval(moveInterval);
    moveInterval = setInterval(function() {
      coordinates(currentX, currentY).toggleClass("user");
      if (dir === "left" && !edgeLeft) {
        currentX--;
      }
      else if (dir === "right" && !edgeRight) {
        currentX++;
      }
      coordinates(currentX, currentY).toggleClass("user");
      $($space).trigger("moveChanged");
    }, speed);
  }
  function blast() {
    if (!shooting) {
      blastX = currentX;
      coordinates(blastX, blastY).addClass("blast");
      blastInterval = setInterval(function() {
        coordinates(blastX, blastY).toggleClass("blast");
        blastY--;
        coordinates(blastX, blastY).toggleClass("blast");
        $($space).trigger("blastChanged");
      }, blastSpeed);
    }
    shooting = true;
  }
  function invaderAttack() {
    var invader = $invaders[Math.floor(Math.random()*($invaders.length-1))];
    bombX = parseInt($(invader).attr("data-x")),
    bombY = parseInt($(invader).attr("data-y"));
    coordinates(bombX, bombY).addClass("bomb");
    bombInterval = setInterval(function() {
      coordinates(bombX, bombY).toggleClass("bomb");
      bombY++;
      coordinates(bombX, bombY).toggleClass("bomb");
      $($space).trigger("bombChanged");
    }, bombSpeed);
  }
  function die() {
    window.clearInterval(moveInterval);
    window.clearInterval(bombInterval);
    window.clearInterval(blastInterval);
    window.clearInterval(invadersMoveInterval);
    $(document).off("keydown");
    $pointsEnd.text(points);
    $gameOver.slideDown("slow");
  }
  function moveInvaders(direction) {
      switch (direction) {
        case "right":
          $invaders.each(function() {
            var $invaderContent = $("<div>",{"class":"invader-content"}),
                invaderX = $(this).attr("data-x"),
                invaderY = $(this).attr("data-y");
            $(this).toggleClass("invader")
                    .empty();
            invaderX ++;
            coordinates(invaderX, invaderY).toggleClass("invader")
            .attr("data-x", invaderX)
            .attr("data-y", invaderY)
            .append($invaderContent);
          });
          break;
        case "left":
          $invaders.each(function() {
            var $invaderContent = $("<div>",{"class":"invader-content"}),
                invaderX = $(this).attr("data-x"),
                invaderY = $(this).attr("data-y");
            $(this).toggleClass("invader")
                    .empty();
            invaderX --;
            coordinates(invaderX, invaderY).toggleClass("invader")
            .attr("data-x", invaderX)
            .attr("data-y", invaderY)
            .append($invaderContent);
          });
          break;
        case "down":
          $($invaders.get().reverse()).each(function() {
            var $invaderContent = $("<div>",{"class":"invader-content"}),
                invaderX = parseInt($(this).attr("data-x")),
                invaderY = parseInt($(this).attr("data-y"));
            $(this).toggleClass("invader")
                    .empty();
            invaderY ++;
            coordinates(invaderX, invaderY).toggleClass("invader")
            .attr("data-x", invaderX)
            .attr("data-y", invaderY)
            .append($invaderContent);
          });
          break;
        default:
      }
      $invaders = $(".invader");

  }
  function invadersMovingInterval(direction) {
    invadersMoveInterval = setInterval(function() {
      moveInvaders(direction);
      $($space).trigger("invadersPositionChanged");
    }, invadersMoveSpeed);
  }
  $($space).bind("invadersPositionChanged", function() {
    var rightEdge = false,
        leftEdge = false;
    for (var i = 19; i < $(".area").length; i += 20) {
      if ($(".area").eq(i).hasClass("invader")) {
        rightEdge = true;
      }
    }
    for (var i = 0; i < $(".area").length; i += 20) {
      if ($(".area").eq(i).hasClass("invader")) {
        leftEdge = true;
      }
    }
    if($(".user").hasClass("invader")) {
      die();
    }
    if (rightEdge){
      window.clearInterval(invadersMoveInterval);
      setTimeout(function(){moveInvaders("down");},invadersMoveSpeed);
      setTimeout(function(){invadersMovingInterval("left");},invadersMoveSpeed);
      rightEdge = false;
    }
    else if (leftEdge) {
      window.clearInterval(invadersMoveInterval);
      setTimeout(function(){moveInvaders("down");},invadersMoveSpeed);
      setTimeout(function(){invadersMovingInterval("right");},invadersMoveSpeed);
      leftEdge = false;
    }
  });
  // check blast effect
  $($space).bind("blastChanged", function() {
    if (blastY === -1) {
      shooting = false;
      window.clearInterval(blastInterval);
      coordinates(blastX, blastY).toggleClass("blast");
      blastY = 18;
    }
    if (coordinates(blastX, blastY).hasClass("invader")) {
      shooting = false;
      window.clearInterval(blastInterval);
      coordinates(blastX, blastY).toggleClass("blast");
      coordinates(blastX, blastY).removeClass("invader")
                                  .empty();
      blastY = 18;
      $invaders = $(".invader");
      points ++;
      $points.text(points);
    }
    if (points === 28) {
      die();
      $pointsEnd.text(points);
      $gameOver.find("h1").text("congratulations, you have won!");
    }
  });
  // check bomb effect
  $($space).bind("bombChanged", function() {
    if (bombY === 20) {
      window.clearInterval(bombInterval);
      coordinates(bombX, bombY).toggleClass("bomb");
      invaderAttack();
    }
    if (bombX === currentX &&
        bombY === currentY) {
      die();
    }
    else if (bombX === currentX - 1 &&
        bombY === currentY) {
      die();
    }
    else if (bombX === currentX + 1 &&
        bombY === currentY) {
      die();
    }
  });
  // check user move
  $($space).bind("moveChanged", function() {
      if (currentX === 0) {
          window.clearInterval(moveInterval);
          edgeLeft = true;
      } else if (currentX === 19) {
          window.clearInterval(moveInterval);
          edgeRight = true;
      } else {
        edgeLeft = false;
        edgeRight = false;
      }
  });
  // check which key was pressed
  $(document).on("keydown", function(e) {
    if (event.repeat != undefined) {
      allowed = !event.repeat;
    }
    if (!allowed) return;
    allowed = false;
      switch (e.which) {
          case 37:
              go("left");
              break;
          case 39:
              go("right");
              break;
          case 32:
              blast();
              break;
      }
      return false;
  });
  $(document).on("keyup", function(e) {
    allowed = true;
      switch (e.which) {
          case 37:
              window.clearInterval(moveInterval);
              break;
          case 39:
              window.clearInterval(moveInterval);
              break;
      }
  });
  $reload.on("click", function() {
    location.reload();
  });
});
