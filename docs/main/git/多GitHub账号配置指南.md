# 多 GitHub 账号配置指南

本文档说明如何在一台电脑上配置多个 GitHub 账号，实现不同项目使用不同账号进行代码管理。

## 1. 生成 SSH 密钥

为每个 GitHub 账号生成独立的 SSH 密钥：

```bash
# 工作账号
ssh-keygen -t ed25519 -C "work@email.com" -f ~/.ssh/id_ed25519_work

# 个人账号（例如 xiaogun）
ssh-keygen -t ed25519 -C "personal@email.com" -f ~/.ssh/id_ed25519_xiaogun
```

生成后会得到两个文件：

- `id_ed25519_xxx` - 私钥（保留在本地，不要泄露）
- `id_ed25519_xxx.pub` - 公钥（需要添加到 GitHub）

## 2. 配置 SSH Config

编辑 `~/.ssh/config` 文件，为每个账号配置不同的 Host：

```
# 工作账号
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work

# 个人账号
Host github-xiaogun
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_xiaogun
```

## 3. 添加公钥到 GitHub

1. 查看公钥内容：

```bash
cat ~/.ssh/id_ed25519_xiaogun.pub
```

2. 复制输出内容

3. 登录对应的 GitHub 账号，进入：Settings → SSH and GPG keys → New SSH key

4. 粘贴公钥内容并保存

## 4. 验证配置

测试 SSH 连接是否成功：

```bash
ssh -T git@github-xiaogun
```

成功会显示：

```
Hi xiaogun! You've successfully authenticated, but GitHub does not provide shell access.
```

## 5. 克隆仓库

使用配置的 Host 名称替换 `github.com`：

```bash
# 原地址
git clone git@github.com:xiaogun/repo-name.git

# 改为
git clone git@github-xiaogun:xiaogun/repo-name.git
```

## 6. 已有仓库切换账号

修改仓库的 remote 地址：

```bash
git remote set-url origin git@github-xiaogun:xiaogun/repo-name.git
```

## 7. 设置项目级别的 Git 用户

在项目目录下执行（不带 `--global`）：

```bash
cd your-project

# 设置用户名
git config user.name "xiaogun"

# 设置邮箱
git config user.email "xiaogun@email.com"
```

查看当前项目配置：

```bash
git config --list --local
```

## 注意事项

- 项目级别的配置只影响当前项目，不会影响其他项目或其他用户
- 配置存储在项目的 `.git/config` 文件中，不会被提交到仓库
