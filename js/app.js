$(document).ready(function() {
  var $space = $(".space"),
      $area = $(".area"),
      $inviders,
      moveInterval,
      blastInterval,
      bombInterval,
      edgeLeft = false,
      edgeRight = false,
      currentX = 10,
      currentY = 19,
      blastX = currentX,
      blastY = 18,
      bombX = 0,
      bombY = 0,
      shooting = false,
      speed = 150;

  // make user
  coordinates(currentX, currentY).addClass("user");

  // make inviders
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 20; j++) {
      if (j%2 === 0) {
        coordinates(j, i).addClass("invider")
                          .attr("data-x", j)
                          .attr("data-y", i);
        $inviders = $(".invider");
      }
    }
  }
  // initiate invider attack
  inviderAttack();

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
      }, speed);
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
    }, speed);
  }
  // check blast effect
  $($space).bind("blastChanged", function() {
    if (blastY === 0) {
      shooting = false;
      window.clearInterval(blastInterval);
      coordinates(blastX, blastY).toggleClass("blast");
      blastY = 18;
    }
    if (coordinates(blastX, blastY).hasClass("invider")) {
      shooting = false;
      window.clearInterval(blastInterval);
      coordinates(blastX, blastY).toggleClass("blast");
      coordinates(blastX, blastY).toggleClass("invider");
      blastY = 18;
    }
  });
  // check bomb effect
  $($space).bind("bombChanged", function() {
    if (bombY === 20) {
      window.clearInterval(bombInterval);
      coordinates(bombX, bombY).toggleClass("bomb");
      inviderAttack();
    }
    if (coordinates(bombX, bombY).hasClass("user")) {
      window.clearInterval(bombInterval);
      coordinates(bombX, bombY).toggleClass("bomb");
      coordinates(bombX, bombY).toggleClass("user");
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
  $(document).keydown(function(e) {
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
  });

});
