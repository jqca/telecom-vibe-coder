import React, { useState, useCallback, useEffect } from 'react';
import type { UseCase } from '../data/useCases';
import { Truck, TrendingUp, TrendingDown, Zap, ShieldCheck, Target, Play, RotateCcw } from 'lucide-react';
import VizCanvas, { getVizType } from './VizCanvas';

const parseToSeconds = (timeStr: string): number | null => {
  if (!timeStr) return null;
  if (/即時|リアルタイム/.test(timeStr)) return 0.05;
  if (/日次|翌朝/.test(timeStr)) return 86400;
  const weekMatch = timeStr.match(/([\d.]+)\s*週間/);
  if (weekMatch) return parseFloat(weekMatch[1]) * 7 * 86400;
  const monthMatch = timeStr.match(/([\d.]+)\s*[ヶヵ]月/);
  if (monthMatch) return parseFloat(monthMatch[1]) * 30 * 86400;
  const numMatch = timeStr.match(/([\d.]+)/);
  if (!numMatch) return null;
  const num = parseFloat(numMatch[1]);
  if (timeStr.includes('ms')) return num / 1000;
  if (timeStr.includes('秒')) return num;
  if (timeStr.includes('分')) return num * 60;
  if (timeStr.includes('時間')) return num * 3600;
  if (timeStr.includes('日')) return num * 86400;
  return num;
};

const fmtTime = (sec: number): string => {
  if (sec < 0.001) return `${(sec * 1_000_000).toFixed(0)}us`;
  if (sec < 1)     return `${(sec * 1000).toFixed(0)}ms`;
  if (sec < 60)    return `${sec < 10 ? sec.toFixed(2) : sec.toFixed(1)}秒`;
  if (sec < 3600)  return `${(sec / 60).toFixed(1)}分`;
  if (sec < 86400) return `${(sec / 3600).toFixed(1)}時間`;
  if (sec < 86400 * 30) return `${(sec / 86400).toFixed(1)}日`;
  return `${(sec / (86400 * 30)).toFixed(1)}ヶ月`;
};

interface Props {
  activeUseCase: UseCase;
}

const LivePreview: React.FC<Props> = ({ activeUseCase }) => {
  const [optimizationLevel, setOptimizationLevel] = useState(50);
  const [dataSize, setDataSize] = useState(5000);
  const [isRunning, setIsRunning] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [useQuantum, setUseQuantum] = useState(true);
  const [progress, setProgress] = useState(0);

  const isActionMode = activeUseCase.id.includes('fault') || activeUseCase.id.includes('security') || activeUseCase.id.includes('qkd') || activeUseCase.id.includes('satellite');

  useEffect(() => {
    setIsOptimized(false);
    setIsRunning(false);
    setSelectedNode(null);
    setProgress(0);
    setOptimizationLevel(50);
    setDataSize(5000);
  }, [activeUseCase.id]);

  const statusClass = isActionMode || isOptimized ? 'action-mode' : '';

  const getTrendIcon = (trend: string, active: boolean) => {
    const color = active ? "#eab308" : "#2dd4bf";
    if (trend === 'up') return <TrendingUp size={20} color={color} />;
    if (trend === 'down') return <TrendingDown size={20} color={color} />;
    return <Truck size={20} color={color} />;
  };

  const handleRunSimulation = useCallback(() => {
    setIsRunning(true);
    setIsOptimized(false);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setIsOptimized(true);
          setProgress(0);
        }, 300);
      }
      setProgress(Math.min(p, 100));
    }, 120);
  }, []);

  const handleReset = useCallback(() => {
    setIsOptimized(false);
    setIsRunning(false);
    setProgress(0);
    setOptimizationLevel(50);
    setDataSize(5000);
    setSelectedNode(null);
    setUseQuantum(true);
  }, []);

  const getAdjustedValue = (value: string, trend: 'up' | 'down' | 'neutral') => {
    if (!isOptimized) return value;
    const match = value.match(/([\d.]+)/);
    if (!match) return value;
    const num = parseFloat(match[1]);
    const qBoost = useQuantum ? 1.15 : 1.0;
    const factor = (optimizationLevel / 100) * qBoost;
    const adjusted = trend === 'down'
      ? num * (1 - factor * 0.25)
      : num * (1 + factor * 0.3);
    const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    return value.replace(match[1], adjusted.toFixed(decimals));
  };

  const vizLabels: Record<string, { idle: string; running: string; done: string }> = {
    basestation:  { idle: '基地局データ待機',             running: '配置最適化実行中',           done: '基地局配置完了' },
    frequency:    { idle: '周波数データ待機',             running: '周波数割当最適化中',         done: '周波数割当完了' },
    slicing:      { idle: 'スライス設計待機',             running: 'スライシング最適化中',       done: 'スライス設計完了' },
    propagation:  { idle: '電波モデル待機',               running: '伝搬シミュレーション中',     done: '伝搬解析完了' },
    fault:        { idle: '障害監視待機',                 running: '障害予測AI実行中',           done: '障害予測完了' },
    loadbalance:  { idle: 'トラフィック待機',             running: '負荷分散最適化中',           done: '負荷分散完了' },
    qos:          { idle: 'QoSデータ待機',               running: 'QoS最適化実行中',            done: 'QoS最適化完了' },
    satellite:    { idle: '軌道データ待機',               running: '衛星ルーティング最適化中',   done: 'ルーティング完了' },
    fiber:        { idle: '光ファイバー待機',             running: '経路最適化実行中',           done: '敷設計画完了' },
    pricing:      { idle: '料金データ待機',               running: '料金プラン最適化中',         done: '料金最適化完了' },
    spectrum:     { idle: 'スペクトラム待機',             running: '効率最適化実行中',           done: 'スペクトラム最適化完了' },
    mec:          { idle: 'MECデータ待機',               running: 'MEC配置最適化中',            done: 'MEC配置完了' },
    iot:          { idle: 'IoTデバイス待機',             running: 'デバイス管理最適化中',       done: 'IoT最適化完了' },
    security:     { idle: 'セキュリティ待機',             running: '脅威検知AI実行中',           done: 'セキュリティ完了' },
    sla:          { idle: 'SLAデータ待機',               running: 'SLA最適化実行中',            done: 'SLA最適化完了' },
    nfv:          { idle: 'NFVチェーン待機',             running: 'VNF最適配置中',              done: 'NFV最適化完了' },
    crm:          { idle: 'CRMデータ待機',               running: 'CRM分析実行中',              done: 'CRM分析完了' },
    capacity:     { idle: '容量データ待機',               running: '容量予測AI実行中',           done: '容量予測完了' },
    edge:         { idle: 'エッジノード待機',             running: 'エッジ最適化実行中',         done: 'エッジ最適化完了' },
    submarine:    { idle: '海底ケーブル待機',             running: 'ケーブル最適化中',           done: 'ケーブル設計完了' },
    qkd:          { idle: 'QKDチャネル待機',             running: '量子鍵配送最適化中',         done: 'QKD最適化完了' },
  };

  const getVizLabel = () => {
    const type = getVizType(activeUseCase.id);
    const labels = vizLabels[type] || vizLabels.basestation;
    if (isRunning) return `${labels.running} ${Math.round(progress)}%`;
    if (isOptimized) return `${labels.done} (${useQuantum ? '量子' : '古典'})`;
    return labels.idle;
  };

  return (
    <div className="preview-container">
      <div className={`visualization-box ${statusClass} ${isRunning ? 'viz-running' : ''}`}>
        <VizCanvas
          vizType={getVizType(activeUseCase.id)}
          running={isRunning}
          optimized={isOptimized}
          progress={progress}
          optLevel={optimizationLevel}
          selectedNode={selectedNode}
          onNodeClick={(id) => setSelectedNode(selectedNode === id ? null : id)}
        />

        {isRunning && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className={`viz-overlay ${statusClass}`}>{getVizLabel()}</div>
      </div>

      <div className="control-panel">
        <div className="control-sliders">
          <div className="control-group">
            <label className="control-label">
              最適化レベル
              <span className="control-value">{optimizationLevel}%</span>
            </label>
            <input
              type="range" min="10" max="100" value={optimizationLevel}
              onChange={(e) => { setOptimizationLevel(Number(e.target.value)); setIsOptimized(false); }}
              className="control-slider"
              disabled={isRunning}
            />
          </div>
          <div className="control-group">
            <label className="control-label">
              データ件数
              <span className="control-value">{dataSize.toLocaleString()}件</span>
            </label>
            <input
              type="range" min="1000" max="10000" step="500" value={dataSize}
              onChange={(e) => { setDataSize(Number(e.target.value)); setIsOptimized(false); }}
              className="control-slider"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="control-actions">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${useQuantum ? 'active' : ''}`}
              onClick={() => { setUseQuantum(true); setIsOptimized(false); }}
              disabled={isRunning}
            >
              量子
            </button>
            <button
              className={`toggle-btn ${!useQuantum ? 'active' : ''}`}
              onClick={() => { setUseQuantum(false); setIsOptimized(false); }}
              disabled={isRunning}
            >
              古典
            </button>
          </div>

          <button
            className={`run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRunSimulation}
            disabled={isRunning}
          >
            <Play size={13} />
            {isRunning ? '実行中...' : 'シミュレーション実行'}
          </button>

          <button className="reset-btn" onClick={handleReset} disabled={isRunning}>
            <RotateCcw size={13} />
            リセット
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {activeUseCase.metrics.map((m, idx) => (
          <div key={idx} className={`metric-card ${statusClass} ${isOptimized ? 'metric-optimized' : ''}`}>
            <div>
              <div className="metric-label">{m.label}</div>
              <div className={`metric-value ${isOptimized ? 'metric-value-updated' : ''}`}>
                {getAdjustedValue(m.value, m.trend)}
              </div>
              {isOptimized && <div className="metric-badge">最適化済</div>}
            </div>
            <div>{getTrendIcon(m.trend, !!(isActionMode || isOptimized))}</div>
          </div>
        ))}
      </div>

      <div className="insights-panel">
        <div className={`insight-card impact-card ${statusClass}`}>
          <div className="card-header">
            <Target size={16} className="insight-icon" />
            <span>経営インパクト (Business Impact)</span>
          </div>
          <div className="card-body impact-text">{activeUseCase.businessImpact}</div>
        </div>

        <div className={`insight-card qvc-card ${statusClass}`}>
          <div className="card-header">
            <Zap size={16} className="insight-icon" />
            <span>量子 vs 古典 - 規模別比較</span>
          </div>
          <div className="card-body">
            {(() => {
              const cSec = parseToSeconds(activeUseCase.quantumVsClassical.classicalTime);
              const qSec = parseToSeconds(activeUseCase.quantumVsClassical.quantumTime);
              const scales = [
                {
                  label: '小規模',
                  sublabel: '~1,000件',
                  cMult: 0.04,
                  qMult: 0.18,
                  classicalComment: '古典計算でも許容範囲内',
                  quantumComment: '量子優位性は限定的・コスト対効果を要検討',
                  verdict: '古典で対応可能',
                  verdictClass: 'verdict-neutral',
                },
                {
                  label: '中規模',
                  sublabel: '1,000~10,000件',
                  cMult: 1.0,
                  qMult: 1.0,
                  classicalComment: '処理時間が長くなり業務効率への影響が顕在化',
                  quantumComment: '量子優位性が明確に現れ始める規模',
                  verdict: '量子優位性が顕在化',
                  verdictClass: 'verdict-quantum',
                },
                {
                  label: '大規模',
                  sublabel: '10,000件超',
                  cMult: 16.0,
                  qMult: 3.5,
                  classicalComment: '実用的な時間内での処理はほぼ不可能',
                  quantumComment: '量子処理が事実上の必須要件',
                  verdict: '量子処理が必須',
                  verdictClass: 'verdict-critical',
                },
              ];
              return (
                <div className="qvc-scales">
                  {scales.map((s) => {
                    const cTime = cSec != null ? fmtTime(cSec * s.cMult) : activeUseCase.quantumVsClassical.classicalTime;
                    const qTime = qSec != null ? fmtTime(qSec * s.qMult) : activeUseCase.quantumVsClassical.quantumTime;
                    const ratio = (cSec != null && qSec != null && qSec * s.qMult > 0)
                      ? Math.round((cSec * s.cMult) / (qSec * s.qMult))
                      : null;
                    return (
                      <div key={s.label} className="qvc-scale-block">
                        <div className="qvc-scale-header">
                          <span className="qvc-scale-label">{s.label}</span>
                          <span className="qvc-scale-sublabel">{s.sublabel}</span>
                          <span className={`qvc-verdict ${s.verdictClass}`}>{s.verdict}</span>
                        </div>
                        <div className="qvc-scale-rows">
                          <div className="qvc-scale-row">
                            <span className="qvc-scale-type classical-type">古典</span>
                            <span className="qvc-time classical-time">{cTime}</span>
                            <span className="qvc-scale-comment">{s.classicalComment}</span>
                          </div>
                          <div className="qvc-scale-row">
                            <span className="qvc-scale-type quantum-type">量子</span>
                            <span className="qvc-time quantum-time">{qTime}</span>
                            <span className="qvc-scale-comment">{s.quantumComment}</span>
                          </div>
                          {ratio != null && ratio > 1 && (
                            <div className="qvc-speedup">
                              量子が <strong>{ratio.toLocaleString()}倍</strong> 高速
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="advantage-text" style={{ marginTop: '8px' }}>
                    {activeUseCase.quantumVsClassical.advantage}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className={`insight-card verify-card ${statusClass}`}>
          <div className="card-header">
            <ShieldCheck size={16} className="insight-icon" />
            <span>検証・信頼性サマリー (Safety & Compliance)</span>
          </div>
          <div className="card-body verify-text">{activeUseCase.verificationSummary}</div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
