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

const readMd = (path1, path2): DefaultTheme.SidebarItem[] => {
  const list: DefaultTheme.SidebarItem[] = [];
  fs.readdir(path1 + path2, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      const index = file.lastIndexOf(".md");
      if (index != -1) {
        const text = file.replace(".md", "");
        list.push({
          text,
          link: `/main/${path2}/${text}`,
        });
      }
    });
  });
  return list;
};

export default (): DefaultTheme.Sidebar => {
  const jsonFiles: DefaultTheme.Sidebar = [];
  let path = "./docs/main/";
  fs.readdir(path, (err, files) => {
    if (err) {
      return console.error(err);
    }
    files.forEach(async (file) => {
      const flag = await isFiles(path + file);
      if (!flag) {
        const list: DefaultTheme.SidebarItem[] = readMd(path, file);
        jsonFiles.push({
          text: file,
          items: list,
        });
      }
    });
  });
  return jsonFiles;
};
