import { motion } from 'framer-motion'

const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Selected']

// zigzag layout, kept well inside the viewBox bounds so labels never clip
const NODES = [
  { x: 140, y: 40 },
  { x: 140, y: 170 },
  { x: 340, y: 170 },
  { x: 340, y: 300 },
]

const LABEL_OFFSETS = [
  { dx: 22, dy: 4, anchor: 'start' },
  { dx: -22, dy: 4, anchor: 'end' },
  { dx: 0, dy: -22, anchor: 'middle' },
  { dx: 22, dy: 4, anchor: 'start' },
]

const PATH_D = NODES.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ')
const NODE_OPACITY = [0.5, 0.7, 0.9, 1]

export default function PipelineVisual({ accentColor = '#4E65FF' }) {
  return (
    <div className="w-full max-w-lg ml-auto py-6">
      <svg viewBox="0 0 460 340" className="w-full h-auto" fill="none">
        <motion.path
          d={PATH_D}
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        <circle r="4" fill={accentColor}>
          <animateMotion path={PATH_D} dur="3.5s" begin="1.6s" repeatCount="indefinite" calcMode="linear" />
        </circle>

        {NODES.map((n, i) => {
          const isFinal = i === STAGES.length - 1
          const fill = isFinal ? '#EEE0B7' : accentColor
          const label = LABEL_OFFSETS[i]

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.3, duration: 0.4, ease: 'backOut' }}
            >
              {isFinal && (
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={10}
                  fill={fill}
                  opacity={0.3}
                  animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
              )}
              <circle cx={n.x} cy={n.y} r={isFinal ? 9 : 7} fill={fill} fillOpacity={isFinal ? 1 : NODE_OPACITY[i]} />
              <text
                x={n.x + label.dx}
                y={n.y + label.dy}
                textAnchor={label.anchor}
                dominantBaseline="middle"
                className="font-mono"
                fontSize="13"
                fill="var(--color-slate)"
              >
                {STAGES[i]}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}