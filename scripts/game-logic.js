const NPC_BODY_SIZE = 50;
const NPC_BODY_RADIUS = NPC_BODY_SIZE / 2;
const REACTION_TIME = 20;

let currentMouseCoords = { x: 0, y: 0 };
let prevMouseCoords = { x: 0, y: 0 };
let mouseDirectionVector = { x: 0, y: 0 };

document.addEventListener("mousemove", (event) => {
  currentMouseCoords.x = event.clientX;
  currentMouseCoords.y = event.clientY;
});

$("#start-playing").on("click", function () {

  $("#dialog").fadeOut(300);

  $("#npc-body").on("mousedown", function (event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    let npcBodyCoords = getNpcBodyCenterCoords();
    const mouseDistanceFromNpcBodyCenter =
      calculateMouseDistanceFromNpcBodyCenter(
        mouseX,
        mouseY,
        npcBodyCoords.x,
        npcBodyCoords.y
      );
    if (mouseDistanceFromNpcBodyCenter <= NPC_BODY_RADIUS) {
      alert("Congrats! You caught the NPC!");
    }
  });

  setInterval(() => {
    const mouseX = currentMouseCoords.x;
    const mouseY = currentMouseCoords.y;

    let npcBodyCoords = getNpcBodyCenterCoords();
    mouseDirectionVector = {
      x: mouseX - prevMouseCoords.x,
      y: mouseY - prevMouseCoords.y,
    };
    const mouseDistanceFromNpcBodyCenter =
      calculateMouseDistanceFromNpcBodyCenter(
        mouseX,
        mouseY,
        npcBodyCoords.x,
        npcBodyCoords.y
      );

    if (mouseDistanceFromNpcBodyCenter <= 40) {
      makeNpcEscape();
    }

    prevMouseCoords = { x: mouseX, y: mouseY };
  }, REACTION_TIME);
});

function calculateMouseDistanceFromNpcBodyCenter(
  mouseX,
  mouseY,
  npcBodyX,
  npcBodyY
) {
  const distanceSquared = (mouseX - npcBodyX) ** 2 + (mouseY - npcBodyY) ** 2;

  return Math.sqrt(distanceSquared);
}

function getNpcBodyCenterCoords() {
  const npcBody = $("#npc-body");
  const offset = npcBody.offset();
  const centerX = offset.left + npcBody.outerWidth() / 2;
  const centerY = offset.top + npcBody.outerHeight() / 2;
  return { x: centerX, y: centerY };
}

function getAxisMoveDirection(val) {
  if (val > 0) {
    return 1;
  } else if (val < 0) {
    return -1;
  } else {
    return 1;
  }
}

function makeNpcEscape() {
  const npcBody = $("#npc-body");
  let newLeft = 0,
    newTop = 0;

  const currentLeft = parseInt(npcBody.css("left"), 10) || 0;
  const currentTop = parseInt(npcBody.css("top"), 10) || 0;
  let randomStep = Math.random() * 400 + 50;
  let stepLeftSize = getAxisMoveDirection(mouseDirectionVector.x) * randomStep;
  let stepTopSize =
    getAxisMoveDirection(mouseDirectionVector.y) * (450 - randomStep);
  if (
    currentLeft + stepLeftSize <=
      document.body.offsetWidth / 2 - NPC_BODY_SIZE &&
    currentLeft + stepLeftSize >= -document.body.offsetWidth / 2 + NPC_BODY_SIZE
  ) {
    newLeft = currentLeft + stepLeftSize;
  }
  if (
    currentTop + stepTopSize <=
      document.body.offsetHeight / 2 - NPC_BODY_SIZE &&
    currentTop + stepTopSize >= -document.body.offsetHeight / 2 + NPC_BODY_SIZE
  ) {
    newTop = currentTop + stepTopSize;
  }

  $("#npc-body").animate({ left: `${newLeft}px`, top: `${newTop}px` }, 200);
}
