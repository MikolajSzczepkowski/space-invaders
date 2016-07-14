$(document).ready(function() {
  var $space = $(".space"),
      $area = $(".area"),
      $points = $("#points").find("span"),
      $inviders,
      moveInterval,
      blastInterval,
      bombInterval,
      invidersMoveInterval,
      invidersMoveDownInterval,
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
      blastSpeed = 75,
      invidersMoveSpeed = 1500,
      allowed = true,
      points = 0;

  // make user
  coordinates(currentX, currentY).addClass("user");

  // make inviders
  for (var i = 0; i < 4; i++) {
    for (var j = 2; j < 16; j++) {
      if (j%2 === 0) {
        var $inviderContent = $("<div>",{"class":"invider-content"});
        coordinates(j, i).addClass("invider")
                          .attr("data-x", j)
                          .attr("data-y", i)
                          .append($inviderContent);
        $inviders = $(".invider");
      }
    }
  }
  // initiate inviders attack
  inviderAttack();

// initiate invaders move
  invidersMovingInterval("right");


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
  function inviderAttack() {
    var invider = $inviders[Math.floor(Math.random()*($inviders.length-1))];
    bombX = parseInt($(invider).attr("data-x")),
    bombY = parseInt($(invider).attr("data-y"));
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
    window.clearInterval(invidersMoveInterval);
    $(document).off("keydown");
  }
  function moveInviders(direction) {
      switch (direction) {
        case "right":
          $inviders.each(function() {
            var $inviderContent = $("<div>",{"class":"invider-content"}),
                inviderX = $(this).attr("data-x"),
                inviderY = $(this).attr("data-y");
            $(this).toggleClass("invider")
                    .empty();
            inviderX ++;
            coordinates(inviderX, inviderY).toggleClass("invider")
            .attr("data-x", inviderX)
            .attr("data-y", inviderY)
            .append($inviderContent);
          });
          break;
        case "left":
          $inviders.each(function() {
            var $inviderContent = $("<div>",{"class":"invider-content"}),
                inviderX = $(this).attr("data-x"),
                inviderY = $(this).attr("data-y");
            $(this).toggleClass("invider")
                    .empty();
            inviderX --;
            coordinates(inviderX, inviderY).toggleClass("invider")
            .attr("data-x", inviderX)
            .attr("data-y", inviderY)
            .append($inviderContent);
          });
          break;
        case "down":
          $($inviders.get().reverse()).each(function() {
            var $inviderContent = $("<div>",{"class":"invider-content"}),
                inviderX = parseInt($(this).attr("data-x")),
                inviderY = parseInt($(this).attr("data-y"));
            $(this).toggleClass("invider")
                    .empty();
            inviderY ++;
            coordinates(inviderX, inviderY).toggleClass("invider")
            .attr("data-x", inviderX)
            .attr("data-y", inviderY)
            .append($inviderContent);
          });
          break;
        default:
      }
      $inviders = $(".invider");

  }
  function invidersMovingInterval(direction) {
    invidersMoveInterval = setInterval(function() {
      moveInviders(direction);
      $($space).trigger("invidersPositionChanged");
    }, invidersMoveSpeed);
  }
  $($space).bind("invidersPositionChanged", function() {
    var rightEdge = false,
        leftEdge = false;
    for (var i = 19; i < $(".area").length; i += 20) {
      if ($(".area").eq(i).hasClass("invider")) {
        rightEdge = true;
      }
    }
    for (var i = 0; i < $(".area").length; i += 20) {
      if ($(".area").eq(i).hasClass("invider")) {
        leftEdge = true;
      }
    }
    if($(".user").hasClass("invider")) {
      die();
    }
    if (rightEdge){
      window.clearInterval(invidersMoveInterval);
      setTimeout(function(){moveInviders("down");},invidersMoveSpeed);
      setTimeout(function(){invidersMovingInterval("left");},invidersMoveSpeed);
      rightEdge = false;
    }
    else if (leftEdge) {
      window.clearInterval(invidersMoveInterval);
      setTimeout(function(){moveInviders("down");},invidersMoveSpeed);
      setTimeout(function(){invidersMovingInterval("right");},invidersMoveSpeed);
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
    if (coordinates(blastX, blastY).hasClass("invider")) {
      shooting = false;
      window.clearInterval(blastInterval);
      coordinates(blastX, blastY).toggleClass("blast");
      coordinates(blastX, blastY).removeClass("invider")
                                  .empty();
      blastY = 18;
      $inviders = $(".invider");
      points ++;
      $points.text(points);
    }
  });
  // check bomb effect
  $($space).bind("bombChanged", function() {
    if (bombY === 20) {
      window.clearInterval(bombInterval);
      coordinates(bombX, bombY).toggleClass("bomb");
      inviderAttack();
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
});
