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
  dom.roomVisual.style.setProperty("--room-bg", room.bg);
  dom.roomVisual.style.setProperty("--lamp-x", room.lamp[0]);
  dom.roomVisual.style.setProperty("--lamp-y", room.lamp[1]);
  dom.roomVisual.style.setProperty("--flashlight-strength", String(0.22 + state.battery / 125));
  dom.roomVisual.style.setProperty("--flicker-opacity", String(0.24 + state.dread / 170));

  renderActions(room);
  renderExits(room);
  renderInventory();
  renderSeals();
  renderLog();
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

render();
