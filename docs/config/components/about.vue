<template>
  <div class="box">
    <div class="main">
      <div class="about-img">
        <img class="img" src="/about_me.jpg" alt="" />
      </div>
      <div class="about-info">
        <p>你好这里是Baka</p>
        <p>{{ age }}岁,喜欢Java ,go,js,和各种前沿技术</p>
        <p>除此之外还喜欢动漫,电影,资深二次元</p>
        <p>这里是从hero next 主题博客搬家过来的新博客网站</p>
        <p>博客采用2021年接触到的vite构建工具而来</p>
        <br />
        <p>采用vitepress 原因很简单,有vue3+vite 支持,可以使用自定义组件</p>
        <p>本项目采用使用GitHub page 服务部署,GitHub Action 自动化部署</p>
        <p>如果你想和我交朋友,企鹅号: <span class="qq">2936408477</span></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import solarLunar from "solarlunar-es";
import { onMounted, ref } from "vue";
const age = ref(0);
interface Solar2lunar {
  lYear: number;
  lMonth: number;
  lDay: number;
  animal: string;
  monthCn: string;
  dayCn: string;
  cYear: number;
  cMonth: number;
  cDay: number;
  gzYear: string;
  gzMonth: string;
  gzDay: string;
  isToday: boolean;
  isLeap: boolean;
  nWeek: number;
  ncWeek: string;
  isTerm: boolean;
  term: string;
  lunarFestival: string;
  festival: string;
}
onMounted(() => {
  const pList: any = document.querySelectorAll(".about-info p");
  let time = 1;
  const today = new Date();
  const birthDate = solarLunar.lunar2solar(2000, 4, 16, false) as Solar2lunar;
  const solar2lunarData = solarLunar.lunar2solar(
    today.getFullYear(),
    4,
    16,
    false
  ) as Solar2lunar;
  //根据当前日期 计算年龄
  // birthDate 出生的阳历日期  solar2lunarData 当年生日的阳历日期, today 当前日期
  const diffYear = solar2lunarData.cYear - birthDate.cYear;
  if (solar2lunarData.cMonth < birthDate.cMonth) {
    age.value = diffYear - 1;
  } else if (solar2lunarData.cMonth === birthDate.cMonth) {
    if (solar2lunarData.cDay < birthDate.cDay) {
      age.value = diffYear - 1;
    } else {
      age.value = diffYear;
    }
  } else {
    age.value = diffYear;
  }

  pList.forEach((item: any) => {
    item.style.animationDelay = `${time}s`;
    time += 1.5;
  });
});
</script>

<style lang="less" scoped>
.box {
  width: 100%;
}
.main {
  display: flex;
  justify-content: center;
  width: 80%;
  font-size: 1.1rem;
}
.about-img {
  width: 30%;
}
.about-info {
  margin-left: 20px;
  max-width: 400px;
}
// forwards 保留最后一帧动画状态
.about-info p {
  animation: fadeIn 2s forwards;
  opacity: 0;
}
.qq {
  opacity: 0;
  transition: all 400ms;
  display: inline-block;
}
.qq:hover {
  opacity: 1;
}
@keyframes fadeIn {
  0% {
    -webkit-transform: translateY(130px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0px);
    opacity: 1;
  }
}

@media all and (max-width: 580px) {
  .main {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .about-info {
    margin: 0 30px;
  }
}
</style>
