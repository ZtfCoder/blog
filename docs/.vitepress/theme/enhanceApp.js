export default ({ app, router, siteData }) => {
  if (typeof window !== "undefined") {
    window.previewImage = (src) => {
      if (!src) {
        return;
      }
      // 禁用页面滚动
      document.body.style.overflow = "hidden";

      // 创建模态框
      const modal = createModal();
      const { img, scaleText } = createImageWithScale(src);

      modal.appendChild(img);
      modal.appendChild(scaleText);
      document.body.appendChild(modal);

      // 添加动画效果
      requestAnimationFrame(() => {
        modal.style.opacity = "1";
        img.style.transform = "scale(1)";
      });

      // 添加事件监听
      addEventListeners(modal, img, scaleText);
    };
  }
};

/**
 * 创建模态框元素
 * @returns {HTMLElement} 模态框元素
 */
function createModal() {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "1000";
  modal.style.opacity = "0";
  modal.style.transition = "opacity 0.3s";
  return modal;
}

/**
 * 创建包含图片和比例文本的容器
 * @param {string} src 图片的源地址
 * @returns {Object} 包含图片和比例文本的对象
 */
function createImageWithScale(src) {
  const imgContainer = document.createElement("div");
  imgContainer.style.position = "relative";
  imgContainer.style.display = "flex";
  imgContainer.style.alignItems = "center";
  imgContainer.style.justifyContent = "center";

  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";
  img.style.transition = "transform 0.3s";
  img.style.transform = "scale(1)";
  img.style.cursor = "zoom-in";

  const scaleText = document.createElement("div");
  scaleText.style.position = "absolute";
  scaleText.style.bottom = "10px";
  scaleText.style.left = "50%";
  scaleText.style.transform = "translateX(-50%)";
  scaleText.style.color = "white";
  scaleText.style.fontSize = "16px";
  scaleText.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  scaleText.style.padding = "5px 10px";
  scaleText.style.borderRadius = "5px";
  scaleText.textContent = "100%";

  imgContainer.appendChild(img);
  imgContainer.appendChild(scaleText);

  return { img: imgContainer, scaleText };
}

/**
 * 为图片和模态框添加事件监听器
 * @param {HTMLElement} modal 模态框元素
 * @param {HTMLElement} img 图片元素
 * @param {HTMLElement} scaleText 比例文本元素
 */
function addEventListeners(modal, img, scaleText) {
  let scale = 1;

  // 点击图片放大和缩小
  img.addEventListener("click", () => {
    if (scale === 1) {
      scale = 2;
      img.style.cursor = "zoom-out";
    } else {
      scale = 1;
      img.style.cursor = "zoom-in";
    }
    img.style.transform = `scale(${scale})`;
    scaleText.textContent = `${scale * 100}%`;
  });

  // 滚动鼠标滚轮放大和缩小
  img.addEventListener("wheel", (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      scale = Math.min(scale + 0.1, 5); // 最大放大到5倍
    } else {
      scale = Math.max(scale - 0.1, 1); // 最小缩小到1倍
    }
    img.style.transform = `scale(${scale})`;
    scaleText.textContent = `${Math.round(scale * 100)}%`;
  });

  // 点击模态框关闭
  modal.addEventListener("click", (event) => {
    if (event.target !== img) {
      // 添加淡出动画
      modal.style.opacity = "0";
      img.style.transform = "scale(0.8)";
      setTimeout(() => {
        document.body.removeChild(modal);
        // 恢复页面滚动
        document.body.style.overflow = "";
      }, 300); // 等待动画完成后移除模态框
    }
  });
}
