$(document).ready(function() {
  var $space = $(".space"),
      $area = $(".area"),
      moveInterval,
      blastInterval,
      edgeLeft = false,
      edgeRight = false,
      currentX = 10,
      currentY = 19,
      blastX = currentX,
      blastY = 18,
      shooting = false,
      speed = 150;

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
  // check blast effect
  $($space).bind("blastChanged" , function() {
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

// make user
  coordinates(currentX, currentY).addClass("user");

// make inviders
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 20; j++) {
      if (j%2 === 0) {
        coordinates(j, i).addClass("invider");
      }
    }
  }
});
