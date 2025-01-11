import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

// Nodes for the updated diagram
const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Select Adapter Knowledge Base" },
    position: { x: 0, y: 200 },
  },
  {
    id: "2",
    data: { label: "Define Process" },
    position: { x: 200, y: 200 },
  },
  {
    id: "3",
    data: { label: "Provide Database Connection" },
    position: { x: 400, y: 200 },
  },
  {
    id: "4",
    data: { label: "AI Performs Initial Analysis" },
    position: { x: 600, y: 200 },
  },
  {
    id: "5",
    data: { label: "Human Adjusts Process Model" },
    position: { x: 800, y: 100 },
  },
  {
    id: "6",
    data: { label: "Human Checks and Corrects Model" },
    position: { x: 800, y: 300 },
  },
  {
    id: "7",
    data: { label: "Todo List (Optional)" },
    position: { x: 1000, y: 100 },
  },
  {
    id: "8",
    data: { label: "Theoretical Data Model" },
    position: { x: 1000, y: 300 },
  },
  {
    id: "9",
    data: { label: "Initial Process Context" },
    position: { x: 200, y: 50 },
  },
];

// Edges for the updated flow
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e4-5", source: "4", target: "5" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-7", source: "5", target: "7" },
  { id: "e6-8", source: "6", target: "8" },
  { id: "e1-9", source: "1", target: "9" },
  { id: "e9-4", source: "9", target: "4" },
  { id: "e9-5", source: "9", target: "5" },
  { id: "e9-6", source: "9", target: "6" },
];

const ExampleFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        {/* Fixed Background component */}
      </ReactFlow>
    </div>
  );
};

export default ExampleFlow;
