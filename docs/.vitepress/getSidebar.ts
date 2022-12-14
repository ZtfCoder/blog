import { DefaultTheme } from "vitepress";

var fs = require("fs");

/**
 * 是否是文件
 * @param path
 * @returns
 */
const isFiles = (path) => {
  return new Promise((resolve) => {
    fs.stat(path, (err, stats) => {
      resolve(stats.isFile());
    });
  });
};

const readMd = (path1, path2, item): DefaultTheme.SidebarItem[] => {
  const list: DefaultTheme.SidebarItem[] = [];

  const files = fs.readdirSync(path1 + path2);

  files.forEach((file) => {
    const index = file.lastIndexOf(".md");
    if (index != -1) {
      const text = file.replace(".md", "");
      list.push({
        text,
        link: `${item}${path2}/${text}`,
      });
    }
  });
  return list;
};

export default (...originPath: string[]): DefaultTheme.Sidebar => {
  const jsonFiles: DefaultTheme.Sidebar = {};
  debugger;
  originPath.forEach((item) => {
    let path = "./docs" + item;
    jsonFiles[item] = [];
    const files = fs.readdirSync(path);
    files.forEach(async (file) => {
      const flag = await isFiles(path + file);
      if (!flag) {
        const list: DefaultTheme.SidebarItem[] = readMd(path, file, item);
        jsonFiles[item].push({
          text: file,
          items: list,
          collapsed: true, // 关闭
          collapsible: true, // 是否显示折叠按钮
        });
      }
    });
  });
  return jsonFiles;
};
