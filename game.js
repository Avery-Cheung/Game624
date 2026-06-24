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
  touchControls: document.getElementById("touchControls"),
  movePad: document.getElementById("movePad"),
  moveKnob: document.getElementById("moveKnob"),
  lookPad: document.getElementById("lookPad"),
  lookKnob: document.getElementById("lookKnob"),
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
    exits: [
      { target: "archive", x: 1.1, y: 4.5, label: "档" },
      { target: "kitchen", x: 7.9, y: 4.5, label: "厨" },
      { target: "basement", x: 4.5, y: 7.75, label: "下" },
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
    exits: [
      { target: "foyer", x: 4.5, y: 7.75, label: "厅" },
      { target: "childroom", x: 7.85, y: 4.5, label: "童" },
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
    exits: [
      { target: "foyer", x: 4.5, y: 7.75, label: "厅" },
      { target: "archive", x: 1.1, y: 4.5, label: "档" },
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
    exits: [
      { target: "archive", x: 4.5, y: 7.75, label: "档" },
      { target: "foyer", x: 1.1, y: 4.5, label: "厅" },
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
    exits: [
      { target: "foyer", x: 4.5, y: 7.75, label: "厅" },
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
  touch: {
    x: 0,
    y: 0,
    lookDragId: null,
    lookDragX: 0,
  },
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
  focusGameControls();
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
    window.addEventListener("keydown", (event) => handle3DKey(event, true), true);
    window.addEventListener("keyup", (event) => handle3DKey(event, false), true);
    window.addEventListener("resize", render3D);
  }
  if (typeof document.addEventListener === "function") {
    document.addEventListener("keydown", (event) => handle3DKey(event, true), true);
    document.addEventListener("keyup", (event) => handle3DKey(event, false), true);
  }
  if (dom.roomVisual && typeof dom.roomVisual.addEventListener === "function") {
    dom.roomVisual.addEventListener("pointerdown", focusGameControls);
    dom.roomVisual.addEventListener("touchstart", focusGameControls, { passive: true });
  }

  initTouchControls();
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
  const key = normalizeControlKey(event);
  const activeKeys = new Set(["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "e", "enter", "space"]);
  if (!activeKeys.has(key)) {
    return;
  }
  if (state.running && typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  if (isDown && (key === "e" || key === "enter" || key === "space")) {
    interactWithNearbyTarget();
    return;
  }
  if (isDown) {
    scene3d.keys.add(key);
  } else {
    scene3d.keys.delete(key);
  }
}

function normalizeControlKey(event) {
  const key = String(event.key || "").toLowerCase();
  const code = String(event.code || "").toLowerCase();
  const aliases = {
    keyw: "w",
    keya: "a",
    keys: "s",
    keyd: "d",
    keye: "e",
    space: "space",
    " ": "space",
    enter: "enter",
    arrowup: "arrowup",
    arrowdown: "arrowdown",
    arrowleft: "arrowleft",
    arrowright: "arrowright",
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright",
  };
  return aliases[code] || aliases[key] || key;
}

function focusGameControls() {
  const target = dom.roomVisual || scene3d.canvas;
  if (target && typeof target.focus === "function") {
    target.focus({ preventScroll: true });
  }
}

function initTouchControls() {
  if (isTouchCapableDevice()) {
    document.documentElement?.classList?.add("has-touch-controls");
  }
  bindTouchPad(dom.movePad, dom.moveKnob, "move");
  bindActionPad(dom.lookPad, dom.lookKnob);
}

function isTouchCapableDevice() {
  const points = typeof navigator === "undefined" ? 0 : navigator.maxTouchPoints || navigator.msMaxTouchPoints || 0;
  return points > 0 || (typeof window !== "undefined" && "ontouchstart" in window);
}

function bindTouchPad(pad, knob, type) {
  if (!pad || !knob || typeof pad.addEventListener !== "function") {
    return;
  }

  const update = (event) => {
    if (typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    const point = getTouchPoint(event);
    if (!point) {
      return;
    }
    const rect = typeof pad.getBoundingClientRect === "function"
      ? pad.getBoundingClientRect()
      : { left: 0, top: 0, width: 96, height: 96 };
    const radius = Math.max(1, Math.min(rect.width, rect.height) / 2);
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawX = point.clientX - centerX;
    const rawY = point.clientY - centerY;
    const distance = Math.min(radius, Math.hypot(rawX, rawY));
    const angle = Math.atan2(rawY, rawX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const normalizedX = clamp(x / radius, -1, 1);
    const normalizedY = clamp(y / radius, -1, 1);

    knob.style.transform = `translate3d(${normalizedX * 82}%, ${normalizedY * 82}%, 0)`;
    if (type === "move") {
      scene3d.touch.x = normalizedX;
      scene3d.touch.y = normalizedY;
    }
  };

  const reset = (event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    knob.style.transform = "translate3d(0, 0, 0)";
    if (type === "move") {
      scene3d.touch.x = 0;
      scene3d.touch.y = 0;
    }
  };

  pad.addEventListener("pointerdown", (event) => {
    if (typeof pad.setPointerCapture === "function") {
      pad.setPointerCapture(event.pointerId);
    }
    update(event);
  });
  pad.addEventListener("pointermove", (event) => {
    if (event.buttons || event.pressure > 0 || event.pointerType === "touch") {
      update(event);
    }
  });
  pad.addEventListener("pointerup", reset);
  pad.addEventListener("pointercancel", reset);
  pad.addEventListener("lostpointercapture", reset);
  pad.addEventListener("touchstart", update, { passive: false });
  pad.addEventListener("touchmove", update, { passive: false });
  pad.addEventListener("touchend", reset, { passive: false });
  pad.addEventListener("touchcancel", reset, { passive: false });
}

function bindActionPad(pad, knob) {
  if (!pad || !knob || typeof pad.addEventListener !== "function") {
    return;
  }

  const press = (event) => {
    if (typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    knob.style.transform = "translate3d(0, -18%, 0) scale(0.9)";
    interactWithNearbyTarget();
  };
  const reset = (event) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    knob.style.transform = "translate3d(0, 0, 0)";
  };

  pad.addEventListener("pointerdown", press);
  pad.addEventListener("pointerup", reset);
  pad.addEventListener("pointercancel", reset);
  pad.addEventListener("touchstart", press, { passive: false });
  pad.addEventListener("touchend", reset, { passive: false });
  pad.addEventListener("touchcancel", reset, { passive: false });
}

function bindViewportLookDrag() {
  const canvas = scene3d.canvas;
  if (!canvas || typeof canvas.addEventListener !== "function") {
    return;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }
    focusGameControls();
    scene3d.touch.lookDragId = event.pointerId;
    scene3d.touch.lookDragX = event.clientX;
    if (typeof canvas.setPointerCapture === "function") {
      canvas.setPointerCapture(event.pointerId);
    }
  });

  canvas.addEventListener("pointermove", (event) => {
    if (scene3d.touch.lookDragId !== event.pointerId || !state.running) {
      return;
    }
    if (typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    const rect = typeof canvas.getBoundingClientRect === "function"
      ? canvas.getBoundingClientRect()
      : { width: 720 };
    const deltaX = event.clientX - scene3d.touch.lookDragX;
    scene3d.touch.lookDragX = event.clientX;
    scene3d.player.angle += (deltaX / Math.max(1, rect.width)) * 2.8;
  });

  const endDrag = (event) => {
    if (scene3d.touch.lookDragId === event.pointerId) {
      scene3d.touch.lookDragId = null;
    }
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("touchstart", (event) => {
    const point = getTouchPoint(event);
    if (!point) {
      return;
    }
    focusGameControls();
    scene3d.touch.lookDragId = "touch";
    scene3d.touch.lookDragX = point.clientX;
  }, { passive: true });
  canvas.addEventListener("touchmove", (event) => {
    if (scene3d.touch.lookDragId !== "touch" || !state.running) {
      return;
    }
    const point = getTouchPoint(event);
    if (!point) {
      return;
    }
    if (typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    const rect = typeof canvas.getBoundingClientRect === "function"
      ? canvas.getBoundingClientRect()
      : { width: 720 };
    const deltaX = point.clientX - scene3d.touch.lookDragX;
    scene3d.touch.lookDragX = point.clientX;
    scene3d.player.angle += (deltaX / Math.max(1, rect.width)) * 2.8;
  }, { passive: false });
  canvas.addEventListener("touchend", () => {
    if (scene3d.touch.lookDragId === "touch") {
      scene3d.touch.lookDragId = null;
    }
  }, { passive: true });
  canvas.addEventListener("touchcancel", () => {
    if (scene3d.touch.lookDragId === "touch") {
      scene3d.touch.lookDragId = null;
    }
  }, { passive: true });
}

function getTouchPoint(event) {
  if (event.touches?.length) {
    return event.touches[0];
  }
  if (event.changedTouches?.length) {
    return event.changedTouches[0];
  }
  if (typeof event.clientX === "number" && typeof event.clientY === "number") {
    return event;
  }
  return null;
}

function reset3DPlayer(roomName) {
  const start = scenes3d[roomName]?.start || scenes3d.foyer.start;
  scene3d.player = { ...start, facingX: 0, facingY: 1 };
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

  const moveSpeed = state.battery < 20 ? 1.6 : 2.25;
  const player = scene3d.player;
  const keyX = (scene3d.keys.has("d") || scene3d.keys.has("arrowright") ? 1 : 0)
    - (scene3d.keys.has("a") || scene3d.keys.has("arrowleft") ? 1 : 0);
  const keyY = (scene3d.keys.has("s") || scene3d.keys.has("arrowdown") ? 1 : 0)
    - (scene3d.keys.has("w") || scene3d.keys.has("arrowup") ? 1 : 0);
  let inputX = clamp(keyX + scene3d.touch.x, -1, 1);
  let inputY = clamp(keyY + scene3d.touch.y, -1, 1);
  const length = Math.hypot(inputX, inputY);

  if (length > 1) {
    inputX /= length;
    inputY /= length;
  }

  if (length > 0.08) {
    player.facingX = inputX;
    player.facingY = inputY;
    const step = moveSpeed * delta;
    move3DPlayer(scene, player.x + inputX * step, player.y + inputY * step);
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
  ctx.imageSmoothingEnabled = false;
  const width = canvas.width;
  const height = canvas.height;
  if (!width || !height) {
    return;
  }

  const layout = getTopdownLayout(scene, width, height);
  drawTopdownBackground(ctx, scene, width, height);
  drawTopdownMap(ctx, scene, layout);
  drawTopdownExits(ctx, scene, layout);
  drawTopdownProps(ctx, scene, layout);
  drawTopdownPlayer(ctx, layout);
  drawTopdownHud(ctx, scene, layout, width, height);
}

function getTopdownLayout(scene, width, height) {
  const mapWidth = scene.map[0].length;
  const mapHeight = scene.map.length;
  const tile = Math.floor(Math.min(width / (mapWidth + 2.2), height / (mapHeight + 2.2)));
  return {
    tile,
    mapWidth,
    mapHeight,
    originX: Math.floor((width - mapWidth * tile) / 2),
    originY: Math.floor((height - mapHeight * tile) / 2),
  };
}

function worldToScreen(layout, x, y) {
  return {
    x: layout.originX + x * layout.tile,
    y: layout.originY + y * layout.tile,
  };
}

function pixelRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function drawTopdownBackground(ctx, scene, width, height) {
  pixelRect(ctx, 0, 0, width, height, "#050407");
  const block = Math.max(8, Math.floor(width / 80));
  for (let y = 0; y < height; y += block) {
    for (let x = 0; x < width; x += block) {
      const shade = ((x / block + y / block) % 5 === 0) ? "rgba(255, 255, 255, 0.018)" : "rgba(0, 0, 0, 0.08)";
      pixelRect(ctx, x, y, block, block, shade);
    }
  }
  ctx.fillStyle = scene.fog;
  ctx.fillRect(0, 0, width, height);
}

function drawTopdownMap(ctx, scene, layout) {
  const { tile, mapWidth, mapHeight, originX, originY } = layout;
  pixelRect(ctx, originX - tile * 0.38, originY - tile * 0.38, mapWidth * tile + tile * 0.76, mapHeight * tile + tile * 0.76, "rgba(0, 0, 0, 0.55)");

  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      const screenX = originX + x * tile;
      const screenY = originY + y * tile;
      const isWall = scene.map[y][x] !== "0";
      const pixel = Math.max(3, Math.floor(tile / 9));
      if (isWall) {
        pixelRect(ctx, screenX, screenY, tile, tile, scene.wall);
        pixelRect(ctx, screenX, screenY + tile * 0.68, tile, tile * 0.32, "rgba(0, 0, 0, 0.38)");
        pixelRect(ctx, screenX + pixel, screenY + pixel, tile - pixel * 2, pixel, "rgba(246, 222, 192, 0.08)");
        if ((x + y) % 2 === 0) {
          pixelRect(ctx, screenX + tile * 0.14, screenY + tile * 0.28, tile * 0.54, pixel, "rgba(0, 0, 0, 0.22)");
        }
        if ((x * 3 + y) % 5 === 0) {
          pixelRect(ctx, screenX + tile * 0.62, screenY + tile * 0.18, pixel, tile * 0.52, "rgba(179, 38, 53, 0.22)");
        }
      } else {
        pixelRect(ctx, screenX, screenY, tile, tile, scene.floor);
        pixelRect(ctx, screenX, screenY, tile, tile, ((x + y) % 2 === 0) ? "rgba(255, 255, 255, 0.025)" : "rgba(0, 0, 0, 0.08)");
        pixelRect(ctx, screenX, screenY, tile, pixel, "rgba(246, 222, 192, 0.035)");
        pixelRect(ctx, screenX, screenY, pixel, tile, "rgba(246, 222, 192, 0.025)");
        if ((x * 7 + y * 11) % 9 === 0) {
          pixelRect(ctx, screenX + tile * 0.25, screenY + tile * 0.45, pixel * 2, pixel, "rgba(217, 161, 95, 0.16)");
        }
      }
    }
  }
}

function drawTopdownProps(ctx, scene, layout) {
  getVisible3DProps(scene)
    .slice()
    .sort((a, b) => a.y - b.y)
    .forEach((prop) => drawTopdownProp(ctx, prop, layout));
}

function drawTopdownExits(ctx, scene, layout) {
  (scene.exits || []).forEach((exit) => {
    const point = worldToScreen(layout, exit.x, exit.y);
    const size = layout.tile * 0.56;
    const nearby = getNearbyExit()?.exit === exit;
    const enabled = isExitEnabled(exit);
    const color = enabled ? "#57b79d" : "#4b3a35";
    const px = Math.max(3, Math.floor(layout.tile / 10));

    ctx.save();
    ctx.translate(point.x, point.y);
    pixelRect(ctx, -size * 0.55, -size * 0.42, size * 1.1, size * 0.84, color);
    pixelRect(ctx, -size * 0.42, -size * 0.28, size * 0.84, px * 2, enabled ? "rgba(226, 255, 238, 0.28)" : "rgba(0,0,0,0.22)");
    pixelRect(ctx, -size * 0.5, size * 0.28, size, px * 2, "rgba(0,0,0,0.28)");
    ctx.fillStyle = enabled ? "#08110f" : "rgba(246,222,192,0.45)";
    ctx.font = `${Math.max(12, size * 0.4)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(exit.label, 0, -px * 0.2);
    if (nearby) {
      pixelRect(ctx, -size * 0.72, -size * 0.62, size * 1.44, px, "rgba(158, 212, 192, 0.95)");
      pixelRect(ctx, -size * 0.72, size * 0.58, size * 1.44, px, "rgba(158, 212, 192, 0.95)");
      pixelRect(ctx, -size * 0.75, -size * 0.58, px, size * 1.16, "rgba(158, 212, 192, 0.95)");
      pixelRect(ctx, size * 0.72, -size * 0.58, px, size * 1.16, "rgba(158, 212, 192, 0.95)");
    }
    ctx.restore();
  });
}

function drawTopdownProp(ctx, prop, layout) {
  const point = worldToScreen(layout, prop.x, prop.y);
  const size = layout.tile * (prop.size || 1) * 0.56;
  const nearby = getNearbyProp()?.prop === prop;
  const px = Math.max(3, Math.floor(layout.tile / 10));

  ctx.save();
  ctx.translate(point.x, point.y);
  const colors = {
    door: "#3a1d22",
    plate: "#5b3724",
    cabinet: "#3d2a20",
    shelves: "#33261f",
    lamp: state.flags.has("archiveLit") ? "#e3a84f" : "#59412a",
    mirror: "#87a99e",
    tape: "#1b1417",
    fridge: state.flags.has("openedFridge") ? "#a7f4d4" : "#30413a",
    sink: "#646154",
    bed: "#4a2740",
    doll: state.flags.has("foundDoll") ? "rgba(199, 180, 155, 0.26)" : "#c7b49b",
    musicbox: "#6a3d26",
    closet: "#321923",
    stairs: "#211915",
    well: "#11140f",
    salt: "#f5edd3",
    shadow: "rgba(0, 0, 0, 0.82)",
  };

  ctx.fillStyle = colors[prop.type] || "#6a4b3e";
  pixelRect(ctx, -size * 0.45, size * 0.32, size * 0.9, px * 2, "rgba(0, 0, 0, 0.36)");
  if (prop.type === "salt") {
    for (let i = 0; i < 18; i += 1) {
      const angle = (i / 18) * Math.PI * 2;
      pixelRect(ctx, Math.cos(angle) * size * 0.72, Math.sin(angle) * size * 0.34, px, px, colors.salt);
    }
  } else if (prop.type === "well") {
    pixelRect(ctx, -size * 0.62, -size * 0.28, size * 1.24, size * 0.56, colors.well);
    pixelRect(ctx, -size * 0.42, -size * 0.16, size * 0.84, size * 0.32, "#020202");
    pixelRect(ctx, -size * 0.58, -size * 0.34, px * 2, size * 0.68, "rgba(246, 222, 192, 0.18)");
  } else if (prop.type === "shadow") {
    pixelRect(ctx, -size * 0.16, -size * 0.52, size * 0.32, size * 0.94, colors.shadow);
    pixelRect(ctx, -size * 0.28, -size * 0.18, size * 0.56, size * 0.42, "rgba(0, 0, 0, 0.72)");
    pixelRect(ctx, -size * 0.1, -size * 0.28, px, px, "rgba(255, 245, 220, 0.58)");
    pixelRect(ctx, size * 0.08, -size * 0.28, px, px, "rgba(255, 245, 220, 0.58)");
  } else {
    drawPixelPropSprite(ctx, prop, size, px, colors[prop.type] || "#6a4b3e");
  }

  if (nearby) {
    pixelRect(ctx, -size * 0.68, -size * 0.62, size * 1.36, px, "rgba(255, 239, 179, 0.88)");
    pixelRect(ctx, -size * 0.68, size * 0.58, size * 1.36, px, "rgba(255, 239, 179, 0.88)");
    pixelRect(ctx, -size * 0.72, -size * 0.58, px, size * 1.16, "rgba(255, 239, 179, 0.88)");
    pixelRect(ctx, size * 0.68, -size * 0.58, px, size * 1.16, "rgba(255, 239, 179, 0.88)");
  }

  ctx.restore();
}

function drawPixelPropSprite(ctx, prop, size, px, color) {
  if (prop.type === "door") {
    pixelRect(ctx, -size * 0.38, -size * 0.58, size * 0.76, size * 1.05, "#2a1117");
    pixelRect(ctx, -size * 0.28, -size * 0.46, size * 0.56, size * 0.82, color);
    pixelRect(ctx, size * 0.18, -size * 0.05, px * 1.5, px * 1.5, "#e0ac62");
    drawTopdownPropGlyph(ctx, prop, size);
    return;
  }
  if (prop.type === "lamp") {
    const lit = state.flags.has("archiveLit");
    pixelRect(ctx, -px, -size * 0.5, px * 2, size, "#2b2016");
    pixelRect(ctx, -size * 0.24, -size * 0.44, size * 0.48, size * 0.28, lit ? "#f0bd57" : color);
    if (lit) {
      pixelRect(ctx, -size * 0.42, -size * 0.56, size * 0.84, px, "rgba(255, 225, 138, 0.55)");
      pixelRect(ctx, -size * 0.34, -size * 0.18, size * 0.68, px, "rgba(255, 225, 138, 0.35)");
    }
    return;
  }
  if (prop.type === "fridge" && state.flags.has("openedFridge")) {
    pixelRect(ctx, -size * 0.42, -size * 0.52, size * 0.55, size * 0.95, "#30413a");
    pixelRect(ctx, size * 0.05, -size * 0.5, size * 0.42, size * 0.92, "#a7f4d4");
    pixelRect(ctx, size * 0.12, -size * 0.38, size * 0.24, px * 2, "#e7fff2");
    return;
  }
  if (prop.type === "doll") {
    pixelRect(ctx, -size * 0.16, -size * 0.5, size * 0.32, size * 0.28, color);
    pixelRect(ctx, -size * 0.24, -size * 0.2, size * 0.48, size * 0.54, "#4a2740");
    pixelRect(ctx, -size * 0.08, -size * 0.42, px, px, "#050505");
    pixelRect(ctx, size * 0.07, -size * 0.42, px, px, "#050505");
    return;
  }
  pixelRect(ctx, -size * 0.48, -size * 0.38, size * 0.96, size * 0.76, color);
  pixelRect(ctx, -size * 0.38, -size * 0.28, size * 0.76, px * 1.4, "rgba(255, 255, 255, 0.12)");
  pixelRect(ctx, -size * 0.48, size * 0.28, size * 0.96, px * 2, "rgba(0, 0, 0, 0.25)");
  drawTopdownPropGlyph(ctx, prop, size);
}

function drawTopdownPropGlyph(ctx, prop, size) {
  const glyphs = {
    door: "13",
    plate: "13",
    cabinet: "柜",
    shelves: "档",
    lamp: "灯",
    mirror: "镜",
    tape: "带",
    fridge: "冰",
    sink: "槽",
    bed: "床",
    doll: "偶",
    musicbox: "盒",
    closet: "柜",
    stairs: "梯",
  };
  const glyph = prop.label || glyphs[prop.type];
  if (!glyph) {
    return;
  }
  ctx.fillStyle = prop.type === "fridge" && state.flags.has("openedFridge") ? "#071512" : "rgba(255, 244, 224, 0.88)";
  ctx.font = `${Math.max(12, size * 0.34)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, 0, 0);
}

function drawTopdownPlayer(ctx, layout) {
  const point = worldToScreen(layout, scene3d.player.x, scene3d.player.y);
  const size = layout.tile * 0.36;
  const pulse = Math.sin(Date.now() / 180) * layout.tile * 0.025;
  const px = Math.max(3, Math.floor(layout.tile / 10));

  ctx.save();
  ctx.translate(point.x, point.y + pulse);
  pixelRect(ctx, -size * 0.56, size * 0.5, size * 1.12, px * 2, "rgba(0, 0, 0, 0.34)");
  pixelRect(ctx, -size * 0.28, -size * 0.72, size * 0.56, size * 0.38, "#f0d5b0");
  pixelRect(ctx, -size * 0.36, -size * 0.32, size * 0.72, size * 0.78, "#7e2631");
  pixelRect(ctx, -size * 0.5, -size * 0.22, size * 0.18, size * 0.48, "#4d151c");
  pixelRect(ctx, size * 0.32, -size * 0.22, size * 0.18, size * 0.48, "#4d151c");
  pixelRect(ctx, -size * 0.28, size * 0.42, size * 0.2, size * 0.28, "#211317");
  pixelRect(ctx, size * 0.08, size * 0.42, size * 0.2, size * 0.28, "#211317");
  pixelRect(ctx, -size * 0.12, -size * 0.58, px, px, "#13090b");
  pixelRect(ctx, size * 0.08, -size * 0.58, px, px, "#13090b");
  pixelRect(
    ctx,
    scene3d.player.facingX * size * 0.42 - px / 2,
    scene3d.player.facingY * size * 0.42 - px / 2,
    px,
    px,
    "#ffe7a0"
  );
  ctx.restore();
}

function drawTopdownHud(ctx, scene, layout, width, height) {
  const player = worldToScreen(layout, scene3d.player.x, scene3d.player.y);
  const light = ctx.createRadialGradient(player.x, player.y, layout.tile * 0.6, player.x, player.y, layout.tile * (state.battery < 20 ? 3 : 4.8));
  light.addColorStop(0, "rgba(255, 229, 168, 0.16)");
  light.addColorStop(0.5, "rgba(0, 0, 0, 0)");
  light.addColorStop(1, "rgba(0, 0, 0, 0.78)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = `rgba(179, 38, 53, ${state.dread / 420})`;
  ctx.fillRect(0, 0, width, height);

  drawCanvasStatusHud(ctx, width, height, layout);

  const nearby = getNearbyTarget();
  if (nearby) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctx.fillRect(width / 2 - layout.tile * 3.1, height - layout.tile * 1.1, layout.tile * 6.2, layout.tile * 0.62);
    ctx.strokeStyle = "rgba(217, 161, 95, 0.45)";
    ctx.strokeRect(width / 2 - layout.tile * 3.1, height - layout.tile * 1.1, layout.tile * 6.2, layout.tile * 0.62);
    ctx.fillStyle = "#f8e4bf";
    ctx.font = `${Math.max(12, layout.tile * 0.22)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nearby.label, width / 2, height - layout.tile * 0.79);
  }
}

function drawCanvasStatusHud(ctx, width, height, layout) {
  const pad = Math.max(12, layout.tile * 0.28);
  const barWidth = Math.max(150, layout.tile * 3.6);
  const barHeight = Math.max(8, layout.tile * 0.16);
  pixelRect(ctx, pad, pad, barWidth + pad, layout.tile * 1.16, "rgba(0,0,0,0.58)");
  drawCanvasBar(ctx, pad * 1.45, pad * 1.45, barWidth, barHeight, state.battery / 100, "#d9a15f");
  drawCanvasBar(ctx, pad * 1.45, pad * 1.45 + barHeight * 1.8, barWidth, barHeight, state.dread / 100, "#ff4057");

  const sealX = width - pad - layout.tile * 1.65;
  const sealY = pad * 1.25;
  ["mirror", "doll", "well"].forEach((seal, index) => {
    const found = state.seals.has(seal);
    const x = sealX - index * layout.tile * 0.62;
    pixelRect(ctx, x, sealY, layout.tile * 0.42, layout.tile * 0.42, found ? "#d9a15f" : "rgba(246,222,192,0.16)");
    ctx.fillStyle = found ? "#160b08" : "rgba(246,222,192,0.34)";
    ctx.font = `${Math.max(12, layout.tile * 0.22)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText({ mirror: "镜", doll: "偶", well: "井" }[seal], x + layout.tile * 0.21, sealY + layout.tile * 0.21);
  });

  if (state.log[0]) {
    pixelRect(ctx, pad, height - pad - layout.tile * 0.58, Math.min(width - pad * 2, layout.tile * 7), layout.tile * 0.42, "rgba(0,0,0,0.5)");
    ctx.fillStyle = "rgba(246,222,192,0.78)";
    ctx.font = `${Math.max(11, layout.tile * 0.16)}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(state.log[0].slice(0, 28), pad * 1.35, height - pad - layout.tile * 0.36);
  }
}

function drawCanvasBar(ctx, x, y, width, height, value, color) {
  pixelRect(ctx, x, y, width, height, "rgba(246,222,192,0.16)");
  pixelRect(ctx, x, y, width * clamp(value, 0, 1), height, color);
  pixelRect(ctx, x, y + height - 2, width * clamp(value, 0, 1), 2, "rgba(0,0,0,0.25)");
}

function getNearbyProp() {
  const scene = scenes3d[state.room];
  if (!scene) {
    return null;
  }
  let nearest = null;
  scene.props.forEach((prop) => {
    const action = getPropAction(prop);
    if (!action) {
      return;
    }
    const distance = Math.hypot(prop.x - scene3d.player.x, prop.y - scene3d.player.y);
    if (distance <= 1.18 && (!nearest || distance < nearest.distance)) {
      nearest = { prop, action, distance, label: action.label };
    }
  });
  return nearest;
}

function getNearbyExit() {
  const scene = scenes3d[state.room];
  if (!scene) {
    return null;
  }
  let nearest = null;
  (scene.exits || []).forEach((exit) => {
    const distance = Math.hypot(exit.x - scene3d.player.x, exit.y - scene3d.player.y);
    if (distance <= 1.05 && (!nearest || distance < nearest.distance)) {
      nearest = {
        exit,
        distance,
        label: isExitEnabled(exit) ? `进入 ${rooms[exit.target].name}` : "锁住了",
      };
    }
  });
  return nearest;
}

function getNearbyTarget() {
  const prop = getNearbyProp();
  const exit = getNearbyExit();
  if (prop && exit) {
    return prop.distance <= exit.distance ? prop : exit;
  }
  return prop || exit;
}

function isExitEnabled(exit) {
  const room = rooms[state.room];
  const match = room?.exits.find(([target]) => target === exit.target);
  if (!match) {
    return false;
  }
  const enabledCheck = match[2];
  return !enabledCheck || enabledCheck(state);
}

function getPropAction(prop) {
  const room = rooms[state.room];
  if (!room) {
    return null;
  }
  const actionId = getPropActionId(prop);
  if (!actionId) {
    return null;
  }
  return room.actions.find((action) => action.id === actionId) || null;
}

function getPropActionId(prop) {
  if (state.room === "foyer") {
    if (prop.type === "plate" || prop.type === "door") return "plate";
    if (prop.type === "cabinet") return "cabinet";
  }
  if (state.room === "archive") {
    if (prop.type === "lamp") return "lamp";
    if (prop.type === "mirror") return "mirror";
    if (prop.type === "tape") return "tape";
  }
  if (state.room === "kitchen") {
    if (prop.type === "sink") return "sink";
    if (prop.type === "fridge") return "fridge";
  }
  if (state.room === "childroom") {
    if (prop.type === "doll" || prop.type === "bed") return "doll";
    if (prop.type === "musicbox") return "music";
    if (prop.type === "closet") return "closet";
  }
  if (state.room === "basement") {
    if (prop.type === "salt") return "ritual";
    if (prop.type === "well") return state.flags.has("saltCircle") ? "ritual" : "listenWell";
    if (prop.type === "stairs") return "circle";
  }
  return null;
}

function interactWithNearbyTarget() {
  if (!state.running || state.ritual.active) {
    return;
  }
  const exit = getNearbyExit();
  if (exit && (!getNearbyProp() || exit.distance <= getNearbyProp().distance)) {
    if (!isExitEnabled(exit.exit)) {
      game.log("这扇门还打不开。");
      render();
      return;
    }
    moveTo(exit.exit.target);
    return;
  }
  const nearby = getNearbyProp();
  if (!nearby?.action) {
    game.log("附近没有可以调查的东西。");
    render();
    return;
  }
  const action = nearby.action;
  const alreadyDone = action.once && state.flags.has(action.once);
  const enabled = !alreadyDone && (!action.enabled || action.enabled(state));
  if (!enabled) {
    game.log(action.disabledText ? `还不能这么做：${action.disabledText}。` : "现在还不能这么做。");
    render();
    return;
  }
  runAction(action);
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
