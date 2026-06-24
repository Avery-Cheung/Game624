# 午夜第十三户

一个可直接在浏览器中运行的网页恐怖小游戏。玩家需要在凌晨 00:13 后进入不存在的第十三户，探索房间、收集三枚印记，并在恐惧值满格前完成地下室封印。

## 玩法

- 打开 `index.html` 即可游玩。
- 主画面是第一人称 3D 视角，可以用 `WASD` 或方向键移动/转向。
- 点击房间行动按钮探索线索、获取物品和印记。
- 手电电量会随行动和时间下降，恐惧侵蚀会逐渐上升。
- 收集「镜」「偶」「井」三枚印记，并找到粗盐后，在地下室完成封印仪式。
- 注意调查记录里的顺序提示，仪式按错会大幅增加恐惧值。

## 本地运行

可以直接双击 `index.html`，也可以用任意静态服务器启动：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy-pages.yml`。合并到 `main` 后，workflow 会把 `index.html`、`styles.css`、`game.js` 和 `README.md` 打包并部署到 GitHub Pages。

如果第一次部署提示 Pages 未启用，请仓库管理员在 GitHub 仓库页面执行：

1. 打开 **Settings -> Pages**。
2. 将 **Build and deployment -> Source** 设置为 **GitHub Actions**。
3. 回到 **Actions** 页面，重新运行 `Deploy web game to GitHub Pages`。

默认访问地址通常是 <https://avery-cheung.github.io/Game624/>。
