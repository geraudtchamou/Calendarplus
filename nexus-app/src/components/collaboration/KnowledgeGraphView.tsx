import React, { useState, useEffect } from 'react';

interface KnowledgeGraphProps {
  workspaceId: string;
  onNodeClick?: (nodeId: string) => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  type: string;
  title: string;
  color: string;
  icon: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  strength: number;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphProps> = ({ workspaceId, onNodeClick }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadGraphData();
  }, [workspaceId]);

  const loadGraphData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNodes([
        { id: '1', x: 400, y: 300, type: 'note', title: 'Product Strategy', color: '#6366f1', icon: '📋' },
        { id: '2', x: 200, y: 150, type: 'task', title: 'Launch MVP', color: '#10b981', icon: '✅' },
        { id: '3', x: 600, y: 150, type: 'concept', title: 'User Onboarding', color: '#f59e0b', icon: '💡' },
        { id: '4', x: 200, y: 450, type: 'note', title: 'Competitor Analysis', color: '#ef4444', icon: '📊' },
        { id: '5', x: 600, y: 450, type: 'contact', title: 'Key Stakeholders', color: '#8b5cf6', icon: '👥' },
        { id: '6', x: 400, y: 50, type: 'event', title: 'Q1 Review', color: '#ec4899', icon: '📅' },
      ]);
      setEdges([
        { id: 'e1', source: '1', target: '2', strength: 0.9 },
        { id: 'e2', source: '1', target: '4', strength: 0.7 },
        { id: 'e3', source: '3', target: '2', strength: 0.6 },
        { id: 'e4', source: '1', target: '6', strength: 0.8 },
        { id: 'e5', source: '5', target: '1', strength: 0.5 },
      ]);
      setClusters([
        { id: 'c1', name: 'Strategy', color: '#6366f1' },
        { id: 'c2', name: 'Execution', color: '#10b981' },
      ]);
      setLoading(false);
    }, 800);
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Building knowledge graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-sm font-medium">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={loadGraphData}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold mb-2">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span>Note</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>Task</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Concept</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span>Contact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span>Event</span>
          </div>
        </div>
      </div>

      {/* Graph Canvas */}
      <svg
        className="w-full h-full"
        viewBox={`0 0 800 600`}
        style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
      >
        {/* Edges */}
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={edge.id}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={edge.strength > 0.8 ? '#6366f1' : '#d1d5db'}
              strokeWidth={edge.strength * 3}
              opacity={0.6}
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="28"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
        </defs>

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            className="cursor-pointer transition-transform hover:scale-110"
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {/* Glow effect for selected node */}
            {selectedNode === node.id && (
              <circle
                cx={node.x}
                cy={node.y}
                r={35}
                fill="none"
                stroke={node.color}
                strokeWidth={3}
                className="animate-pulse"
              />
            )}
            
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={28}
              fill={node.color}
              className="shadow-lg"
            />
            
            {/* Icon */}
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fontSize={20}
              fill="white"
            >
              {node.icon}
            </text>

            {/* Label */}
            <text
              x={node.x}
              y={node.y + 45}
              textAnchor="middle"
              fontSize={12}
              fontWeight={500}
              className="fill-gray-700 dark:fill-gray-300"
            >
              {node.title}
            </text>
          </g>
        ))}
      </svg>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 animate-slide-up">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">
              {nodes.find((n) => n.id === selectedNode)?.title}
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Click to view full details and related connections.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors">
              Open
            </button>
            <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Related
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md px-4 py-2 text-sm">
        <span className="font-medium">{nodes.length}</span> nodes ·{' '}
        <span className="font-medium">{edges.length}</span> connections
      </div>
    </div>
  );
};
