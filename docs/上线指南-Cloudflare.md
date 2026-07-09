# 阿发水晶阁 · 上线到 Cloudflare（含 CRM 云端后台）

全程**免费**（Cloudflare 免费额度对小店完全够用），大概 20 分钟。
跟着点几下就好，不用写代码。

---

## 你会得到

- 一个**永久免费的公网网址**（例如 `https://ahhuat-crystal.pages.dev`，也可换成自己的域名）
- **云端 CRM 后台**：老板加的水晶/产品所有客人都看得到；网页下单自动进后台；订单、客户、销售统计。

---

## 第 1 步：注册 Cloudflare 账号

1. 打开 https://dash.cloudflare.com/sign-up
2. 用邮箱注册、验证邮箱、登录。（免费计划即可，不用绑卡）

## 第 2 步：把代码放上 GitHub（已经有了）

代码已经在这个仓库：`blessingfoodsdnbhd-spec/desmond`，分支 `claude/jewelry-diy-app-ec4kjm`。
无需操作。（如果以后要用 `main` 分支，把这个分支合并到 main 即可。）

## 第 3 步：创建 D1 数据库（存 CRM 数据）

1. Cloudflare 左侧菜单 → **Storage & Databases** → **D1 SQL Database** → **Create**
2. 名称填：`ahhuat` → 创建
3. 进入这个数据库 → 上方 **Console**（控制台）
4. 打开仓库里的 `schema.sql`，**整个文件内容复制**，粘贴进 Console，点 **Execute**（执行）。
   - 看到成功建了 products / beads / orders / customers / settings 等表就对了。

## 第 4 步：创建 Pages 项目（网站本体）

1. 左侧菜单 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 GitHub，选择仓库 `blessingfoodsdnbhd-spec/desmond`
3. **Production branch（生产分支）** 选：`claude/jewelry-diy-app-ec4kjm`
4. 构建设置（Build settings）：
   - **Framework preset**：`None`（或 Vite）
   - **Build command（构建命令）**：`npm run build`
   - **Build output directory（输出目录）**：`dist`
5. 点 **Save and Deploy**，等它构建完成（1–2 分钟），会给你一个网址 `xxx.pages.dev`。

## 第 5 步：绑定数据库 + 设置密码（关键）

进入这个 Pages 项目 → **Settings（设置）**：

**A. 绑定 D1 数据库**
- 找到 **Functions** → **D1 database bindings** → **Add binding**
- Variable name（变量名）填：`DB`（**必须是 DB，大写**）
- D1 database 选：`ahhuat`
- 保存

**B. 设置环境变量**
- 找到 **Environment variables（环境变量）** → 在 **Production** 下 **Add variable**：
  - `ADMIN_PASSWORD` = 你要的后台登录密码（例如 `ahhuat888`，建议改成自己的）
  - `AUTH_SECRET` = 随便打一长串字母数字（例如 `ah9x7kQ2pLmZ...`，越长越好，用来加密登录）
- 保存

**C. 重新部署让设置生效**
- 回到 **Deployments** → 最新那次 → 右边 **⋯** → **Retry deployment**（或推一次代码触发重建）

## 第 6 步：完成 ✅

- 打开你的 `xxx.pages.dev`，就是正式网站。
- 进「我的 → 商家后台」，用第 5 步设的密码登录。
- 现在后台加的**水晶/产品会存到云端**，所有客人打开网站都看得到。
- 「统计 / 订单 / 客户」三个页面开始工作：客人在网页下单会自动进「订单」，并累计到「客户」和「统计」。

---

## 常见问题

- **要钱吗？** 免费额度：Pages 无限请求、D1 每天 5 百万次读 / 10 万次写、5GB 存储 —— 小店用不完。
- **想用自己的域名？** Pages 项目 → **Custom domains** → 添加你的域名，按提示改 DNS 即可。
- **改后台密码？** 改 `ADMIN_PASSWORD` 环境变量后 Retry deployment；或登录后台在「设置」里改（会存到数据库）。
- **WhatsApp 下单还在吗？** 在。网页下单会**同时**记进云端后台 + 跳转 WhatsApp，两边都有。
- **本地/离线版（githack、jsDelivr、单文件 zip）** 没有云端后台，后台里「统计/订单/客户」会提示需要上线到 Cloudflare —— 这是正常的，只有 `.pages.dev` 正式版才有云端 CRM。
