import React from 'react';

export type VizType =
  | 'basestation' | 'frequency' | 'slicing' | 'propagation' | 'fault'
  | 'loadbalance' | 'qos' | 'satellite' | 'fiber' | 'pricing'
  | 'spectrum' | 'mec' | 'iot' | 'security' | 'sla'
  | 'nfv' | 'crm' | 'capacity' | 'edge' | 'submarine' | 'qkd';

const VIZ_MAP: Record<string, VizType> = {
  'base-station': 'basestation',
  'basestation': 'basestation',
  'frequency': 'frequency',
  'slicing': 'slicing',
  'propagation': 'propagation',
  'radio': 'propagation',
  'fault': 'fault',
  'load-balancing': 'loadbalance',
  'loadbalance': 'loadbalance',
  'traffic-load': 'loadbalance',
  'qos': 'qos',
  'satellite': 'satellite',
  'fiber': 'fiber',
  'pricing': 'pricing',
  'spectrum': 'spectrum',
  'mec': 'mec',
  'iot': 'iot',
  'security': 'security',
  'sla': 'sla',
  'nfv': 'nfv',
  'crm': 'crm',
  'capacity': 'capacity',
  'edge': 'edge',
  'submarine': 'submarine',
  'quantum-key': 'qkd',
  'qkd': 'qkd',
};

export function getVizType(id: string): VizType {
  for (const key of Object.keys(VIZ_MAP)) {
    if (id.includes(key)) return VIZ_MAP[key];
  }
  return 'basestation';
}

type VizProps = {
  running: boolean;
  optimized: boolean;
  progress: number;
  optLevel: number;
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
};

const C1 = '#0891B2';
const C2 = '#67E8F9';
const BG = '#0a1628';
const TX = '#f8f9fa';
const MU = '#8e9aaf';

/* ---- basestation: cell tower placement on map ---- */
const BasestationViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const towers = [[80, 70], [180, 55], [300, 80], [120, 150], [250, 140], [340, 160]];
  const coverages = [45, 40, 50, 35, 45, 38];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">5G基地局配置最適化</text>
      {towers.map(([x, y], i) => {
        const col = selectedNode === String(i) ? '#eab308' : (optimized ? '#2dd4bf' : MU);
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={coverages[i]} fill={col} opacity={optimized ? 0.12 : 0.05} stroke={col} strokeWidth="0.5">
              {running && <animate attributeName="r" values={`${coverages[i]-5};${coverages[i]+5};${coverages[i]-5}`} dur={`${2+i*0.3}s`} repeatCount="indefinite" />}
            </circle>
            <line x1={x} y1={y} x2={x} y2={y-18} stroke={col} strokeWidth="2" opacity="0.8" />
            <circle cx={x} cy={y-20} r="3" fill={col} opacity="0.9" />
            <line x1={x-6} y1={y-18} x2={x+6} y2={y-18} stroke={col} strokeWidth="1.5" />
          </g>
        );
      })}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'カバレッジ 98.5% / 干渉 -42%' : '基地局配置待機'}</text>
    </g>
  );
};

/* ---- frequency: spectrum allocation grid ---- */
const FrequencyViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const bands = ['700MHz', '1.7GHz', '2.1GHz', '3.5GHz', '4.5GHz', '28GHz'];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">周波数割当最適化</text>
      {bands.map((b, i) => {
        const y = 35 + i * 28;
        const w = optimized ? 50 + (5-i)*25 + Math.random()*20 : 200;
        const col = optimized ? (i < 3 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <text x="55" y={y+14} fill={MU} fontSize="7" textAnchor="end">{b}</text>
            <rect x="60" y={y} width={w} height="20" rx="3" fill={col} opacity={optimized ? 0.5 : 0.2}>
              {running && <animate attributeName="width" values={`${w*0.6};${w};${w*0.6}`} dur={`${1.5+i*0.2}s`} repeatCount="indefinite" />}
            </rect>
            {optimized && <text x={65+w} y={y+14} fill={col} fontSize="7">{(80+i*3)}%</text>}
          </g>
        );
      })}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'スペクトラム効率 +38%' : '周波数割当待機'}</text>
    </g>
  );
};

/* ---- slicing: network slice layers ---- */
const SlicingViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const slices = [
    { label: 'eMBB', y: 40, col: '#3B82F6' },
    { label: 'URLLC', y: 85, col: '#EF4444' },
    { label: 'mMTC', y: 130, col: '#10B981' },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ネットワークスライシング</text>
      {slices.map((s, i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <rect x="50" y={s.y} width="300" height="35" rx="6" fill={optimized ? s.col : MU} opacity={optimized ? 0.2 : 0.08} stroke={optimized ? s.col : MU} strokeWidth="1">
            {running && <animate attributeName="opacity" values="0.06;0.22;0.06" dur={`${1.5+i*0.4}s`} repeatCount="indefinite" />}
          </rect>
          <text x="65" y={s.y+22} fill={TX} fontSize="9" fontWeight="bold">{s.label}</text>
          {optimized && (
            <>
              <rect x="130" y={s.y+8} width={140*(0.7+i*0.1)} height="6" rx="3" fill={s.col} opacity="0.5" />
              <text x="340" y={s.y+22} fill={s.col} fontSize="7" textAnchor="end">{['4.2Gbps','0.8ms','1M/km²'][i]}</text>
            </>
          )}
        </g>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'SLA遵守率 99.99%' : 'スライス設計待機'}</text>
    </g>
  );
};

/* ---- propagation: radio wave rays ---- */
const PropagationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const rays = [[60,170], [120,120], [200,80], [280,110], [350,160]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">5G電波伝搬シミュレーション</text>
      <circle cx="60" cy="170" r="8" fill={C1} opacity="0.8">
        {running && <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />}
      </circle>
      {rays.slice(1).map(([x,y], i) => (
        <g key={i}>
          <line x1={rays[i][0]} y1={rays[i][1]} x2={x} y2={y} stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.5 : 0.8} opacity={optimized ? 0.6 : 0.3}>
            {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1.5+i*0.3}s`} repeatCount="indefinite" />}
          </line>
          <circle cx={x} cy={y} r={3} fill={optimized ? C2 : MU} opacity="0.6" onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }} />
        </g>
      ))}
      {optimized && <rect x="170" y="50" width="60" height="80" fill="none" stroke={C1} strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />}
      {optimized && <text x="200" y="85" fill={C1} fontSize="6" textAnchor="middle">ビル反射</text>}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'パスロス予測誤差 ±1.2dB' : '電波伝搬待機'}</text>
    </g>
  );
};

/* ---- fault: alarm timeline ---- */
const FaultViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const alarms = [[60,80,'RRU'], [130,120,'BBU'], [200,70,'Core'], [270,140,'MW'], [340,90,'Fiber']];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">通信障害予測AI</text>
      <line x1="40" y1="170" x2="370" y2="170" stroke={MU} strokeWidth="0.5" />
      {alarms.map(([x,y,label], i) => {
        const col = optimized ? (i === 3 ? '#ff4444' : '#2dd4bf') : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <line x1={x as number} y1={y as number} x2={x as number} y2={170} stroke={col} strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            <circle cx={x as number} cy={y as number} r={optimized ? 8 : 5} fill={col} opacity={optimized ? 0.5 : 0.2}>
              {running && <animate attributeName="r" values="4;9;4" dur={`${1.2+i*0.2}s`} repeatCount="indefinite" />}
            </circle>
            <text x={x as number} y={(y as number)-12} fill={MU} fontSize="6" textAnchor="middle">{label}</text>
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '障害予測精度 94.5% / MTTR -62%' : '障害予測待機'}</text>
    </g>
  );
};

/* ---- loadbalance: server load distribution ---- */
const LoadBalanceViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const servers = Array.from({length: 8}, (_, i) => ({
    x: 50 + (i%4)*85,
    y: i < 4 ? 55 : 125,
    load: optimized ? 45 + Math.random()*20 : 20 + Math.random()*70
  }));
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">トラフィック負荷分散</text>
      {servers.map((s, i) => {
        const h = s.load * 0.55;
        const col = optimized ? '#2dd4bf' : (s.load > 70 ? '#ff4444' : MU);
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={s.x} y={s.y+55-h} width="55" height={h} rx="3" fill={col} opacity={optimized ? 0.5 : 0.25}>
              {running && <animate attributeName="height" values={`${h*0.7};${h};${h*0.7}`} dur={`${1.5+i*0.2}s`} repeatCount="indefinite" />}
            </rect>
            <text x={s.x+27} y={s.y+68} fill={MU} fontSize="6" textAnchor="middle">{`N${i+1}`}</text>
          </g>
        );
      })}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '負荷偏差 σ=3.2% / 応答 -45%' : '負荷分散待機'}</text>
    </g>
  );
};

/* ---- qos: quality tiers ---- */
const QosViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const tiers = [
    { label: 'Premium', x: 50, w: 300, col: '#F59E0B' },
    { label: 'Business', x: 50, w: 240, col: C1 },
    { label: 'Standard', x: 50, w: 180, col: '#6B7280' },
    { label: 'Best Effort', x: 50, w: 120, col: '#374151' },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">QoS最適化エンジン</text>
      {tiers.map((t, i) => {
        const y = 40 + i * 40;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <rect x={t.x} y={y} width={optimized ? t.w : t.w*0.7} height="28" rx="4" fill={t.col} opacity={optimized ? 0.4 : 0.15}>
              {running && <animate attributeName="width" values={`${t.w*0.5};${t.w};${t.w*0.5}`} dur="2s" repeatCount="indefinite" />}
            </rect>
            <text x={55} y={y+18} fill={TX} fontSize="8">{t.label}</text>
            {optimized && <text x={t.x+t.w+8} y={y+18} fill={t.col} fontSize="7">{['99.99%','99.9%','99%','95%'][i]}</text>}
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'QoE改善 +28% / パケロス -85%' : 'QoS計測待機'}</text>
    </g>
  );
};

/* ---- satellite: orbital paths ---- */
const SatelliteViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const sats = [[100,60], [200,45], [300,70], [150,130], [260,120]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">衛星通信ルーティング</text>
      <ellipse cx="200" cy="180" rx="170" ry="15" fill="none" stroke={MU} strokeWidth="0.8" opacity="0.3" />
      {sats.map(([x,y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {optimized && i < 4 && <line x1={x} y1={y} x2={sats[i+1][0]} y2={sats[i+1][1]} stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />}
          <circle cx={x} cy={y} r={6} fill={optimized ? C1 : MU} opacity={optimized ? 0.8 : 0.4}>
            {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1+i*0.2}s`} repeatCount="indefinite" />}
          </circle>
          {optimized && <line x1={x} y1={y+6} x2={x+(i-2)*10} y2="175" stroke={C2} strokeWidth="0.8" opacity="0.3" />}
        </g>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'レイテンシ 18ms / 可用性 99.7%' : '軌道計算待機'}</text>
    </g>
  );
};

/* ---- fiber: fiber optic network ---- */
const FiberViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const nodes = [[60,80], [160,60], [280,70], [100,150], [220,140], [340,130]];
  const links: [number,number][] = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">光ファイバー敷設最適化</text>
      {links.map(([a,b], i) => {
        const active = optimized && (i === 0 || i === 2 || i === 4 || i === 5);
        return (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={active ? '#2dd4bf' : MU} strokeWidth={active ? 2.5 : 1} opacity={active ? 0.7 : 0.2}>
            {running && <animate attributeName="opacity" values="0.15;0.6;0.15" dur="2s" repeatCount="indefinite" />}
          </line>
        );
      })}
      {nodes.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={optimized ? C1 : MU} opacity="0.7"
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1+i*0.15}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '敷設コスト -33% / 冗長性 99.99%' : '経路計算待機'}</text>
    </g>
  );
};

/* ---- pricing: plan comparison bars ---- */
const PricingViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const plans = [
    { label: 'ライト', revenue: 40 }, { label: 'スタンダード', revenue: 65 },
    { label: 'プレミアム', revenue: 85 }, { label: '法人', revenue: 95 },
    { label: 'IoT', revenue: 50 },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">通信料金プラン最適化</text>
      {plans.map((p, i) => {
        const y = 40 + i * 32;
        const w = optimized ? p.revenue * 2.5 : p.revenue * 1.8;
        const col = optimized ? '#2dd4bf' : C1;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <text x="48" y={y+14} fill={MU} fontSize="7" textAnchor="end">{p.label}</text>
            <rect x="55" y={y} width={w} height="22" rx="3" fill={col} opacity={optimized ? 0.5 : 0.25}>
              {running && <animate attributeName="width" values={`${w*0.6};${w};${w*0.6}`} dur={`${1.5+i*0.2}s`} repeatCount="indefinite" />}
            </rect>
            {optimized && <text x={60+w} y={y+14} fill="#2dd4bf" fontSize="7">+{12+i*3}%</text>}
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized ? 'ARPU +18% / チャーン -25%' : '料金分析待機'}</text>
    </g>
  );
};

/* ---- spectrum: efficiency heat grid ---- */
const SpectrumViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 6;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">スペクトラム効率最適化</text>
      {Array.from({length: grid}).flatMap((_, r) =>
        Array.from({length: grid}).map((_, c) => {
          const idx = r * grid + c;
          const x = 50 + c * 52;
          const y = 35 + r * 28;
          const eff = optimized ? 0.7 + Math.random()*0.3 : 0.2 + Math.random()*0.6;
          const col = eff > 0.8 ? '#2dd4bf' : (eff > 0.5 ? C1 : '#ff4444');
          return (
            <rect key={idx} x={x} y={y} width="45" height="22" rx="3"
              fill={optimized ? col : MU} opacity={optimized ? 0.4 : 0.1}
              stroke={optimized ? col : 'none'} strokeWidth="0.5"
              onClick={() => onNodeClick(String(idx))} style={{ cursor: 'pointer' }}>
              {running && <animate attributeName="opacity" values="0.08;0.4;0.08" dur={`${1.5+idx*0.03}s`} repeatCount="indefinite" />}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '帯域利用率 92% 達成' : 'スペクトラム計測中'}</text>
    </g>
  );
};

/* ---- mec: edge server placement ---- */
const MecViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const edges = [[80,80], [200,60], [320,90], [140,150], [270,145]];
  const users = [[60,120], [120,100], [180,130], [240,110], [300,140], [350,120]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">MEC配置最適化</text>
      {optimized && edges.map(([x,y], i) => (
        <circle key={`c${i}`} cx={x} cy={y} r="35" fill={C1} opacity="0.06" stroke={C1} strokeWidth="0.5" strokeDasharray="2 2" />
      ))}
      {optimized && users.map(([ux,uy], ui) => {
        const nearest = edges.reduce((best, [ex,ey], ei) => {
          const d = Math.sqrt((ux-ex)**2+(uy-ey)**2);
          return d < best.d ? {d, ei} : best;
        }, {d: Infinity, ei: 0});
        return <line key={`l${ui}`} x1={ux} y1={uy} x2={edges[nearest.ei][0]} y2={edges[nearest.ei][1]} stroke="#2dd4bf" strokeWidth="0.8" opacity="0.3" />;
      })}
      {edges.map(([x,y], i) => (
        <rect key={i} x={x-8} y={y-8} width="16" height="16" rx="3" fill={optimized ? C1 : MU} opacity={optimized ? 0.7 : 0.3}
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1+i*0.2}s`} repeatCount="indefinite" />}
        </rect>
      ))}
      {users.map(([x,y], i) => (
        <circle key={`u${i}`} cx={x} cy={y} r="3" fill={C2} opacity="0.5" />
      ))}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'レイテンシ 2ms / カバー率 98%' : 'MEC配置待機'}</text>
    </g>
  );
};

/* ---- iot: device mesh network ---- */
const IoTViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const devices = [[60,60],[140,50],[220,70],[300,55],[80,130],[180,140],[280,125],[350,140]];
  const mesh: [number,number][] = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">IoTデバイス管理最適化</text>
      {mesh.map(([a,b], i) => (
        <line key={i} x1={devices[a][0]} y1={devices[a][1]} x2={devices[b][0]} y2={devices[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1 : 0.5} opacity={optimized ? 0.35 : 0.15}>
          {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />}
        </line>
      ))}
      {devices.map(([x,y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <rect x={x-5} y={y-5} width="10" height="10" rx="2" fill={optimized ? C1 : MU} opacity={optimized ? 0.7 : 0.3}>
            {running && <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1+i*0.12}s`} repeatCount="indefinite" />}
          </rect>
          {optimized && <text x={x} y={y-8} fill={C1} fontSize="5" textAnchor="middle">{`D${i+1}`}</text>}
        </g>
      ))}
      <text x="200" y="195" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '接続 8/8 正常 / 電力 -35%' : 'デバイス待機'}</text>
    </g>
  );
};

/* ---- security: threat detection radar ---- */
const SecurityViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const threats = [[100,70],[200,90],[300,65],[150,150],[280,140]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ネットワークセキュリティ</text>
      <rect x="40" y="30" width="320" height="150" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.25" />
      {threats.map(([x,y], i) => {
        const safe = optimized ? (i !== 1 && i !== 4) : false;
        const col = safe ? '#2dd4bf' : (optimized ? '#ff4444' : MU);
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={optimized ? 14 : 8} fill={col} opacity={optimized ? 0.2 : 0.08}>
              {running && <animate attributeName="r" values="6;15;6" dur={`${1.5+i*0.2}s`} repeatCount="indefinite" />}
            </circle>
            {optimized && <text x={x} y={y+4} fill={TX} fontSize="8" textAnchor="middle">{safe ? '✓' : '!'}</text>}
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '脅威検知 2件 / ブロック済' : 'セキュリティ監視待機'}</text>
    </g>
  );
};

/* ---- sla: compliance gauges ---- */
const SlaViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const metrics = [
    { label: '可用性', target: 99.99, actual: optimized ? 99.995 : 99.2 },
    { label: 'レイテンシ', target: 10, actual: optimized ? 4.5 : 18 },
    { label: 'スループット', target: 1000, actual: optimized ? 1250 : 850 },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">SLA最適化</text>
      {metrics.map((m, i) => {
        const cx = 80 + i * 120;
        const ratio = m.label === 'レイテンシ' ? m.target / m.actual : m.actual / m.target;
        const col = ratio >= 1 ? '#2dd4bf' : '#ff4444';
        const arcLen = Math.min(ratio, 1.2) * 180;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <path d={`M${cx-35},140 A35,35 0 0,1 ${cx+35},140`} fill="none" stroke={MU} strokeWidth="4" opacity="0.15" />
            <path d={`M${cx-35},140 A35,35 0 0,1 ${cx-35+70*Math.sin(arcLen*Math.PI/360)*2},${140-35*(1-Math.cos(arcLen*Math.PI/180))}`}
              fill="none" stroke={optimized ? col : MU} strokeWidth="4" opacity={optimized ? 0.7 : 0.3}>
              {running && <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />}
            </path>
            <text x={cx} y="120" fill={TX} fontSize="7" textAnchor="middle">{m.label}</text>
            <text x={cx} y="160" fill={optimized ? col : MU} fontSize="9" fontWeight="bold" textAnchor="middle">
              {m.label === '可用性' ? `${m.actual}%` : m.label === 'レイテンシ' ? `${m.actual}ms` : `${m.actual}Mbps`}
            </text>
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'SLA遵守率 100%' : 'SLA計測待機'}</text>
    </g>
  );
};

/* ---- nfv: virtual function chain ---- */
const NfvViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const vnfs = [
    { x: 50, label: 'vFW' }, { x: 120, label: 'vLB' }, { x: 190, label: 'vRouter' },
    { x: 260, label: 'vIMS' }, { x: 330, label: 'vEPC' },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">仮想化基盤（NFV）最適化</text>
      {vnfs.map((v, i) => {
        const col = optimized ? (i % 2 === 0 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i}>
            {i < vnfs.length - 1 && (
              <line x1={v.x+25} y1="100" x2={vnfs[i+1].x} y2="100" stroke={optimized ? '#2dd4bf' : MU} strokeWidth="1.5" opacity={optimized ? 0.5 : 0.2} strokeDasharray={optimized ? 'none' : '3 2'}>
                {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur="1.5s" repeatCount="indefinite" />}
              </line>
            )}
            <rect x={v.x} y="80" width="25" height="40" rx="4" fill={col} opacity={optimized ? 0.35 : 0.12} stroke={col} strokeWidth="1"
              onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1+i*0.2}s`} repeatCount="indefinite" />}
            </rect>
            <text x={v.x+12} y="105" fill={TX} fontSize="7" textAnchor="middle">{v.label}</text>
          </g>
        );
      })}
      <text x="200" y="160" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'リソース効率 +42% / 遅延 -55%' : 'VNFチェーン待機'}</text>
    </g>
  );
};

/* ---- crm: customer segments ---- */
const CrmViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const segments = [
    { x: 70, y: 70, r: 35, label: 'ヘビー', count: '12K' },
    { x: 190, y: 85, r: 45, label: 'ミドル', count: '85K' },
    { x: 310, y: 75, r: 30, label: 'ライト', count: '210K' },
    { x: 130, y: 145, r: 25, label: '法人', count: '5K' },
    { x: 260, y: 150, r: 28, label: '新規', count: '15K' },
  ];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">テレコムCRM分析</text>
      {segments.map((s, i) => {
        const col = optimized ? (i < 2 ? '#2dd4bf' : C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
            <circle cx={s.x} cy={s.y} r={s.r} fill={col} opacity={optimized ? 0.2 : 0.08} stroke={col} strokeWidth="1">
              {running && <animate attributeName="r" values={`${s.r-3};${s.r+3};${s.r-3}`} dur={`${2+i*0.3}s`} repeatCount="indefinite" />}
            </circle>
            <text x={s.x} y={s.y-4} fill={TX} fontSize="7" textAnchor="middle">{s.label}</text>
            <text x={s.x} y={s.y+9} fill={col} fontSize="8" fontWeight="bold" textAnchor="middle">{s.count}</text>
          </g>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'LTV +22% / チャーン -18%' : 'CRM分析待機'}</text>
    </g>
  );
};

/* ---- capacity: forecast line chart ---- */
const CapacityViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({length: 14}, (_, i) => {
    const x = 40 + i * 24;
    const base = optimized ? 60 + Math.sin(i*0.5)*15 + i*3 : 100 + Math.sin(i*0.3)*20;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">回線容量予測AI</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5" />
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized ? 2 : 1.2} opacity={optimized ? 0.9 : 0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />}
      </polyline>
      {optimized && <polyline points={pts.map((p, i) => { const [x] = p.split(','); return `${x},${70+Math.cos(i*0.4)*10+i*2}`; }).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />}
      <circle cx="40" cy={100} r="3" fill={C1} onClick={() => onNodeClick('0')} style={{ cursor: 'pointer' }} />
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized ? '予測精度 96.2% / 逼迫率 -34%' : '容量予測待機'}</text>
    </g>
  );
};

/* ---- edge: distributed compute nodes ---- */
const EdgeViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const nodes = [[80,60],[200,50],[320,70],[100,140],[220,150],[340,130]];
  const links: [number,number][] = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">エッジコンピューティング</text>
      <rect x="45" y="30" width="315" height="150" rx="5" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2" />
      {links.map(([a,b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 1.2 : 0.5} opacity={optimized ? 0.4 : 0.15}>
          {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />}
        </line>
      ))}
      {nodes.map(([x,y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r={selectedNode === String(i) ? 8 : 5}
            fill={selectedNode === String(i) ? '#eab308' : (optimized ? C1 : C2)} opacity="0.8">
            {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1+i*0.15}s`} repeatCount="indefinite" />}
          </circle>
          {optimized && <text x={x} y={y-10} fill={C1} fontSize="6" textAnchor="middle">{`E${i+1}`}</text>}
        </g>
      ))}
      <text x="200" y="195" fill={MU} fontSize="8" textAnchor="middle">{optimized ? 'エッジ遅延 1.5ms / 稼働 6/6' : 'エッジノード待機'}</text>
    </g>
  );
};

/* ---- submarine: undersea cable map ---- */
const SubmarineViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const landing = [[50,100],[130,60],[220,140],[310,70],[370,120]];
  const cables: [number,number][] = [[0,1],[1,2],[1,3],[2,4],[3,4]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">海底ケーブル最適化</text>
      <rect x="30" y="155" width="345" height="35" fill="#0f172a" opacity="0.5" rx="3" />
      <text x="200" y="175" fill={MU} fontSize="6" textAnchor="middle">海底</text>
      {cables.map(([a,b], i) => {
        const [x1,y1] = landing[a];
        const [x2,y2] = landing[b];
        const my = Math.max(y1,y2) + 30;
        return (
          <path key={i} d={`M${x1},${y1} Q${(x1+x2)/2},${my} ${x2},${y2}`}
            fill="none" stroke={optimized ? '#2dd4bf' : MU} strokeWidth={optimized ? 2 : 1} opacity={optimized ? 0.6 : 0.25}>
            {running && <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${2+i*0.3}s`} repeatCount="indefinite" />}
          </path>
        );
      })}
      {landing.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={optimized ? C1 : MU} opacity="0.7"
          onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          {running && <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1+i*0.2}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '容量 +55% / 敷設コスト -28%' : '海底ケーブル待機'}</text>
    </g>
  );
};

/* ---- qkd: quantum key distribution ---- */
const QkdViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const nodes = [[80,90],[200,60],[320,95],[140,160],[260,155]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">量子暗号通信（QKD）</text>
      {nodes.map(([x,y], i) => {
        if (i < nodes.length - 1) {
          const [nx,ny] = nodes[i+1];
          return (
            <g key={`l${i}`}>
              <line x1={x} y1={y} x2={nx} y2={ny} stroke={optimized ? '#a78bfa' : MU} strokeWidth={optimized ? 2 : 1} opacity={optimized ? 0.5 : 0.2}>
                {running && <animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${1.5+i*0.2}s`} repeatCount="indefinite" />}
              </line>
              {optimized && running && (
                <circle r="3" fill="#a78bfa" opacity="0.8">
                  <animateMotion dur={`${1.5+i*0.3}s`} repeatCount="indefinite" path={`M${x},${y} L${nx},${ny}`} />
                </circle>
              )}
            </g>
          );
        }
        return null;
      })}
      {nodes.map(([x,y], i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r={7} fill={optimized ? '#a78bfa' : MU} opacity={optimized ? 0.6 : 0.3}>
            {running && <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1+i*0.15}s`} repeatCount="indefinite" />}
          </circle>
          {optimized && <text x={x} y={y-12} fill="#a78bfa" fontSize="6" textAnchor="middle">{`Q${i+1}`}</text>}
        </g>
      ))}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized ? '量子鍵配送 128bit/s / 盗聴検知率 100%' : 'QKDチャネル待機'}</text>
    </g>
  );
};

/* ---- registry & main component ---- */

const VIZ_COMPONENTS: Record<VizType, React.FC<VizProps>> = {
  basestation: BasestationViz, frequency: FrequencyViz, slicing: SlicingViz,
  propagation: PropagationViz, fault: FaultViz, loadbalance: LoadBalanceViz,
  qos: QosViz, satellite: SatelliteViz, fiber: FiberViz,
  pricing: PricingViz, spectrum: SpectrumViz, mec: MecViz,
  iot: IoTViz, security: SecurityViz, sla: SlaViz,
  nfv: NfvViz, crm: CrmViz, capacity: CapacityViz,
  edge: EdgeViz, submarine: SubmarineViz, qkd: QkdViz,
};

export default function VizCanvas({
  vizType, running, optimized, progress, optLevel, selectedNode, onNodeClick,
}: VizProps & { vizType: VizType }) {
  const Comp = VIZ_COMPONENTS[vizType];
  return (
    <svg viewBox="0 0 400 220" width="100%" style={{ display: 'block' }}>
      <rect width="400" height="220" fill={BG} rx="8" />
      <Comp running={running} optimized={optimized} progress={progress}
        optLevel={optLevel} selectedNode={selectedNode} onNodeClick={onNodeClick} />
      {running && (
        <g>
          <rect x="10" y="212" width="380" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="10" y="212" width={380 * (progress / 100)} height="4" rx="2" fill={C1} opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
