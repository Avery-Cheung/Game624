const itemLabels = {
  matches: "潮湿火柴",
  rustyKey: "锈钥匙",
  salt: "粗盐袋",
};

const sealLabels = {
  mirror: "裂镜印",
  doll: "白偶印",
  well: "枯井印",
};

const rooms = {
  foyer: {
    name: "门厅",
    bg: "linear-gradient(145deg, #26181d, #070406 70%)",
    lamp: ["55%", "42%"],
    dreadRate: 1,
    exits: [
      ["archive", "去档案室"],
      ["kitchen", "去厨房"],
      ["basement", "下地下室"],
    ],
    description(state) {
      const door = state.flags.has("readPlate")
        ? "门牌背面那行小字还在渗水：住进去的人，会变成房子的回声。"
        : "门厅窄得像一截喉咙。墙上挂着第十三户的门牌，鞋柜里传出轻轻的抓挠声。";
      return `${door} 楼道尽头的门不见了，只剩屋内几条黑暗的路。`;
    },
    whispers: [
      "别照镜子。",
      "鞋柜里多了一双你的鞋。",
      "它在学你呼吸。",
    ],
    actions: [
      {
        id: "plate",
        label: "查看门牌",
        once: "readPlate",
        run(game) {
          game.flag("readPlate");
          game.changeDread(5);
          game.log("门牌背面刻着：镜先认出你，偶会替你说话，井最后闭眼。");
        },
      },
      {
        id: "cabinet",
        label: "摸索鞋柜",
        once: "searchedCabinet",
        run(game) {
          game.flag("searchedCabinet");
          game.addItem("matches");
          game.changeBattery(-4);
          game.log("你在一只湿冷的童鞋里摸到半盒火柴，鞋底印着今天的日期。");
        },
      },
      {
        id: "breathe",
        label: "数十次心跳",
        run(game) {
          game.changeDread(-9);
          game.changeBattery(-1);
          game.log("你贴着墙数完十次心跳。第十一次，不是你的。");
        },
      },
    ],
  },
  archive: {
    name: "档案室",
    bg: "linear-gradient(145deg, #1a1b19, #080708 72%)",
    lamp: ["39%", "36%"],
    dreadRate: 1.4,
    exits: [
      ["foyer", "回门厅"],
      ["childroom", "去儿童房", (state) => state.items.has("rustyKey"), "需要锈钥匙"],
    ],
    description(state) {
      return state.flags.has("archiveLit")
        ? "墙灯亮起后，档案柜投下无数像手指一样的影子。最里层的玻璃柜映着一个慢半拍的你。"
        : "纸张发霉的甜味堵住鼻腔。档案柜深处有一盏油灯，但灯芯湿得像刚从水里捞出。";
    },
    whispers: [
      "名单上没有你，可照片里有。",
      "倒着读，倒着活。",
      "把你的名字撕掉。",
    ],
    actions: [
      {
        id: "lamp",
        label: "点燃墙灯",
        enabled: (state) => state.items.has("matches"),
        disabledText: "需要火柴",
        once: "archiveLit",
        run(game) {
          game.flag("archiveLit");
          game.changeBattery(-2);
          game.changeDread(3);
          game.log("墙灯噗地亮了。火苗里有一只眼睛睁开，又很快装作什么都没发生。");
        },
      },
      {
        id: "mirror",
        label: "打开玻璃柜",
        enabled: (state) => state.flags.has("archiveLit"),
        disabledText: "太黑，看不清锁孔",
        once: "foundMirror",
        run(game) {
          game.flag("foundMirror");
          game.addSeal("mirror");
          game.changeDread(7);
          game.log("柜中的碎镜片割开你的影子，露出第一枚印记：镜。");
        },
      },
      {
        id: "tape",
        label: "倒放磁带",
        once: "heardTape",
        run(game) {
          game.flag("heardTape");
          game.changeBattery(-3);
          game.log("磁带倒放出一句童声：封井的顺序是镜、偶、井。别念错，念错它就有名字了。");
        },
      },
    ],
  },
  kitchen: {
    name: "厨房",
    bg: "linear-gradient(145deg, #242318, #090705 70%)",
    lamp: ["62%", "40%"],
    dreadRate: 1.7,
    exits: [
      ["foyer", "回门厅"],
      ["archive", "去档案室"],
    ],
    description(state) {
      const fridge = state.flags.has("openedFridge")
        ? "冰箱门半开着，里面的霜像黑色头发一样继续生长。"
        : "厨房的瓷砖湿得发亮。冰箱不停震动，像有人在里面用指甲敲摩斯密码。";
      return `${fridge} 水槽下的管道每隔几秒就咳出一点泥。`;
    },
    whispers: [
      "冰箱里冷藏着昨天的尖叫。",
      "盐能圈住脚步，圈不住眼睛。",
      "水槽下面通向井。",
    ],
    actions: [
      {
        id: "sink",
        label: "拆开水槽管",
        once: "searchedSink",
        run(game) {
          game.flag("searchedSink");
          game.addItem("rustyKey");
          game.addItem("salt");
          game.changeBattery(-5);
          game.changeDread(6);
          game.log("管道里滚出一把锈钥匙和一袋粗盐。排水口深处，有人轻轻说了声谢谢。");
        },
      },
      {
        id: "fridge",
        label: "打开冰箱",
        once: "openedFridge",
        run(game) {
          game.flag("openedFridge");
          game.addSeal("well");
          game.changeDread(12);
          game.log("冰箱里没有食物，只有一块滴水的井砖。砖面浮出第三枚印记：井。");
          game.haunt("冰箱门猛地合上，门缝里露出一排不属于人的牙。");
        },
      },
      {
        id: "salt",
        label: "攥紧粗盐",
        enabled: (state) => state.items.has("salt"),
        disabledText: "需要找到粗盐",
        run(game) {
          game.changeDread(-7);
          game.changeBattery(-1);
          game.log("粗盐硌进掌心。脚边那些湿脚印停在圈外，没有再靠近。");
        },
      },
    ],
  },
  childroom: {
    name: "儿童房",
    bg: "linear-gradient(145deg, #221722, #080509 72%)",
    lamp: ["48%", "31%"],
    dreadRate: 2,
    exits: [
      ["archive", "回档案室"],
      ["foyer", "冲回门厅"],
    ],
    description(state) {
      return state.flags.has("foundDoll")
        ? "空婴儿床轻轻摇晃。床头那只少了脸的娃娃已经不见了，但天花板上多出一圈小小的脚印。"
        : "墙纸上画满歪斜的月亮。婴儿床里躺着一只没有脸的布偶，胸口缝着你的姓。";
    },
    whispers: [
      "妈妈说，客人要留下来。",
      "它把脸借给你了。",
      "不要看床底。",
    ],
    actions: [
      {
        id: "doll",
        label: "抱起无脸娃娃",
        once: "foundDoll",
        run(game) {
          game.flag("foundDoll");
          game.addSeal("doll");
          game.changeDread(10);
          game.log("娃娃的棉花心脏里藏着第二枚印记：偶。它忽然用你的声音叫了一声妈妈。");
        },
      },
      {
        id: "music",
        label: "拧动八音盒",
        once: "playedMusic",
        run(game) {
          game.flag("playedMusic");
          game.changeBattery(-2);
          game.changeDread(4);
          game.log("八音盒奏出生日歌，最后一个音符被谁从床底吞了下去。");
        },
      },
      {
        id: "closet",
        label: "躲进衣柜",
        run(game) {
          game.changeDread(-11);
          game.changeBattery(-2);
          game.log("你在衣柜里闭上眼。门外有东西拖着长长的袖子走过，停下，学你闭眼。");
        },
      },
    ],
  },
  basement: {
    name: "地下室",
    bg: "linear-gradient(145deg, #111815, #030304 76%)",
    lamp: ["50%", "55%"],
    dreadRate: 2.4,
    exits: [["foyer", "逃回门厅"]],
    description(state) {
      if (state.ritual.active) {
        return "井盖上的盐圈开始反向旋转。三个印记在掌心发烫，每按错一次，井里就会多喊出一个你的名字。";
      }
      return state.flags.has("saltCircle")
        ? "粗盐在井盖周围围成一道苍白的圆。井下没有水声，只有许多喉咙同时吸气。"
        : "地下室中央嵌着一口被木板封住的井。木板之间渗出冷雾，像房子正在梦见冬天。";
    },
    whispers: [
      "下来。",
      "这里没有回声，只有回答。",
      "你已经来过很多次。",
    ],
    actions: [
      {
        id: "circle",
        label: "撒盐画圈",
        enabled: (state) => state.items.has("salt"),
        disabledText: "需要粗盐",
        once: "saltCircle",
        run(game) {
          game.flag("saltCircle");
          game.changeDread(3);
          game.log("盐圈落地，井下所有声音同时停住，像一群人屏住了呼吸。");
        },
      },
      {
        id: "ritual",
        label: "开始封印仪式",
        enabled: (state) => state.flags.has("saltCircle") && Object.keys(sealLabels).every((seal) => state.seals.has(seal)),
        disabledText: "需要盐圈和三枚印记",
        run(game) {
          game.startRitual();
        },
      },
      {
        id: "listenWell",
        label: "贴近井盖听",
        once: "heardWell",
        run(game) {
          game.flag("heardWell");
          game.changeDread(9);
          game.log("井下传来你的声音：如果你赢了，出去的是谁？");
        },
      },
    ],
  },
};

const dom = {
  shell: document.getElementById("gameShell"),
  startModal: document.getElementById("startModal"),
  endingModal: document.getElementById("endingModal"),
  startButton: document.getElementById("startButton"),
  restartButton: document.getElementById("restartButton"),
  soundToggle: document.getElementById("soundToggle"),
  minute: document.getElementById("minute"),
  batteryValue: document.getElementById("batteryValue"),
  batteryMeter: document.getElementById("batteryMeter"),
  dreadValue: document.getElementById("dreadValue"),
  dreadMeter: document.getElementById("dreadMeter"),
  viewport3d: document.getElementById("viewport3d"),
  roomVisual: document.getElementById("roomVisual"),
  roomName: document.getElementById("roomName"),
  roomDescription: document.getElementById("roomDescription"),
  whisperLine: document.getElementById("whisperLine"),
  actionGrid: document.getElementById("actionGrid"),
  exitGrid: document.getElementById("exitGrid"),
  logList: document.getElementById("logList"),
  inventory: document.getElementById("inventory"),
  apparition: document.getElementById("apparition"),
  endingKicker: document.getElementById("endingKicker"),
  endingTitle: document.getElementById("endingTitle"),
  endingText: document.getElementById("endingText"),
};

const roomVisualClasses = Object.keys(rooms).map((room) => `scene-${room}`);
const flagVisualClasses = [
  "archiveLit",
  "foundMirror",
  "openedFridge",
  "foundDoll",
  "saltCircle",
];

const scenes3d = {
  foyer: {
    start: { x: 4.5, y: 6.7, angle: -Math.PI / 2 },
    wall: "#43262b",
    floor: "#17100f",
    ceiling: "#130b10",
    fog: "rgba(155, 54, 64, 0.22)",
    map: [
      "111111111",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "111111111",
    ],
    props: [
      { type: "door", x: 4.5, y: 1.25, size: 1.35, label: "13" },
      { type: "plate", x: 6.35, y: 2.0, size: 0.62, label: "13" },
      { type: "cabinet", x: 7.0, y: 5.95, size: 1.05 },
      { type: "shadow", x: 2.0, y: 2.0, size: 0.95, showWhenDread: 42 },
    ],
  },
  archive: {
    start: { x: 4.5, y: 6.4, angle: -Math.PI / 2 },
    wall: "#343126",
    floor: "#141311",
    ceiling: "#10120f",
    fog: "rgba(196, 154, 86, 0.13)",
    map: [
      "111111111",
      "100000001",
      "100010001",
      "100000001",
      "100000001",
      "100010001",
      "100000001",
      "100000001",
      "111111111",
    ],
    props: [
      { type: "shelves", x: 1.35, y: 2.7, size: 1.35 },
      { type: "shelves", x: 7.65, y: 2.8, size: 1.35 },
      { type: "lamp", x: 4.5, y: 2.0, size: 0.78 },
      { type: "mirror", x: 6.7, y: 4.25, size: 0.9 },
      { type: "tape", x: 3.0, y: 5.4, size: 0.72 },
      { type: "shadow", x: 4.4, y: 1.7, size: 0.9, showWhenDread: 55 },
    ],
  },
  kitchen: {
    start: { x: 4.4, y: 6.4, angle: -Math.PI / 2 },
    wall: "#303325",
    floor: "#12130f",
    ceiling: "#11100b",
    fog: "rgba(117, 132, 93, 0.18)",
    map: [
      "111111111",
      "100000001",
      "100000001",
      "100010001",
      "100000001",
      "100000001",
      "100010001",
      "100000001",
      "111111111",
    ],
    props: [
      { type: "fridge", x: 1.6, y: 3.0, size: 1.35 },
      { type: "sink", x: 7.1, y: 4.5, size: 1.1 },
      { type: "shadow", x: 5.7, y: 2.1, size: 0.95, showWhenDread: 48 },
    ],
  },
  childroom: {
    start: { x: 4.5, y: 6.5, angle: -Math.PI / 2 },
    wall: "#38253a",
    floor: "#150d16",
    ceiling: "#140b14",
    fog: "rgba(151, 72, 126, 0.16)",
    map: [
      "111111111",
      "100000001",
      "100000001",
      "100000001",
      "100010001",
      "100000001",
      "100000001",
      "100000001",
      "111111111",
    ],
    props: [
      { type: "bed", x: 2.2, y: 4.2, size: 1.35 },
      { type: "doll", x: 2.7, y: 3.35, size: 0.78 },
      { type: "musicbox", x: 5.45, y: 5.2, size: 0.62 },
      { type: "closet", x: 7.25, y: 3.2, size: 1.18 },
      { type: "shadow", x: 7.0, y: 5.7, size: 0.95, showWhenDread: 44 },
    ],
  },
  basement: {
    start: { x: 4.5, y: 6.6, angle: -Math.PI / 2 },
    wall: "#273025",
    floor: "#0a0d0b",
    ceiling: "#050606",
    fog: "rgba(126, 152, 118, 0.2)",
    map: [
      "111111111",
      "100000001",
      "100000001",
      "100010001",
      "100000001",
      "100000001",
      "100000001",
      "100000001",
      "111111111",
    ],
    props: [
      { type: "stairs", x: 1.65, y: 5.7, size: 1.1 },
      { type: "well", x: 4.5, y: 3.0, size: 1.45 },
      { type: "salt", x: 4.5, y: 3.15, size: 1.5, flag: "saltCircle" },
      { type: "shadow", x: 4.5, y: 1.65, size: 1.1, showWhenDread: 36 },
    ],
  },
};

const scene3d = {
  canvas: dom.viewport3d,
  ctx: null,
  room: null,
  keys: new Set(),
  player: { x: 4.5, y: 6.5, angle: -Math.PI / 2 },
  lastFrame: 0,
  frameId: null,
  zBuffer: [],
};

let state = createInitialState();
let tickTimer = null;
let hauntTimer = null;
let audio = null;

function createInitialState() {
  return {
    room: "foyer",
    battery: 100,
    dread: 0,
    minute: 13,
    items: new Set(),
    seals: new Set(),
    flags: new Set(),
    running: false,
    ritual: {
      active: false,
      step: 0,
      sequence: ["mirror", "doll", "well"],
    },
    log: [],
  };
}

const game = {
  addItem(item) {
    if (!state.items.has(item)) {
      state.items.add(item);
      sound("pickup");
      this.log(`获得物品：${itemLabels[item]}`);
    }
  },
  addSeal(seal) {
    if (!state.seals.has(seal)) {
      state.seals.add(seal);
      sound("seal");
      this.log(`印记入手：${sealLabels[seal]}`);
    }
  },
  changeBattery(amount) {
    state.battery = clamp(state.battery + amount, 0, 100);
    if (state.battery === 0) {
      this.changeDread(4);
    }
  },
  changeDread(amount) {
    state.dread = clamp(state.dread + amount, 0, 100);
    if (amount > 7) {
      shake();
    }
    if (state.dread >= 100) {
      endGame(
        "坏结局",
        "你成了第十三户",
        "灯灭之后，屋子终于学会了你的声音。第二天，门牌背面多了一行小字：新住户很安静。"
      );
    }
  },
  flag(flagName) {
    state.flags.add(flagName);
  },
  log(message) {
    state.log.unshift(message);
    state.log = state.log.slice(0, 9);
  },
  haunt(message) {
    triggerHaunt(message);
  },
  startRitual() {
    state.ritual.active = true;
    state.ritual.step = 0;
    this.changeDread(6);
    this.log("封印开始。按下印记的顺序必须与磁带提示一致：镜、偶、井。");
    sound("ritual");
    render();
  },
};

function startGame() {
  state = createInitialState();
  state.running = true;
  reset3DPlayer(state.room);
  dom.startModal.classList.remove("is-visible");
  dom.endingModal.classList.remove("is-visible");
  game.log("你推开第十三户的门。门在身后合上时，没有发出声音。");
  render();
  startTimers();
}

function restartGame() {
  clearTimers();
  startGame();
}

function startTimers() {
  clearTimers();
  tickTimer = window.setInterval(() => {
    if (!state.running) {
      return;
    }
    const room = rooms[state.room];
    const batteryDrain = state.ritual.active ? -2 : -1;
    const lowBatteryPenalty = state.battery < 25 ? 1.8 : 0;
    state.minute = state.minute === 59 ? 0 : state.minute + 1;
    game.changeBattery(batteryDrain);
    game.changeDread(room.dreadRate + lowBatteryPenalty + (state.ritual.active ? 1 : 0));
    render();
  }, 4200);

  hauntTimer = window.setInterval(() => {
    if (!state.running) {
      return;
    }
    const chance = 0.24 + state.dread / 260;
    if (Math.random() < chance) {
      triggerHaunt(randomFrom([
        "墙后传来指甲划过木板的声音，刚好划出你的名字。",
        "你余光里有人站在门口。转头时，只剩一片湿脚印。",
        "所有灯同时暗了一下，黑暗中有什么东西贴近你的耳朵笑。",
      ]));
    }
  }, 11500);
}

function clearTimers() {
  if (tickTimer) {
    window.clearInterval(tickTimer);
  }
  if (hauntTimer) {
    window.clearInterval(hauntTimer);
  }
  tickTimer = null;
  hauntTimer = null;
}

function render() {
  const room = rooms[state.room];
  const battery = Math.round(state.battery);
  const dread = Math.round(state.dread);

  dom.minute.textContent = String(state.minute).padStart(2, "0");
  dom.batteryValue.textContent = `${battery}%`;
  dom.batteryMeter.style.width = `${battery}%`;
  dom.dreadValue.textContent = `${dread}%`;
  dom.dreadMeter.style.width = `${dread}%`;

  dom.roomName.textContent = room.name;
  dom.roomDescription.textContent = room.description(state);
  dom.whisperLine.textContent = randomFrom(room.whispers);
  renderVisualState();
  dom.roomVisual.style.setProperty("--room-bg", room.bg);
  dom.roomVisual.style.setProperty("--lamp-x", room.lamp[0]);
  dom.roomVisual.style.setProperty("--lamp-y", room.lamp[1]);
  dom.roomVisual.style.setProperty("--flashlight-strength", String(0.22 + state.battery / 125));
  dom.roomVisual.style.setProperty("--flicker-opacity", String(0.24 + state.dread / 170));
  render3D();

  renderActions(room);
  renderExits(room);
  renderInventory();
  renderSeals();
  renderLog();
}

function renderVisualState() {
  roomVisualClasses.forEach((className) => {
    dom.roomVisual.classList.remove(className);
  });
  dom.roomVisual.classList.add(`scene-${state.room}`);

  flagVisualClasses.forEach((flagName) => {
    dom.roomVisual.classList.toggle(`visual-${flagName}`, state.flags.has(flagName));
  });
  dom.roomVisual.classList.toggle("visual-ritual-active", state.ritual.active);
  dom.roomVisual.classList.toggle("visual-haunted", state.dread > 58 || state.battery < 18);
}

function init3D() {
  if (!scene3d.canvas || typeof scene3d.canvas.getContext !== "function") {
    return;
  }

  scene3d.ctx = scene3d.canvas.getContext("2d");
  if (!scene3d.ctx) {
    return;
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("keydown", (event) => handle3DKey(event, true));
    window.addEventListener("keyup", (event) => handle3DKey(event, false));
    window.addEventListener("resize", render3D);
  }

  start3DLoop();
}

function start3DLoop() {
  if (!scene3d.ctx || typeof window.requestAnimationFrame !== "function") {
    return;
  }

  const step = (time) => {
    const delta = scene3d.lastFrame ? Math.min((time - scene3d.lastFrame) / 1000, 0.05) : 0;
    scene3d.lastFrame = time;
    update3D(delta);
    render3D();
    scene3d.frameId = window.requestAnimationFrame(step);
  };

  scene3d.frameId = window.requestAnimationFrame(step);
}

function handle3DKey(event, isDown) {
  const key = event.key.toLowerCase();
  const activeKeys = new Set(["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"]);
  if (!activeKeys.has(key)) {
    return;
  }
  if (state.running && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  if (isDown) {
    scene3d.keys.add(key);
  } else {
    scene3d.keys.delete(key);
  }
}

function reset3DPlayer(roomName) {
  const start = scenes3d[roomName]?.start || scenes3d.foyer.start;
  scene3d.player = { ...start };
  scene3d.room = roomName;
}

function update3D(delta) {
  if (!state.running || !scene3d.ctx) {
    return;
  }

  const scene = scenes3d[state.room];
  if (!scene) {
    return;
  }
  if (scene3d.room !== state.room) {
    reset3DPlayer(state.room);
  }

  const turnSpeed = 2.25;
  const moveSpeed = state.battery < 20 ? 1.05 : 1.45;
  const player = scene3d.player;
  const turningLeft = scene3d.keys.has("a") || scene3d.keys.has("arrowleft");
  const turningRight = scene3d.keys.has("d") || scene3d.keys.has("arrowright");
  const movingForward = scene3d.keys.has("w") || scene3d.keys.has("arrowup");
  const movingBack = scene3d.keys.has("s") || scene3d.keys.has("arrowdown");

  if (turningLeft) {
    player.angle -= turnSpeed * delta;
  }
  if (turningRight) {
    player.angle += turnSpeed * delta;
  }

  const direction = (movingForward ? 1 : 0) - (movingBack ? 1 : 0);
  if (direction !== 0) {
    const step = direction * moveSpeed * delta;
    const nextX = player.x + Math.cos(player.angle) * step;
    const nextY = player.y + Math.sin(player.angle) * step;
    move3DPlayer(scene, nextX, nextY);
  }
}

function move3DPlayer(scene, nextX, nextY) {
  const radius = 0.24;
  const player = scene3d.player;
  if (!is3DWall(scene, nextX + Math.sign(nextX - player.x) * radius, player.y)) {
    player.x = nextX;
  }
  if (!is3DWall(scene, player.x, nextY + Math.sign(nextY - player.y) * radius)) {
    player.y = nextY;
  }
}

function render3D() {
  if (!scene3d.ctx || !scene3d.canvas) {
    return;
  }

  const scene = scenes3d[state.room];
  if (!scene) {
    return;
  }
  if (scene3d.room !== state.room) {
    reset3DPlayer(state.room);
  }

  resize3DCanvas();
  const ctx = scene3d.ctx;
  const { canvas } = scene3d;
  const width = canvas.width;
  const height = canvas.height;
  if (!width || !height) {
    return;
  }

  draw3DBackground(ctx, scene, width, height);
  draw3DWalls(ctx, scene, width, height);
  draw3DProps(ctx, scene, width, height);
  draw3DAtmosphere(ctx, scene, width, height);
}

function resize3DCanvas() {
  const canvas = scene3d.canvas;
  const rect = typeof canvas.getBoundingClientRect === "function"
    ? canvas.getBoundingClientRect()
    : { width: 720, height: 430 };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(320, Math.floor(rect.width * dpr));
  const height = Math.max(260, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

function draw3DBackground(ctx, scene, width, height) {
  const ceiling = ctx.createLinearGradient(0, 0, 0, height * 0.52);
  ceiling.addColorStop(0, "#040305");
  ceiling.addColorStop(0.6, scene.ceiling);
  ceiling.addColorStop(1, "#090608");
  ctx.fillStyle = ceiling;
  ctx.fillRect(0, 0, width, height * 0.52);

  const floor = ctx.createLinearGradient(0, height * 0.48, 0, height);
  floor.addColorStop(0, scene.floor);
  floor.addColorStop(1, "#020202");
  ctx.fillStyle = floor;
  ctx.fillRect(0, height * 0.48, width, height);

  ctx.strokeStyle = "rgba(255, 232, 203, 0.055)";
  ctx.lineWidth = Math.max(1, width / 900);
  for (let i = 0; i < 18; i += 1) {
    const y = height * 0.55 + i * i * height * 0.003;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + i * 0.4);
    ctx.stroke();
  }
}

function draw3DWalls(ctx, scene, width, height) {
  const fov = Math.PI / 3;
  const columnWidth = Math.max(2, Math.floor(width / 420));
  const horizon = height * 0.5 + Math.sin(Date.now() / 550) * (state.dread / 28);
  scene3d.zBuffer = [];

  for (let x = 0; x < width; x += columnWidth) {
    const rayAngle = scene3d.player.angle - fov / 2 + (x / width) * fov;
    const ray = cast3DRay(scene, rayAngle);
    const corrected = Math.max(0.001, ray.distance * Math.cos(rayAngle - scene3d.player.angle));
    const wallHeight = Math.min(height * 1.75, height / (corrected * 0.78));
    const y = horizon - wallHeight / 2;
    const shade = clamp(corrected / 8, 0, 1);

    ctx.fillStyle = scene.wall;
    ctx.fillRect(x, y, columnWidth + 1, wallHeight);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.18 + shade * 0.64})`;
    ctx.fillRect(x, y, columnWidth + 1, wallHeight);

    if (ray.edge < 0.045) {
      ctx.fillStyle = "rgba(255, 232, 203, 0.08)";
      ctx.fillRect(x, y, 1, wallHeight);
    }

    scene3d.zBuffer[Math.floor(x / columnWidth)] = corrected;
  }
}

function draw3DProps(ctx, scene, width, height) {
  const fov = Math.PI / 3;
  const columnWidth = Math.max(2, Math.floor(width / 420));
  const props = getVisible3DProps(scene)
    .map((prop) => {
      const dx = prop.x - scene3d.player.x;
      const dy = prop.y - scene3d.player.y;
      const distance = Math.hypot(dx, dy);
      const angle = normalizeAngle(Math.atan2(dy, dx) - scene3d.player.angle);
      return { ...prop, distance, angle };
    })
    .filter((prop) => prop.distance > 0.15 && Math.abs(prop.angle) < fov * 0.68)
    .sort((a, b) => b.distance - a.distance);

  props.forEach((prop) => {
    const screenX = (0.5 + prop.angle / fov) * width;
    const zIndex = Math.floor(screenX / columnWidth);
    if (scene3d.zBuffer[zIndex] && scene3d.zBuffer[zIndex] < prop.distance - 0.22) {
      return;
    }
    const baseSize = (height / (prop.distance * 1.08)) * (prop.size || 1);
    const floorY = height * (prop.type === "salt" ? 0.82 : 0.72);
    draw3DProp(ctx, prop, screenX, floorY, baseSize);
  });
}

function draw3DAtmosphere(ctx, scene, width, height) {
  ctx.fillStyle = scene.fog;
  ctx.fillRect(0, 0, width, height);

  const pulse = 0.14 + Math.sin(Date.now() / 360) * 0.04;
  const gradient = ctx.createRadialGradient(width / 2, height * 0.48, height * 0.08, width / 2, height * 0.48, height * 0.66);
  gradient.addColorStop(0, `rgba(255, 230, 168, ${0.18 + state.battery / 900})`);
  gradient.addColorStop(0.54, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${0.68 + state.dread / 380})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (state.dread > 62 || state.ritual.active) {
    ctx.fillStyle = `rgba(182, 38, 53, ${pulse})`;
    for (let i = 0; i < 7; i += 1) {
      const x = ((i * 137 + Date.now() / 35) % width);
      ctx.fillRect(x, 0, Math.max(1, width / 420), height);
    }
  }
}

function cast3DRay(scene, angle) {
  const maxDistance = 10.5;
  const step = 0.025;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  let distance = 0;

  while (distance < maxDistance) {
    const x = scene3d.player.x + cos * distance;
    const y = scene3d.player.y + sin * distance;
    if (is3DWall(scene, x, y)) {
      const edge = Math.min(Math.abs(x - Math.round(x)), Math.abs(y - Math.round(y)));
      return { distance, edge };
    }
    distance += step;
  }

  return { distance: maxDistance, edge: 1 };
}

function is3DWall(scene, x, y) {
  const mapY = Math.floor(y);
  const mapX = Math.floor(x);
  return scene.map[mapY]?.[mapX] !== "0";
}

function getVisible3DProps(scene) {
  return scene.props.filter((prop) => {
    if (prop.flag && !state.flags.has(prop.flag)) {
      return false;
    }
    if (prop.hideFlag && state.flags.has(prop.hideFlag)) {
      return false;
    }
    if (prop.showWhenDread && state.dread < prop.showWhenDread && !state.ritual.active) {
      return false;
    }
    return true;
  });
}

function draw3DProp(ctx, prop, x, floorY, size) {
  ctx.save();
  ctx.translate(x, floorY);
  ctx.globalAlpha = clamp(1.15 - prop.distance / 8, 0.25, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.08, size * 0.42, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  const height = size * 0.95;
  const width = size * 0.52;
  switch (prop.type) {
    case "door":
      drawDoor3D(ctx, width * 1.1, height * 1.55, prop.label);
      break;
    case "plate":
      drawPanel3D(ctx, width * 0.9, height * 0.42, prop.label || "13", "#38271f");
      break;
    case "cabinet":
      drawCabinet3D(ctx, width * 1.25, height * 0.8);
      break;
    case "shelves":
      drawShelves3D(ctx, width * 1.2, height * 1.3);
      break;
    case "lamp":
      drawLamp3D(ctx, size, state.flags.has("archiveLit"));
      break;
    case "mirror":
      drawMirror3D(ctx, width, height * 1.1);
      break;
    case "tape":
      drawTape3D(ctx, width * 1.2, height * 0.42);
      break;
    case "fridge":
      drawFridge3D(ctx, width * 1.15, height * 1.35, state.flags.has("openedFridge"));
      break;
    case "sink":
      drawSink3D(ctx, width * 1.35, height * 0.74);
      break;
    case "bed":
      drawBed3D(ctx, width * 1.7, height * 0.75, state.flags.has("foundDoll"));
      break;
    case "doll":
      drawDoll3D(ctx, size, state.flags.has("foundDoll"));
      break;
    case "musicbox":
      drawMusicBox3D(ctx, width * 0.98, height * 0.44);
      break;
    case "closet":
      drawCloset3D(ctx, width * 1.05, height * 1.35);
      break;
    case "stairs":
      drawStairs3D(ctx, width * 1.4, height);
      break;
    case "well":
      drawWell3D(ctx, size, state.ritual.active);
      break;
    case "salt":
      drawSaltCircle3D(ctx, size, state.ritual.active);
      break;
    case "shadow":
      drawShadow3D(ctx, size);
      break;
    default:
      drawPanel3D(ctx, width, height, "?", "#22181c");
  }
  ctx.restore();
}

function drawDoor3D(ctx, width, height, label) {
  ctx.fillStyle = "#13090b";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.fillStyle = "#3a1d22";
  ctx.fillRect(-width * 0.42, -height * 0.92, width * 0.84, height * 0.86);
  ctx.strokeStyle = "rgba(255, 232, 203, 0.16)";
  ctx.strokeRect(-width * 0.34, -height * 0.72, width * 0.68, height * 0.52);
  ctx.fillStyle = "rgba(216, 157, 75, 0.82)";
  ctx.beginPath();
  ctx.arc(width * 0.27, -height * 0.48, Math.max(2, width * 0.04), 0, Math.PI * 2);
  ctx.fill();
  drawPropText(ctx, label, 0, -height * 0.78, width * 0.22);
}

function drawPanel3D(ctx, width, height, label, color) {
  ctx.fillStyle = color;
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.strokeStyle = "rgba(216, 157, 75, 0.45)";
  ctx.strokeRect(-width / 2, -height, width, height);
  drawPropText(ctx, label, 0, -height * 0.42, height * 0.45);
}

function drawCabinet3D(ctx, width, height) {
  ctx.fillStyle = "#2c211b";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.strokeStyle = "rgba(255, 232, 203, 0.16)";
  for (let i = 1; i < 4; i += 1) {
    const y = -height + (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(-width / 2, y);
    ctx.lineTo(width / 2, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(216, 157, 75, 0.4)";
  ctx.fillRect(-width * 0.18, -height * 0.56, width * 0.36, height * 0.04);
}

function drawShelves3D(ctx, width, height) {
  ctx.fillStyle = "#211917";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.strokeStyle = "rgba(216, 157, 75, 0.28)";
  for (let i = 1; i < 5; i += 1) {
    const y = -height + (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(-width / 2, y);
    ctx.lineTo(width / 2, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(226, 209, 173, 0.22)";
  for (let i = 0; i < 9; i += 1) {
    const bookX = -width * 0.42 + i * width * 0.1;
    ctx.fillRect(bookX, -height * (0.82 - (i % 3) * 0.13), width * 0.045, height * 0.16);
  }
}

function drawLamp3D(ctx, size, lit) {
  if (lit) {
    const glow = ctx.createRadialGradient(0, -size * 0.86, 0, 0, -size * 0.86, size * 0.9);
    glow.addColorStop(0, "rgba(255, 226, 140, 0.72)");
    glow.addColorStop(1, "rgba(255, 226, 140, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-size, -size * 1.75, size * 2, size * 1.8);
  }
  ctx.fillStyle = "#15100d";
  ctx.fillRect(-size * 0.04, -size * 1.22, size * 0.08, size * 1.08);
  ctx.fillStyle = lit ? "#e6b35f" : "#4c3824";
  ctx.beginPath();
  ctx.moveTo(-size * 0.28, -size * 1.24);
  ctx.lineTo(size * 0.28, -size * 1.24);
  ctx.lineTo(size * 0.42, -size * 0.82);
  ctx.lineTo(-size * 0.42, -size * 0.82);
  ctx.closePath();
  ctx.fill();
}

function drawMirror3D(ctx, width, height) {
  ctx.fillStyle = "#2c211f";
  ctx.beginPath();
  ctx.ellipse(0, -height * 0.5, width * 0.52, height * 0.54, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(183, 214, 204, 0.24)";
  ctx.beginPath();
  ctx.ellipse(0, -height * 0.5, width * 0.38, height * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.moveTo(-width * 0.18, -height * 0.76);
  ctx.lineTo(width * 0.15, -height * 0.46);
  ctx.lineTo(-width * 0.05, -height * 0.28);
  ctx.stroke();
}

function drawTape3D(ctx, width, height) {
  ctx.fillStyle = "#231719";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.fillStyle = "#070506";
  [-0.24, 0.24].forEach((offset) => {
    ctx.beginPath();
    ctx.arc(width * offset, -height * 0.52, height * 0.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFridge3D(ctx, width, height, open) {
  ctx.fillStyle = open ? "#16221f" : "#27332e";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.strokeStyle = "rgba(220, 241, 223, 0.2)";
  ctx.strokeRect(-width / 2, -height, width, height);
  ctx.beginPath();
  ctx.moveTo(-width / 2, -height * 0.5);
  ctx.lineTo(width / 2, -height * 0.5);
  ctx.stroke();
  if (open) {
    ctx.fillStyle = "rgba(188, 255, 225, 0.34)";
    ctx.fillRect(width * 0.18, -height * 0.94, width * 0.42, height * 0.9);
  }
}

function drawSink3D(ctx, width, height) {
  ctx.fillStyle = "#424238";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.fillStyle = "#090807";
  ctx.beginPath();
  ctx.ellipse(0, -height * 0.68, width * 0.28, height * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(210, 199, 160, 0.4)";
  ctx.beginPath();
  ctx.arc(0, -height * 1.02, width * 0.12, Math.PI, Math.PI * 2);
  ctx.stroke();
}

function drawBed3D(ctx, width, height, dollTaken) {
  ctx.fillStyle = "#281724";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.strokeStyle = "rgba(255, 232, 203, 0.2)";
  for (let i = 0; i < 6; i += 1) {
    const x = -width / 2 + i * width / 5;
    ctx.beginPath();
    ctx.moveTo(x, -height);
    ctx.lineTo(x, 0);
    ctx.stroke();
  }
  if (dollTaken) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.beginPath();
    ctx.ellipse(0, -height * 0.48, width * 0.18, height * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDoll3D(ctx, size, dollTaken) {
  ctx.globalAlpha *= dollTaken ? 0.25 : 1;
  ctx.fillStyle = "#c7b49b";
  ctx.beginPath();
  ctx.arc(0, -size * 0.96, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3d2736";
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.78);
  ctx.lineTo(size * 0.32, -size * 0.18);
  ctx.lineTo(-size * 0.32, -size * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(-size * 0.07, -size, size * 0.035, size * 0.035);
  ctx.fillRect(size * 0.04, -size, size * 0.035, size * 0.035);
}

function drawMusicBox3D(ctx, width, height) {
  ctx.fillStyle = "#38211d";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.fillStyle = "rgba(216, 157, 75, 0.45)";
  ctx.fillRect(-width * 0.05, -height * 1.32, width * 0.1, height * 0.34);
}

function drawCloset3D(ctx, width, height) {
  ctx.fillStyle = "#28151d";
  ctx.fillRect(-width / 2, -height, width, height);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
  ctx.beginPath();
  ctx.moveTo(0, -height);
  ctx.lineTo(0, 0);
  ctx.stroke();
  ctx.fillStyle = "rgba(216, 157, 75, 0.45)";
  ctx.fillRect(-width * 0.11, -height * 0.52, width * 0.045, width * 0.045);
  ctx.fillRect(width * 0.08, -height * 0.52, width * 0.045, width * 0.045);
}

function drawStairs3D(ctx, width, height) {
  ctx.fillStyle = "#15100f";
  for (let i = 0; i < 6; i += 1) {
    const stepWidth = width * (1 - i * 0.11);
    ctx.fillRect(-stepWidth / 2, -height * (0.18 + i * 0.12), stepWidth, height * 0.07);
  }
}

function drawWell3D(ctx, size, ritualActive) {
  ctx.fillStyle = ritualActive ? "#11160f" : "#181711";
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.42, size * 0.45, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#010101";
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.48, size * 0.33, size * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 232, 203, 0.18)";
  ctx.lineWidth = Math.max(1, size * 0.035);
  ctx.stroke();
}

function drawSaltCircle3D(ctx, size, ritualActive) {
  ctx.strokeStyle = ritualActive ? "rgba(255, 239, 179, 0.95)" : "rgba(245, 237, 211, 0.72)";
  ctx.lineWidth = Math.max(2, size * 0.035);
  ctx.setLineDash([size * 0.1, size * 0.07]);
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.05, size * 0.62, size * 0.18, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  if (ritualActive) {
    ["镜", "偶", "井"].forEach((label, index) => {
      const angle = Date.now() / 600 + index * Math.PI * 2 / 3;
      drawPropText(ctx, label, Math.cos(angle) * size * 0.45, -size * 0.2 + Math.sin(angle) * size * 0.14, size * 0.12);
    });
  }
}

function drawShadow3D(ctx, size) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.86)";
  ctx.beginPath();
  ctx.ellipse(0, -size * 1.08, size * 0.17, size * 0.21, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-size * 0.16, -size * 0.92, size * 0.32, size * 0.72);
  ctx.fillStyle = "rgba(255, 245, 220, 0.5)";
  ctx.fillRect(-size * 0.06, -size * 1.11, size * 0.035, size * 0.025);
  ctx.fillRect(size * 0.03, -size * 1.11, size * 0.035, size * 0.025);
}

function drawPropText(ctx, text, x, y, size) {
  ctx.fillStyle = "rgba(255, 232, 203, 0.86)";
  ctx.font = `${Math.max(10, size)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function renderActions(room) {
  dom.actionGrid.replaceChildren();

  if (state.room === "basement" && state.ritual.active) {
    state.ritual.sequence.forEach((seal) => {
      const button = makeButton(`按下${sealLabels[seal]}`, () => pressRitualSeal(seal));
      dom.actionGrid.append(button);
    });
    dom.actionGrid.append(makeButton("重复磁带提示", () => {
      game.changeBattery(-1);
      game.log("提示在脑中变得清晰：镜、偶、井。");
      render();
    }));
    return;
  }

  room.actions.forEach((action) => {
    const alreadyDone = action.once && state.flags.has(action.once);
    const enabled = !alreadyDone && (!action.enabled || action.enabled(state));
    const label = alreadyDone
      ? `${action.label}（已完成）`
      : enabled
        ? action.label
        : `${action.label}（${action.disabledText || "条件不足"}）`;
    const button = makeButton(label, () => runAction(action));
    button.disabled = !enabled;
    dom.actionGrid.append(button);
  });
}

function renderExits(room) {
  dom.exitGrid.replaceChildren();
  room.exits.forEach(([target, label, enabledCheck, disabledText]) => {
    const enabled = !enabledCheck || enabledCheck(state);
    const button = makeButton(enabled ? label : `${label}（${disabledText}）`, () => moveTo(target));
    button.disabled = !enabled || state.ritual.active;
    dom.exitGrid.append(button);
  });
}

function renderInventory() {
  dom.inventory.replaceChildren();
  if (!state.items.size) {
    const empty = document.createElement("span");
    empty.textContent = "空空如也";
    dom.inventory.append(empty);
    return;
  }
  state.items.forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = itemLabels[item];
    dom.inventory.append(chip);
  });
}

function renderSeals() {
  Object.keys(sealLabels).forEach((seal) => {
    document.getElementById(`seal-${seal}`).classList.toggle("is-found", state.seals.has(seal));
  });
}

function renderLog() {
  dom.logList.replaceChildren();
  state.log.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    dom.logList.append(item);
  });
}

function runAction(action) {
  if (!state.running) {
    return;
  }
  action.run(game);
  if (!state.running) {
    return;
  }
  game.changeBattery(-1);
  maybeRoomHaunt();
  render();
}

function moveTo(target) {
  if (!state.running || state.ritual.active) {
    return;
  }
  state.room = target;
  game.changeBattery(-3);
  game.changeDread(target === "basement" ? 7 : 3);
  game.log(`你进入${rooms[target].name}。`);
  sound("step");
  maybeRoomHaunt();
  render();
}

function pressRitualSeal(seal) {
  if (!state.ritual.active) {
    return;
  }
  const expected = state.ritual.sequence[state.ritual.step];
  if (seal !== expected) {
    state.ritual.step = 0;
    game.changeDread(18);
    game.log(`你按错了。井下立刻多出一阵掌声，仪式从头开始。`);
    sound("wrong");
    render();
    return;
  }

  state.ritual.step += 1;
  game.changeBattery(-4);
  game.changeDread(4);
  sound("seal");

  if (state.ritual.step >= state.ritual.sequence.length) {
    endGame(
      "真结局",
      "井终于闭眼",
      "三枚印记同时裂开，井盖下传来一声漫长的叹息。你跌回楼道，身后第十三户的门牌慢慢褪色，只留下掌心一圈盐痕。"
    );
    return;
  }

  game.log(`第 ${state.ritual.step} 枚印记亮起。还有东西在井下等你念错。`);
  render();
}

function maybeRoomHaunt() {
  const chance = 0.12 + state.dread / 500;
  if (Math.random() < chance) {
    triggerHaunt(randomFrom(rooms[state.room].whispers));
  }
}

function triggerHaunt(message) {
  if (!state.running) {
    return;
  }
  dom.apparition.classList.remove("is-here");
  void dom.apparition.offsetWidth;
  dom.apparition.classList.add("is-here");
  shake();
  game.changeDread(7 + Math.random() * 7);
  game.changeBattery(-2);
  game.log(message);
  sound("haunt");
}

function endGame(kicker, title, text) {
  if (!state.running) {
    return;
  }
  state.running = false;
  clearTimers();
  dom.endingKicker.textContent = kicker;
  dom.endingTitle.textContent = title;
  dom.endingText.textContent = text;
  dom.endingModal.classList.add("is-visible");
  sound(kicker === "真结局" ? "win" : "lose");
  render();
}

function makeButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function shake() {
  dom.shell.classList.remove("shake");
  void dom.shell.offsetWidth;
  dom.shell.classList.add("shake");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function ensureAudio() {
  if (audio) {
    return audio;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    dom.soundToggle.textContent = "浏览器不支持声音";
    dom.soundToggle.disabled = true;
    return null;
  }

  const ctx = new AudioContext();
  const master = ctx.createGain();
  const hum = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();

  master.gain.value = 0.16;
  filter.type = "lowpass";
  filter.frequency.value = 120;
  hum.type = "sawtooth";
  hum.frequency.value = 42;
  hum.connect(filter);
  filter.connect(master);
  master.connect(ctx.destination);
  hum.start();

  audio = { ctx, master, enabled: true };
  return audio;
}

function toggleSound() {
  const current = ensureAudio();
  if (!current) {
    return;
  }
  if (current.ctx.state === "suspended") {
    current.ctx.resume();
  }
  current.enabled = !current.enabled;
  current.master.gain.setTargetAtTime(current.enabled ? 0.16 : 0, current.ctx.currentTime, 0.04);
  dom.soundToggle.textContent = current.enabled ? "关闭声音" : "开启声音";
}

function sound(kind) {
  if (!audio || !audio.enabled) {
    return;
  }
  const { ctx, master } = audio;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const table = {
    step: [72, 0.05, "sine"],
    pickup: [420, 0.08, "triangle"],
    seal: [245, 0.18, "sine"],
    ritual: [98, 0.45, "sawtooth"],
    wrong: [58, 0.32, "square"],
    haunt: [36, 0.45, "sawtooth"],
    win: [330, 0.7, "triangle"],
    lose: [45, 0.9, "sawtooth"],
  };
  const [frequency, duration, type] = table[kind] || table.step;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  if (kind === "haunt" || kind === "wrong") {
    osc.frequency.exponentialRampToValueAtTime(Math.max(22, frequency / 2), now + duration);
  } else if (kind === "win") {
    osc.frequency.exponentialRampToValueAtTime(660, now + duration);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "haunt" ? 0.28 : 0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

dom.startButton.addEventListener("click", () => {
  const current = ensureAudio();
  if (current && current.ctx.state === "suspended") {
    current.ctx.resume();
  }
  dom.soundToggle.textContent = "关闭声音";
  startGame();
});
dom.restartButton.addEventListener("click", restartGame);
dom.soundToggle.addEventListener("click", toggleSound);

init3D();
render();
