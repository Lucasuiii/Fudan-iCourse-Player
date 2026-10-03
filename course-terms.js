/* Course context stays in extension-owned scripts, never in the MAIN player world. */
(function(root){
  'use strict';
  const numerical = '数值算法与案例分析：α 阿尔法 alpha，β 贝塔 beta，γ 伽马 gamma，δ 德尔塔 delta，Δ 大写德尔塔，ε 艾普西龙 epsilon（伊普西龙），ζ 泽塔 zeta，η 伊塔 eta，θ 西塔 theta，κ 卡帕 kappa，λ 拉姆达 lambda，μ 缪 mu，ν 纽 nu，ξ 克西 xi，π 派 pi，ρ 柔 rho（罗），σ 西格玛 sigma，Σ 大写西格玛，τ 陶 tau，φ 斐 phi（菲），χ 卡伊 chi，ψ 普赛 psi，ω 欧米伽 omega，Ω 大写欧米伽；机器精度、舍入误差、截断误差、前向误差、后向误差、条件数、病态矩阵、扰动分析、增长因子、范数、谱半径、特征值、奇异值、主元、选主元、高斯消元、LU 分解、QR 分解、Cholesky 分解、Jacobi 迭代、Gauss-Seidel 迭代、收敛阶、牛顿法。';
  function preset(courseId){return String(courseId)==='38146'?numerical:'';}
  function resolve(courseId,prompts={}){
    if(!/^\d{1,10}$/.test(courseId||''))return '';
    const custom=typeof prompts?.[courseId]==='string'?prompts[courseId].trim():'';
    return [custom,preset(courseId)].filter(Boolean).join('；').slice(0,800);
  }
  const api={preset,resolve};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ICourseTerms=api;
})(globalThis);
