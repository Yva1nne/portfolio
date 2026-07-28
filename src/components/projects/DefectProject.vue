<template>
  <div class="defect-project">
    <header class="project-lead">
      <p>{{ project.kicker }}</p>
      <h3>{{ project.title }}</h3>
      <span>{{ project.summary }}</span>
    </header>

    <div class="defect-demo">
      <div class="video-column">
        <video
          ref="videoRef"
          :src="project.videoSrc"
          controls
          playsinline
          preload="metadata"
          aria-label="智能缺陷分析系统一分钟演示视频"
        >
          当前浏览器不支持视频播放。下方文字仍可完整了解系统。
        </video>

        <section class="output-map" aria-label="并行调用的四模型能力矩阵">
          <header>
            <p>PARALLEL CAPABILITY MAP</p>
            <span>同一次分析，并行产出四类辅助信息</span>
          </header>
          <div>
            <article v-for="(stage, index) in stages" :key="stage.label">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <strong>{{ stage.label }}</strong>
              <small>{{ stage.caption }}</small>
            </article>
          </div>
        </section>
      </div>

      <aside class="result-note">
        <p>ENGINEER-IN-THE-LOOP</p>
        <h4>四个模型，并行产出辅助证据。</h4>
        <span>{{ project.boundary }}</span>
        <dl>
          <div>
            <dt>我的职责</dt>
            <dd>{{ project.responsibilities.join(' ') }}</dd>
          </div>
          <div>
            <dt>验证证据</dt>
            <dd>{{ project.evidence.join(' ') }}</dd>
          </div>
        </dl>
      </aside>
    </div>

    <figure class="award-certificate">
      <img
        src="/project/%E8%8E%B7%E5%A5%96%E8%AF%81%E4%B9%A6.png"
        alt="华为杯第七届中国研究生人工智能创新大赛一等奖获奖证书"
        loading="lazy"
      >
      <figcaption>
        <p>AWARD / 2025</p>
        <h4>“华为杯”中国研究生人工智能创新大赛全国一等奖</h4>
        <span>作品：晶圆制造端到端智能缺陷分析与根本原因追踪系统。</span>
      </figcaption>
    </figure>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { projects } from '../../data/portfolio.js'

const project = projects.defect
const videoRef = ref(null)

const stages = [
  { label: '分类', caption: '识别缺陷类别' },
  { label: '分割', caption: '定位缺陷区域' },
  { label: '语义', caption: '组织形貌描述' },
  { label: '检索', caption: '返回历史相似案例' },
]

onBeforeUnmount(() => {
  const video = videoRef.value
  if (!video) return

  video.pause()
  video.removeAttribute('src')
  video.load()
})
</script>

<style scoped>
.defect-project {
  display: grid;
  gap: clamp(1rem, 1.8vw, 1.6rem);
  padding: clamp(1.25rem, 3vw, 2.75rem);
  color: #252927;
}

.project-lead {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 0.55rem clamp(1.25rem, 3vw, 2.8rem);
  align-items: end;
  max-width: none;
}

.project-lead p,
.result-note > p,
.award-certificate p {
  margin: 0;
  color: #687d74;
  font: 700 0.7rem/1.2 var(--font-sans, sans-serif);
  letter-spacing: 0.14em;
}

.project-lead > p {
  grid-column: 1 / -1;
}

.project-lead h3,
.result-note h4,
.award-certificate h4 {
  margin: 0;
  font-family: var(--font-serif, serif);
  font-weight: 500;
}

.project-lead h3 {
  max-width: 18ch;
  font-size: clamp(1.4rem, 2.25vw, 2.15rem);
  line-height: 1.08;
}

.project-lead > span {
  color: #626864;
  font-size: clamp(0.82rem, 1vw, 0.94rem);
  line-height: 1.6;
}

.defect-demo {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
}

.video-column {
  min-width: 0;
}

video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.7rem;
  background: #111513;
  box-shadow: 0 1.2rem 2.5rem rgba(37, 41, 39, 0.16);
}

.output-map {
  display: grid;
  gap: 0.7rem;
  margin-top: 1rem;
}

.output-map > header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.output-map > header p {
  margin: 0;
  color: #687d74;
  font: 800 0.62rem/1.2 var(--font-sans, sans-serif);
  letter-spacing: 0.13em;
}

.output-map > header span {
  color: #68716d;
  font-size: 0.72rem;
}

.output-map > div {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.output-map article {
  display: grid;
  min-width: 0;
  gap: 0.24rem;
  min-height: 5.6rem;
  align-content: end;
  padding: 0.8rem;
  border-top: 3px solid #687d74;
  background: rgba(104, 125, 116, 0.08);
  color: #5d6560;
  text-align: left;
}

.output-map article > span {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
}

.output-map strong {
  color: #30463d;
  font-size: 0.82rem;
}

.output-map small {
  font-size: 0.64rem;
  line-height: 1.35;
}

.result-note {
  display: grid;
  grid-template-columns: minmax(10rem, 0.68fr) minmax(0, 1.32fr);
  gap: 0.45rem clamp(1.2rem, 3vw, 3rem);
  align-items: start;
  padding-top: 0.9rem;
  border-top: 2px solid #687d74;
}

.result-note > p { grid-column: 1 / -1; }

.result-note h4 {
  max-width: 16ch;
  font-size: clamp(1.25rem, 2.1vw, 1.8rem);
  line-height: 1.15;
}

.result-note > span,
.result-note dd {
  color: #59605c;
  font-size: 0.9375rem;
  line-height: 1.7;
}

.award-certificate {
  display: grid;
  grid-template-columns: minmax(150px, 0.34fr) minmax(0, 1fr);
  gap: clamp(1.2rem, 3vw, 2.6rem);
  align-items: center;
  margin: 0;
  border-top: 1px solid rgba(37, 41, 39, 0.2);
  padding: clamp(1.4rem, 3vw, 2.6rem) 0 0;
}

.award-certificate img {
  display: block;
  width: 100%;
  max-width: 230px;
  border: 1px solid rgba(56, 66, 61, 0.14);
  box-shadow: 0 0.9rem 2rem rgba(37, 41, 39, 0.12);
}

.award-certificate figcaption {
  display: grid;
  gap: 0.65rem;
}

.award-certificate h4 {
  max-width: 18ch;
  font-size: clamp(1.25rem, 2.2vw, 2rem);
  line-height: 1.14;
}

.award-certificate figcaption > span {
  color: #59605c;
  font-size: 0.9375rem;
  line-height: 1.65;
}

.result-note dl {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0.25rem 0 0;
}

.result-note dl > div {
  display: grid;
  gap: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(37, 41, 39, 0.17);
}

.result-note dt {
  color: #2f3934;
  font-size: 0.7rem;
  font-weight: 700;
}

.result-note dd {
  margin: 0;
}

@media (max-width: 760px) {
  .defect-project {
    padding: 1rem;
  }

  .project-lead {
    grid-template-columns: 1fr;
  }

  .project-lead > p {
    grid-column: auto;
  }

  .defect-demo {
    grid-template-columns: 1fr;
  }

  .result-note,
  .result-note dl {
    grid-template-columns: 1fr;
  }

  .result-note > p,
  .result-note dl {
    grid-column: auto;
  }

  .output-map > div {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .output-map strong {
    font-size: 0.9375rem;
  }

  .output-map small {
    font-size: 0.8125rem;
  }

  .result-note h4 {
    max-width: none;
  }

  .award-certificate {
    grid-template-columns: 1fr;
  }

  .project-lead > span,
  .result-note > span,
  .result-note dd {
    font-size: 0.9375rem;
  }
}

</style>
