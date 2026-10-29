/**
 * ============================================================================
 * AEROGRAPH — FLIGHT ROUTE PLANNER & GRAPH ENGINE
 * Pure Vanilla JavaScript (ES6+) Implementation
 * 
 * Features:
 * 1. Realistic Indian Aviation Dataset (Airports & Direct Corridors)
 * 2. Adjacency List Graph Data Structure
 * 3. Min-Priority Queue
 * 4. Dijkstra's Algorithm (Multi-Metric: Distance, Fare, Duration)
 * 5. Prim's Minimum Spanning Tree (MST / MSF)
 * 6. Yen's K-Shortest Loopless Paths Algorithm (Top 3 Alternatives)
 * 7. Procedural SVG Geodetic Map Renderer (Pan, Zoom, Animations)
 * 8. Step-by-Step Algorithm Execution Tracer & Visualizer
 * ============================================================================
 */

'use strict';

// ============================================================================
// 1. AIRPORT AND FLIGHT DATASET (Indian Airspace)
// ============================================================================
const AIRPORTS_DATA = [
  { id: 'DEL', code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', region: 'North', lat: 28.5562, lng: 77.1000 },
  { id: 'BOM', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', region: 'West', lat: 19.0896, lng: 72.8656 },
  { id: 'BLR', code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', region: 'South', lat: 13.1986, lng: 77.7066 },
  { id: 'MAA', code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', region: 'South', lat: 12.9941, lng: 80.1709 },
  { id: 'HYD', code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', region: 'South', lat: 17.2403, lng: 78.4294 },
  { id: 'CCU', code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', region: 'East', lat: 22.6547, lng: 88.4467 },
  { id: 'PNQ', code: 'PNQ', name: 'Pune Airport', city: 'Pune', region: 'West', lat: 18.5822, lng: 73.9197 },
  { id: 'AMD', code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', region: 'West', lat: 23.0722, lng: 72.6347 },
  { id: 'COK', code: 'COK', name: 'Cochin International Airport', city: 'Kochi', region: 'South', lat: 10.1556, lng: 76.4019 },
  { id: 'JAI', code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', region: 'North', lat: 26.8242, lng: 75.8122 },
  { id: 'LKO', code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', region: 'North', lat: 26.7606, lng: 80.8893 },
  { id: 'IXC', code: 'IXC', name: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh', region: 'North', lat: 30.6735, lng: 76.7885 },
  { id: 'GOI', code: 'GOI', name: 'Dabolim / Goa International Airport', city: 'Goa', region: 'West', lat: 15.3808, lng: 73.8314 },
  { id: 'GAU', code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', region: 'Northeast', lat: 26.1061, lng: 91.5859 }
];

/**
 * Direct commercial air corridors between Indian cities.
 * Realistic distances (km), estimated flight durations (hrs), and simulated fares (INR).
 */
const FLIGHT_CORRIDORS_DATA = [
  // Delhi Hub (DEL)
  { u: 'DEL', v: 'BOM', distance: 1148, duration: 2.15, fare: 4850 },
  { u: 'DEL', v: 'BLR', distance: 1740, duration: 2.75, fare: 6200 },
  { u: 'DEL', v: 'CCU', distance: 1305, duration: 2.20, fare: 5100 },
  { u: 'DEL', v: 'HYD', distance: 1253, duration: 2.10, fare: 4950 },
  { u: 'DEL', v: 'MAA', distance: 1760, duration: 2.80, fare: 6350 },
  { u: 'DEL', v: 'AMD', distance: 775,  duration: 1.50, fare: 3600 },
  { u: 'DEL', v: 'JAI', distance: 240,  duration: 0.85, fare: 2400 },
  { u: 'DEL', v: 'LKO', distance: 420,  duration: 1.10, fare: 2800 },
  { u: 'DEL', v: 'IXC', distance: 235,  duration: 0.80, fare: 2300 },
  { u: 'DEL', v: 'PNQ', distance: 1173, duration: 2.15, fare: 4900 },
  { u: 'DEL', v: 'GAU', distance: 1460, duration: 2.50, fare: 5600 },

  // Mumbai Hub (BOM)
  { u: 'BOM', v: 'BLR', distance: 842,  duration: 1.65, fare: 3950 },
  { u: 'BOM', v: 'HYD', distance: 620,  duration: 1.35, fare: 3400 },
  { u: 'BOM', v: 'MAA', distance: 1030, duration: 1.90, fare: 4600 },
  { u: 'BOM', v: 'CCU', distance: 1660, duration: 2.65, fare: 5900 },
  { u: 'BOM', v: 'AMD', distance: 440,  duration: 1.15, fare: 2900 },
  { u: 'BOM', v: 'GOI', distance: 435,  duration: 1.10, fare: 3100 },
  { u: 'BOM', v: 'COK', distance: 1065, duration: 1.95, fare: 4750 },
  { u: 'BOM', v: 'PNQ', distance: 120,  duration: 0.65, fare: 2100 },
  { u: 'BOM', v: 'JAI', distance: 915,  duration: 1.70, fare: 4200 },

  // Bengaluru Hub (BLR)
  { u: 'BLR', v: 'HYD', distance: 500,  duration: 1.15, fare: 3100 },
  { u: 'BLR', v: 'MAA', distance: 290,  duration: 0.90, fare: 2500 },
  { u: 'BLR', v: 'COK', distance: 365,  duration: 1.05, fare: 2750 },
  { u: 'BLR', v: 'GOI', distance: 480,  duration: 1.20, fare: 3200 },
  { u: 'BLR', v: 'CCU', distance: 1560, duration: 2.50, fare: 5700 },
  { u: 'BLR', v: 'PNQ', distance: 730,  duration: 1.45, fare: 3700 },

  // Hyderabad Hub (HYD)
  { u: 'HYD', v: 'MAA', distance: 510,  duration: 1.15, fare: 3150 },
  { u: 'HYD', v: 'CCU', distance: 1180, duration: 2.05, fare: 4800 },
  { u: 'HYD', v: 'GOI', distance: 540,  duration: 1.25, fare: 3350 },
  { u: 'HYD', v: 'COK', distance: 860,  duration: 1.75, fare: 4300 },

  // Kolkata Hub (CCU)
  { u: 'CCU', v: 'GAU', distance: 510,  duration: 1.15, fare: 3200 },
  { u: 'CCU', v: 'MAA', distance: 1365, duration: 2.25, fare: 5300 },
  { u: 'CCU', v: 'LKO', distance: 885,  duration: 1.65, fare: 4100 },

  // Regional Connections
  { u: 'AMD', v: 'JAI', distance: 535,  duration: 1.20, fare: 3300 },
  { u: 'AMD', v: 'PNQ', distance: 520,  duration: 1.20, fare: 3250 },
  { u: 'IXC', v: 'JAI', distance: 440,  duration: 1.10, fare: 2950 },
  { u: 'LKO', v: 'JAI', distance: 510,  duration: 1.20, fare: 3200 },
  { u: 'MAA', v: 'COK', distance: 560,  duration: 1.25, fare: 3400 }
];

// ============================================================================
// 2. DATA STRUCTURES: PRIORITY QUEUE & GRAPH
// ============================================================================

/**
 * Min-Priority Queue backed by a binary heap for optimal Dijkstra and Prim's operations.
 * Complexity: Insert O(log V), Extract-Min O(log V).
 */
class MinPriorityQueue {
  constructor(comparator = (a, b) => a.priority - b.priority) {
    this.heap = [];
    this.comparator = comparator;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  enqueue(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this._sinkDown(0);
    }
    return min;
  }

  _bubbleUp(index) {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.comparator(node, parent) >= 0) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = node;
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const node = this.heap[index];
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex = null;

      if (leftChildIndex < length) {
        if (this.comparator(this.heap[leftChildIndex], node) < 0) {
          swapIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        const compareTarget = swapIndex === null ? node : this.heap[leftChildIndex];
        if (this.comparator(this.heap[rightChildIndex], compareTarget) < 0) {
          swapIndex = rightChildIndex;
        }
      }

      if (swapIndex === null) break;
      this.heap[index] = this.heap[swapIndex];
      index = swapIndex;
    }
    this.heap[index] = node;
  }
}

/**
 * Graph representation using an Adjacency List.
 * Cleanly separates graph topology and traversal from DOM manipulation.
 */
class Graph {
  constructor() {
    this.vertices = new Map(); // code -> airport object
    this.adjacency = new Map(); // code -> Array of Edge objects
    this.edges = []; // List of all unique undirected edges
  }

  addVertex(airport) {
    if (!this.vertices.has(airport.code)) {
      this.vertices.set(airport.code, { ...airport });
      this.adjacency.set(airport.code, []);
    }
  }

  getVertex(code) {
    return this.vertices.get(code);
  }

  getAllVertices() {
    return Array.from(this.vertices.values());
  }

  addEdge(u, v, distance, duration, fare) {
    if (!this.vertices.has(u) || !this.vertices.has(v)) return;

    const edgeUtoV = { from: u, to: v, distance, duration, fare };
    const edgeVtoU = { from: v, to: u, distance, duration, fare };

    this.adjacency.get(u).push(edgeUtoV);
    this.adjacency.get(v).push(edgeVtoU);

    this.edges.push({ u, v, distance, duration, fare });
  }

  getNeighbors(code) {
    return this.adjacency.get(code) || [];
  }

  getEdge(u, v) {
    const neighbors = this.adjacency.get(u);
    if (!neighbors) return null;
    return neighbors.find(e => e.to === v) || null;
  }

  getAllEdges() {
    return this.edges;
  }

  /**
   * Breadth-First Search to verify connectivity and reachability between two airports.
   */
  isReachable(startCode, endCode) {
    if (startCode === endCode) return true;
    if (!this.vertices.has(startCode) || !this.vertices.has(endCode)) return false;

    const visited = new Set();
    const queue = [startCode];
    visited.add(startCode);

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === endCode) return true;

      for (const edge of this.getNeighbors(current)) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          queue.push(edge.to);
        }
      }
    }
    return false;
  }

  /**
   * Calculates overall dataset metrics.
   */
  getNetworkStatistics() {
    const totalAirports = this.vertices.size;
    const totalEdges = this.edges.length;
    let sumDistance = 0;
    this.edges.forEach(e => sumDistance += e.distance);
    const avgDistance = totalEdges > 0 ? Math.round(sumDistance / totalEdges) : 0;

    return { totalAirports, totalEdges, avgDistance };
  }
}

// ============================================================================
// 3. GRAPH ALGORITHMS (Dijkstra, Prim's MST, Yen's K-Shortest Paths)
// ============================================================================

class GraphAlgorithms {
  /**
   * Dijkstra's Algorithm with execution trace recorder for step-by-step visualizer.
   * Supports optimizing by 'distance', 'fare', or 'duration'.
   */
  static dijkstra(graph, startCode, endCode, metric = 'distance') {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const pq = new MinPriorityQueue();
    const traceSteps = []; // Recorded snapshot steps for visualization

    // Initialization
    for (const v of graph.getAllVertices()) {
      distances[v.code] = Infinity;
      previous[v.code] = null;
    }

    distances[startCode] = 0;
    pq.enqueue(startCode, 0);

    traceSteps.push({
      type: 'INIT',
      current: startCode,
      distances: { ...distances },
      previous: { ...previous },
      visited: Array.from(visited),
      message: `Initialized Dijkstra from ${startCode}. Set distance = 0, all other nodes = \u221E.`
    });

    while (!pq.isEmpty()) {
      const { element: u, priority: distU } = pq.dequeue();

      if (visited.has(u)) continue;
      visited.add(u);

      traceSteps.push({
        type: 'SETTLE',
        current: u,
        distances: { ...distances },
        previous: { ...previous },
        visited: Array.from(visited),
        message: `Settled vertex ${u} with minimum tentative ${metric} = ${Math.round(distU * 100) / 100}.`
      });

      // Target reached
      if (u === endCode) {
        traceSteps.push({
          type: 'TARGET_REACHED',
          current: u,
          distances: { ...distances },
          previous: { ...previous },
          visited: Array.from(visited),
          message: `Reached destination airport ${endCode}. Terminating relaxation.`
        });
        break;
      }

      // Edge Relaxation
      for (const edge of graph.getNeighbors(u)) {
        const v = edge.to;
        if (visited.has(v)) continue;

        const weight = edge[metric];
        const newDist = distU + weight;

        if (newDist < distances[v]) {
          const oldDist = distances[v];
          distances[v] = newDist;
          previous[v] = u;
          pq.enqueue(v, newDist);

          traceSteps.push({
            type: 'RELAX',
            current: u,
            neighbor: v,
            edgeWeight: weight,
            oldDist: oldDist === Infinity ? '\u221E' : Math.round(oldDist),
            newDist: Math.round(newDist),
            distances: { ...distances },
            previous: { ...previous },
            visited: Array.from(visited),
            message: `Relaxed edge (${u} \u2192 ${v}): Updated tentative ${metric} from ${oldDist === Infinity ? '\u221E' : Math.round(oldDist)} to ${Math.round(newDist)}.`
          });
        }
      }
    }

    // Path Reconstruction
    const path = [];
    let curr = endCode;
    if (distances[endCode] !== Infinity) {
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
    }

    // Calculate aggregated metrics along the optimal path
    let totalDistance = 0;
    let totalDuration = 0;
    let totalFare = 0;
    const legs = [];

    if (path.length > 1) {
      for (let i = 0; i < path.length - 1; i++) {
        const edge = graph.getEdge(path[i], path[i + 1]);
        if (edge) {
          totalDistance += edge.distance;
          totalDuration += edge.duration;
          totalFare += edge.fare;
          legs.push({
            from: path[i],
            to: path[i + 1],
            distance: edge.distance,
            duration: edge.duration,
            fare: edge.fare
          });
        }
      }
    }

    return {
      found: path.length > 0 && path[0] === startCode,
      path,
      legs,
      totalDistance,
      totalDuration: Math.round(totalDuration * 10) / 10,
      totalFare,
      stops: Math.max(0, path.length - 2),
      metric,
      distances,
      previous,
      traceSteps
    };
  }

  /**
   * Prim's Minimum Spanning Tree (MST) Algorithm.
   * Finds the minimum weight tree connecting all reachable vertices in the network.
   * Handles disconnected components by computing a Minimum Spanning Forest (MSF).
   */
  static primsMST(graph, metric = 'distance') {
    const vertices = graph.getAllVertices();
    if (vertices.length === 0) return { mstEdges: [], totalWeight: 0, forestCount: 0 };

    const inMST = new Set();
    const mstEdges = [];
    let totalWeight = 0;
    let forestCount = 0;

    // Helper to run Prim's on one connected component starting at startCode
    const runComponent = (startCode) => {
      inMST.add(startCode);
      const pq = new MinPriorityQueue();

      // Enqueue all edges leaving the start vertex
      for (const edge of graph.getNeighbors(startCode)) {
        pq.enqueue({ from: startCode, to: edge.to, ...edge }, edge[metric]);
      }

      while (!pq.isEmpty()) {
        const { element: edge } = pq.dequeue();
        const v = edge.to;

        if (inMST.has(v)) continue;

        inMST.add(v);
        mstEdges.push({
          u: edge.from,
          v: edge.to,
          distance: edge.distance,
          duration: edge.duration,
          fare: edge.fare
        });
        totalWeight += edge[metric];

        // Add all outgoing edges from newly added vertex v to non-MST nodes
        for (const nextEdge of graph.getNeighbors(v)) {
          if (!inMST.has(nextEdge.to)) {
            pq.enqueue({ from: v, to: nextEdge.to, ...nextEdge }, nextEdge[metric]);
          }
        }
      }
    };

    // Iterate through all vertices to handle disconnected sub-graphs (Forest)
    for (const v of vertices) {
      if (!inMST.has(v.code)) {
        forestCount++;
        runComponent(v.code);
      }
    }

    return {
      mstEdges,
      totalWeight: Math.round(totalWeight),
      forestCount,
      metric,
      connectedRatio: Math.round((inMST.size / vertices.length) * 100)
    };
  }

  /**
   * Yen's K-Shortest Loopless Paths Algorithm.
   * Finds top K (e.g. 3) distinct loopless paths between start and end.
   */
  static yensKShortestPaths(graph, startCode, endCode, K = 3, metric = 'distance') {
    // 1. Find the 1st shortest path using Dijkstra
    const firstResult = GraphAlgorithms.dijkstra(graph, startCode, endCode, metric);
    if (!firstResult.found) return [];

    const A = [firstResult.path]; // Array of paths found
    const B = []; // Candidate paths container with weights

    // Helper: compute total path cost
    const getPathCost = (p) => {
      let cost = 0;
      for (let i = 0; i < p.length - 1; i++) {
        const e = graph.getEdge(p[i], p[i + 1]);
        if (e) cost += e[metric];
      }
      return cost;
    };

    // Helper: paths equality
    const pathsEqual = (p1, p2) => {
      if (p1.length !== p2.length) return false;
      return p1.every((node, idx) => node === p2[idx]);
    };

    for (let k = 1; k < K; k++) {
      const prevPath = A[k - 1];

      // The spur node ranges from the first node up to the next to last node in the previous path
      for (let i = 0; i < prevPath.length - 1; i++) {
        const spurNode = prevPath[i];
        const rootPath = prevPath.slice(0, i + 1);

        // Temporarily remove edges that are part of previous paths that share the same root path
        const removedEdges = [];
        for (const p of A) {
          if (p.length > i && pathsEqual(rootPath, p.slice(0, i + 1))) {
            const u = p[i];
            const v = p[i + 1];
            // Remove edge (u, v) from graph
            const adjU = graph.adjacency.get(u);
            const edgeIdx = adjU.findIndex(e => e.to === v);
            if (edgeIdx !== -1) {
              const [removed] = adjU.splice(edgeIdx, 1);
              removedEdges.push({ u, removed });
            }
          }
        }

        // Temporarily remove nodes in rootPath (except spurNode) to ensure loopless path
        const removedVerticesNeighbors = [];
        for (const rootNode of rootPath) {
          if (rootNode !== spurNode) {
            const adj = graph.adjacency.get(rootNode);
            removedVerticesNeighbors.push({ node: rootNode, neighbors: [...adj] });
            graph.adjacency.set(rootNode, []);
          }
        }

        // Calculate spur path from spurNode to endCode
        const spurResult = GraphAlgorithms.dijkstra(graph, spurNode, endCode, metric);

        if (spurResult.found) {
          const totalPath = rootPath.slice(0, -1).concat(spurResult.path);
          const totalCost = getPathCost(totalPath);

          // Check if candidate already in B or A
          const alreadyInA = A.some(p => pathsEqual(p, totalPath));
          const alreadyInB = B.some(entry => pathsEqual(entry.path, totalPath));

          if (!alreadyInA && !alreadyInB) {
            B.push({ path: totalPath, cost: totalCost });
          }
        }

        // Restore removed edges and vertices
        for (const item of removedVerticesNeighbors) {
          graph.adjacency.set(item.node, item.neighbors);
        }
        for (const item of removedEdges) {
          graph.adjacency.get(item.u).push(item.removed);
        }
      }

      if (B.length === 0) break;

      // Sort B by cost ascending and move lowest cost candidate to A
      B.sort((a, b) => a.cost - b.cost);
      A.push(B.shift().path);
    }

    // Convert paths into detailed route objects
    return A.map((p, idx) => {
      let dist = 0;
      let dur = 0;
      let fare = 0;
      const legs = [];

      for (let i = 0; i < p.length - 1; i++) {
        const edge = graph.getEdge(p[i], p[i + 1]);
        if (edge) {
          dist += edge.distance;
          dur += edge.duration;
          fare += edge.fare;
          legs.push(edge);
        }
      }

      return {
        rank: idx + 1,
        path: p,
        legs,
        totalDistance: dist,
        totalDuration: Math.round(dur * 10) / 10,
        totalFare: fare,
        stops: Math.max(0, p.length - 2),
        isOptimal: idx === 0
      };
    });
  }
}

// ============================================================================
// 4. SVG GEODETIC MAP RENDERER
// ============================================================================

class SVGMapRenderer {
  constructor(svgElement, graph) {
    this.svg = svgElement;
    this.graph = graph;

    // ViewBox Coordinate Space (900 x 860)
    this.viewBox = { x: 0, y: 0, w: 900, h: 860 };
    this.initialViewBox = { ...this.viewBox };
    this.isPanning = false;
    this.startPoint = { x: 0, y: 0 };

    // Bounds for Indian Airspace Geodetic Projection
    // India coordinates roughly: Lat 8°N to 35.5°N, Lng 68°E to 94°E
    this.geoBounds = {
      minLat: 7.5,
      maxLat: 35.5,
      minLng: 68.0,
      maxLng: 94.0
    };

    // SVG Groups
    this.indiaMapGroup = document.getElementById('indiaMapGroup');
    this.gridGroup = document.getElementById('gridGroup');
    this.flightEdgesGroup = document.getElementById('flightEdgesGroup');
    this.mstEdgesGroup = document.getElementById('mstEdgesGroup');
    this.activeRouteEdgesGroup = document.getElementById('activeRouteEdgesGroup');
    this.animatedFlightsGroup = document.getElementById('animatedFlightsGroup');
    this.airportNodesGroup = document.getElementById('airportNodesGroup');

    this.activePathNodes = [];
    this.mstEdges = [];
    this.currentViewMode = 'all'; // 'all', 'active', 'mst'

    this.initMapProjection();
    this.attachPanZoomEvents();
  }

  /**
   * Geodetic coordinate projection (Equirectangular / Mercator approximation)
   * Maps WGS84 (Lat, Lng) to SVG (X, Y) canvas.
   */
  project(lat, lng) {
    const padX = 75;
    const padY = 65;
    const mapW = this.viewBox.w - padX * 2;
    const mapH = this.viewBox.h - padY * 2;

    const xRatio = (lng - this.geoBounds.minLng) / (this.geoBounds.maxLng - this.geoBounds.minLng);
    const yRatio = (this.geoBounds.maxLat - lat) / (this.geoBounds.maxLat - this.geoBounds.minLat);

    const x = padX + xRatio * mapW;
    const y = padY + yRatio * mapH;

    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  }

  initMapProjection() {
    this.renderAirspaceGrid();
    this.renderIndiaSchematicBoundary();
    this.renderAllCorridors();
    this.renderAirportNodes();
  }

  /**
   * Render radar sweep circles and latitude/longitude navigational grid
   */
  renderAirspaceGrid() {
    this.gridGroup.innerHTML = '';

    // Radar Concentric Circles centered around central India (Nagpur/Bhopal region ~ Lat 21.5, Lng 78.5)
    const center = this.project(21.5, 78.5);
    [100, 200, 320, 440].forEach(r => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', center.x);
      circle.setAttribute('cy', center.y);
      circle.setAttribute('r', r);
      circle.setAttribute('class', 'radar-sweep-circle');
      this.gridGroup.appendChild(circle);
    });

    // Lat / Long coordinate guide lines
    for (let lng = 70; lng <= 90; lng += 5) {
      const p1 = this.project(8, lng);
      const p2 = this.project(35, lng);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.setAttribute('class', 'svg-grid-line');
      this.gridGroup.appendChild(line);
    }

    for (let lat = 10; lat <= 35; lat += 5) {
      const p1 = this.project(lat, 68);
      const p2 = this.project(lat, 94);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.setAttribute('class', 'svg-grid-line');
      this.gridGroup.appendChild(line);
    }
  }

  /**
   * Render stylized schematic polygon for the subcontinent peninsula
   */
  renderIndiaSchematicBoundary() {
    this.indiaMapGroup.innerHTML = '';

    // Geographic boundary points of India (schematic polygon)
    const boundaryPoints = [
      { lat: 35.5, lng: 74.8 }, // Kashmir North
      { lat: 34.5, lng: 77.5 },
      { lat: 32.5, lng: 78.5 },
      { lat: 30.5, lng: 79.5 },
      { lat: 28.5, lng: 80.8 },
      { lat: 27.5, lng: 84.5 },
      { lat: 27.0, lng: 88.5 }, // Sikkim
      { lat: 27.8, lng: 92.5 }, // Arunachal / Northeast
      { lat: 28.2, lng: 96.0 },
      { lat: 27.0, lng: 96.5 },
      { lat: 24.5, lng: 94.5 }, // Manipur / Nagaland
      { lat: 22.0, lng: 92.5 },
      { lat: 22.2, lng: 89.0 }, // Sunderbans / Bengal
      { lat: 20.0, lng: 86.5 }, // Odisha coast
      { lat: 17.5, lng: 83.5 }, // Vizag coast
      { lat: 13.0, lng: 80.3 }, // Chennai coast
      { lat: 10.0, lng: 79.8 }, // Tamil Nadu coast
      { lat: 8.1,  lng: 77.5 }, // Kanyakumari South Tip
      { lat: 9.8,  lng: 76.2 }, // Kerala / Kochi coast
      { lat: 14.0, lng: 74.5 }, // Karnataka coast
      { lat: 15.5, lng: 73.8 }, // Goa
      { lat: 19.0, lng: 72.8 }, // Mumbai
      { lat: 20.8, lng: 72.8 }, // Surat
      { lat: 22.8, lng: 69.5 }, // Kutch / Gujarat
      { lat: 24.5, lng: 68.8 },
      { lat: 27.0, lng: 70.5 }, // Rajasthan West
      { lat: 29.5, lng: 73.5 }, // Punjab border
      { lat: 32.5, lng: 74.8 }
    ];

    const projectedCoords = boundaryPoints.map(pt => {
      const p = this.project(pt.lat, pt.lng);
      return `${p.x},${p.y}`;
    }).join(' ');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', projectedCoords);
    polygon.setAttribute('class', 'india-boundary');
    this.indiaMapGroup.appendChild(polygon);
  }

  /**
   * Render all flight network corridors as subtle SVG paths
   */
  renderAllCorridors() {
    this.flightEdgesGroup.innerHTML = '';
    const edges = this.graph.getAllEdges();

    edges.forEach(edge => {
      const u = this.graph.getVertex(edge.u);
      const v = this.graph.getVertex(edge.v);
      if (!u || !v) return;

      const p1 = this.project(u.lat, u.lng);
      const p2 = this.project(v.lat, v.lng);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.setAttribute('class', 'edge-line');
      line.setAttribute('data-u', edge.u);
      line.setAttribute('data-v', edge.v);
      line.setAttribute('id', `edge-${edge.u}-${edge.v}`);

      // Subtle edge curve via path or line
      this.flightEdgesGroup.appendChild(line);
    });
  }

  /**
   * Render airport vertices as circular nodes with labels & click handlers
   */
  renderAirportNodes() {
    this.airportNodesGroup.innerHTML = '';
    const vertices = this.graph.getAllVertices();

    vertices.forEach(ap => {
      const pt = this.project(ap.lat, ap.lng);

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'airport-node-group');
      group.setAttribute('id', `node-${ap.code}`);
      group.setAttribute('data-code', ap.code);

      // Pulse ring for visual aesthetics
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('cx', pt.x);
      pulse.setAttribute('cy', pt.y);
      pulse.setAttribute('r', 7);
      pulse.setAttribute('class', 'airport-node-pulse');
      group.appendChild(pulse);

      // Core node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pt.x);
      circle.setAttribute('cy', pt.y);
      circle.setAttribute('r', 6);
      circle.setAttribute('class', 'airport-node-circle');
      group.appendChild(circle);

      // IATA Code Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', pt.x);
      text.setAttribute('y', pt.y - 11);
      text.setAttribute('class', 'airport-label');
      text.textContent = ap.code;
      group.appendChild(text);

      // City Name Sub-label
      const cityText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      cityText.setAttribute('x', pt.x);
      cityText.setAttribute('y', pt.y + 18);
      cityText.setAttribute('class', 'airport-city-label');
      cityText.textContent = ap.city;
      group.appendChild(cityText);

      // Tooltip & click events
      group.addEventListener('mouseenter', (e) => this.showAirportTooltip(e, ap));
      group.addEventListener('mouseleave', () => this.hideAirportTooltip());
      group.addEventListener('click', () => {
        if (window.AeroApp) {
          window.AeroApp.handleAirportNodeClick(ap);
        }
      });

      this.airportNodesGroup.appendChild(group);
    });
  }

  /**
   * Highlight a calculated path on the SVG canvas with animated dashed lines
   * and flying airplane animation.
   */
  highlightRoute(path) {
    this.activePathNodes = path || [];
    this.activeRouteEdgesGroup.innerHTML = '';
    this.animatedFlightsGroup.innerHTML = '';

    // Reset node highlighting
    const allNodeGroups = this.airportNodesGroup.querySelectorAll('.airport-node-group');
    allNodeGroups.forEach(g => {
      g.classList.remove('node-origin', 'node-dest', 'node-transit');
    });

    if (!path || path.length < 2) return;

    // Highlight nodes along path
    const origin = path[0];
    const destination = path[path.length - 1];

    path.forEach((code, index) => {
      const g = document.getElementById(`node-${code}`);
      if (!g) return;

      if (index === 0) {
        g.classList.add('node-origin');
      } else if (index === path.length - 1) {
        g.classList.add('node-dest');
      } else {
        g.classList.add('node-transit');
      }
    });

    // Build SVG Path string for the complete route
    let pathD = '';
    for (let i = 0; i < path.length; i++) {
      const ap = this.graph.getVertex(path[i]);
      const pt = this.project(ap.lat, ap.lng);
      if (i === 0) {
        pathD += `M ${pt.x} ${pt.y}`;
      } else {
        pathD += ` L ${pt.x} ${pt.y}`;
      }
    }

    // Active route edge line
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    routePath.setAttribute('d', pathD);
    routePath.setAttribute('class', 'edge-active-route');
    routePath.setAttribute('id', 'activeFlightRoutePath');
    this.activeRouteEdgesGroup.appendChild(routePath);

    // Animated Flight Marker (Plane moving along path)
    const planeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    planeGroup.setAttribute('class', 'animated-airplane');

    const planeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    planeIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#planeMarker');
    planeIcon.setAttribute('x', '-12');
    planeIcon.setAttribute('y', '-12');
    planeGroup.appendChild(planeIcon);

    const animMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animMotion.setAttribute('path', pathD);
    animMotion.setAttribute('dur', `${Math.max(3, path.length * 1.8)}s`);
    animMotion.setAttribute('repeatCount', 'indefinite');
    animMotion.setAttribute('rotate', 'auto');
    planeGroup.appendChild(animMotion);

    this.animatedFlightsGroup.appendChild(planeGroup);
  }

  /**
   * Highlight Prim's Minimum Spanning Tree edges
   */
  highlightMST(mstEdges) {
    this.mstEdges = mstEdges || [];
    this.mstEdgesGroup.innerHTML = '';

    mstEdges.forEach(edge => {
      const u = this.graph.getVertex(edge.u);
      const v = this.graph.getVertex(edge.v);
      if (!u || !v) return;

      const p1 = this.project(u.lat, u.lng);
      const p2 = this.project(v.lat, v.lng);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.setAttribute('class', 'edge-mst-route');
      this.mstEdgesGroup.appendChild(line);
    });
  }

  /**
   * Display alternative K-routes in distinguishable styles
   */
  highlightAlternativeRoutes(alternativePaths) {
    this.activeRouteEdgesGroup.innerHTML = '';
    this.animatedFlightsGroup.innerHTML = '';

    if (!alternativePaths || alternativePaths.length === 0) return;

    // Draw secondary alternatives first (Rank 3, then Rank 2)
    for (let k = alternativePaths.length - 1; k >= 1; k--) {
      const altPath = alternativePaths[k].path;
      let pathD = '';
      for (let i = 0; i < altPath.length; i++) {
        const ap = this.graph.getVertex(altPath[i]);
        const pt = this.project(ap.lat, ap.lng);
        if (i === 0) pathD += `M ${pt.x} ${pt.y}`;
        else pathD += ` L ${pt.x} ${pt.y}`;
      }

      const altSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      altSvgPath.setAttribute('d', pathD);
      altSvgPath.setAttribute('class', 'edge-alternative-route');
      this.activeRouteEdgesGroup.appendChild(altSvgPath);
    }

    // Draw optimal route on top with animation
    this.highlightRoute(alternativePaths[0].path);
  }

  clearHighlights() {
    this.activeRouteEdgesGroup.innerHTML = '';
    this.animatedFlightsGroup.innerHTML = '';
    this.mstEdgesGroup.innerHTML = '';
    const allNodeGroups = this.airportNodesGroup.querySelectorAll('.airport-node-group');
    allNodeGroups.forEach(g => {
      g.classList.remove('node-origin', 'node-dest', 'node-transit');
    });
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    if (mode === 'all') {
      this.flightEdgesGroup.style.display = 'block';
      this.mstEdgesGroup.style.display = 'none';
      this.activeRouteEdgesGroup.style.display = 'block';
    } else if (mode === 'active') {
      this.flightEdgesGroup.style.display = 'none';
      this.mstEdgesGroup.style.display = 'none';
      this.activeRouteEdgesGroup.style.display = 'block';
    } else if (mode === 'mst') {
      this.flightEdgesGroup.style.display = 'none';
      this.mstEdgesGroup.style.display = 'block';
      this.activeRouteEdgesGroup.style.display = 'none';
      this.animatedFlightsGroup.innerHTML = '';
    }
  }

  // --- Pan and Zoom Interactions ---
  attachPanZoomEvents() {
    const wrapper = document.getElementById('svgMapWrapper');

    wrapper.addEventListener('mousedown', (e) => {
      if (e.target.closest('.airport-node-group')) return;
      this.isPanning = true;
      this.startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      const dx = (e.clientX - this.startPoint.x) * (this.viewBox.w / wrapper.clientWidth);
      const dy = (e.clientY - this.startPoint.y) * (this.viewBox.h / wrapper.clientHeight);

      this.viewBox.x -= dx;
      this.viewBox.y -= dy;
      this.updateViewBox();

      this.startPoint = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });

    wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
      this.zoom(zoomFactor, e.clientX, e.clientY);
    }, { passive: false });

    // Buttons
    document.getElementById('zoomInBtn').addEventListener('click', () => this.zoom(0.8));
    document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoom(1.25));
    document.getElementById('zoomResetBtn').addEventListener('click', () => this.resetView());
  }

  zoom(factor, clientX, clientY) {
    const wrapper = document.getElementById('svgMapWrapper');
    const rect = wrapper.getBoundingClientRect();

    const mouseX = clientX ? (clientX - rect.left) / rect.width : 0.5;
    const mouseY = clientY ? (clientY - rect.top) / rect.height : 0.5;

    const newW = this.viewBox.w * factor;
    const newH = this.viewBox.h * factor;

    // Constrain zoom levels
    if (newW < 300 || newW > 1800) return;

    this.viewBox.x += (this.viewBox.w - newW) * mouseX;
    this.viewBox.y += (this.viewBox.h - newH) * mouseY;
    this.viewBox.w = newW;
    this.viewBox.h = newH;

    this.updateViewBox();
  }

  resetView() {
    this.viewBox = { ...this.initialViewBox };
    this.updateViewBox();
  }

  updateViewBox() {
    this.svg.setAttribute('viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.w} ${this.viewBox.h}`);
  }

  // --- Tooltips ---
  showAirportTooltip(event, airport) {
    const tooltip = document.getElementById('airportTooltip');
    const neighbors = this.graph.getNeighbors(airport.code);

    const directDests = neighbors.map(e => e.to).join(', ');

    tooltip.innerHTML = `
      <div class="tooltip-title">
        <span>${airport.code}</span> &bull; <span>${airport.city}</span>
      </div>
      <div class="tooltip-city">${airport.name}</div>
      <div class="tooltip-body">
        <div><strong>Coordinates:</strong> ${airport.lat.toFixed(4)}\u00B0N, ${airport.lng.toFixed(4)}\u00B0E</div>
        <div><strong>Direct Flights:</strong> ${neighbors.length} links</div>
        <div><strong>Destinations:</strong> ${directDests}</div>
      </div>
    `;

    const wrapper = document.getElementById('svgMapWrapper');
    const rect = wrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.classList.add('active');
  }

  hideAirportTooltip() {
    const tooltip = document.getElementById('airportTooltip');
    tooltip.classList.remove('active');
  }
}

// ============================================================================
// 5. APPLICATION CONTROLLER & UI MANAGEMENT
// ============================================================================

class AppController {
  constructor() {
    this.graph = new Graph();
    this.mapRenderer = null;
    this.currentTrace = null;
    this.traceStepIndex = 0;
    this.traceIntervalId = null;
    this.routesCalculatedCount = 0;
    this.activeAirportForModal = null;

    this.initDataset();
    this.initDOM();
    this.initEventListeners();
    this.updateSummaryStats();
    this.loadAlgorithmDocs('dijkstra');
  }

  initDataset() {
    // Populate graph vertices
    AIRPORTS_DATA.forEach(ap => this.graph.addVertex(ap));

    // Populate graph edges
    FLIGHT_CORRIDORS_DATA.forEach(corr => {
      this.graph.addEdge(corr.u, corr.v, corr.distance, corr.duration, corr.fare);
    });
  }

  initDOM() {
    // Initialize SVG Map
    const svgElement = document.getElementById('networkSvg');
    this.mapRenderer = new SVGMapRenderer(svgElement, this.graph);

    // Populate Select Dropdowns
    const srcSelect = document.getElementById('sourceAirportSelect');
    const dstSelect = document.getElementById('destAirportSelect');
    const airports = this.graph.getAllVertices().sort((a, b) => a.city.localeCompare(b.city));

    airports.forEach(ap => {
      const opt1 = new Option(`${ap.city} (${ap.code}) - ${ap.name}`, ap.code);
      const opt2 = new Option(`${ap.city} (${ap.code}) - ${ap.name}`, ap.code);
      srcSelect.add(opt1);
      dstSelect.add(opt2);
    });

    // Populate Airport Table in Network Tab
    this.populateNetworkTable();

    // Set Default Selection
    srcSelect.value = 'DEL';
    dstSelect.value = 'BLR';
  }

  initEventListeners() {
    // Tab Switching
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Route Planner Form Submission
    const routeForm = document.getElementById('routePlannerForm');
    routeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.executeRouteCalculation();
    });

    // Swap Source & Destination
    document.getElementById('swapAirportsBtn').addEventListener('click', () => {
      const srcSelect = document.getElementById('sourceAirportSelect');
      const dstSelect = document.getElementById('destAirportSelect');
      const temp = srcSelect.value;
      srcSelect.value = dstSelect.value;
      dstSelect.value = temp;
    });

    // Clear Route
    document.getElementById('clearRouteBtn').addEventListener('click', () => {
      this.clearCurrentRoute();
    });

    // Preset chips
    const presetChips = document.querySelectorAll('.preset-chip');
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const src = chip.getAttribute('data-src');
        const dst = chip.getAttribute('data-dst');
        document.getElementById('sourceAirportSelect').value = src;
        document.getElementById('destAirportSelect').value = dst;
        this.executeRouteCalculation();
      });
    });

    // Map View Switcher (All Corridors, Active Route, MST)
    document.getElementById('viewModeAll').addEventListener('click', (e) => {
      this.setActiveViewBtn(e.target);
      this.mapRenderer.setViewMode('all');
    });
    document.getElementById('viewModeActive').addEventListener('click', (e) => {
      this.setActiveViewBtn(e.target);
      this.mapRenderer.setViewMode('active');
    });
    document.getElementById('viewModeMst').addEventListener('click', (e) => {
      this.setActiveViewBtn(e.target);
      this.executeMSTCalculation();
      this.mapRenderer.setViewMode('mst');
    });

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      try { localStorage.setItem('aerograph_theme', newTheme); } catch (e) {}
    });

    // Load persisted theme
    try {
      const savedTheme = localStorage.getItem('aerograph_theme');
      if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (e) {}

    // Reset App
    document.getElementById('resetAppBtn').addEventListener('click', () => {
      document.getElementById('sourceAirportSelect').value = 'DEL';
      document.getElementById('destAirportSelect').value = 'BLR';
      document.getElementById('algorithmSelect').value = 'dijkstra-distance';
      this.clearCurrentRoute();
      this.mapRenderer.resetView();
      this.setActiveViewBtn(document.getElementById('viewModeAll'));
      this.mapRenderer.setViewMode('all');
      this.switchTab('dashboard');
    });

    // Mobile Sidebar Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebarClose = document.getElementById('mobileSidebarClose');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => sidebar.classList.add('mobile-open'));
    }
    if (mobileSidebarClose && sidebar) {
      mobileSidebarClose.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
    }

    // Global Search Autocomplete
    const searchInput = document.getElementById('globalAirportSearch');
    const searchDropdown = document.getElementById('searchResultsDropdown');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        searchDropdown.classList.remove('active');
        return;
      }

      const matches = this.graph.getAllVertices().filter(ap => 
        ap.code.toLowerCase().includes(query) ||
        ap.city.toLowerCase().includes(query) ||
        ap.name.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        searchDropdown.innerHTML = matches.map(ap => `
          <div class="search-item" data-code="${ap.code}">
            <div class="search-item-info">
              <strong>${ap.code}</strong>
              <span>${ap.city} &bull; ${ap.name}</span>
            </div>
            <span class="search-item-badge">${ap.region}</span>
          </div>
        `).join('');
        searchDropdown.classList.add('active');

        searchDropdown.querySelectorAll('.search-item').forEach(item => {
          item.addEventListener('click', () => {
            const code = item.getAttribute('data-code');
            const ap = this.graph.getVertex(code);
            searchDropdown.classList.remove('active');
            searchInput.value = '';
            this.openAirportModal(ap);
          });
        });
      } else {
        searchDropdown.innerHTML = `<div class="search-item" style="color: var(--text-muted);">No airports matching "${query}"</div>`;
        searchDropdown.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
      }
    });

    // Network Table Filter
    const networkFilterInput = document.getElementById('networkFilterInput');
    if (networkFilterInput) {
      networkFilterInput.addEventListener('input', (e) => {
        this.populateNetworkTable(e.target.value.trim().toLowerCase());
      });
    }

    // Algorithm Stepper Controls
    document.getElementById('stepPrevBtn').addEventListener('click', () => this.stepTrace(-1));
    document.getElementById('stepNextBtn').addEventListener('click', () => this.stepTrace(1));
    document.getElementById('stepPlayPauseBtn').addEventListener('click', () => this.toggleTracePlay());
    document.getElementById('stepResetBtn').addEventListener('click', () => this.resetTrace());

    // Algorithm Docs Tabs
    const algoDocBtns = document.querySelectorAll('.algo-tab-btn');
    algoDocBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        algoDocBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadAlgorithmDocs(btn.getAttribute('data-algo'));
      });
    });

    // Modal Events
    document.getElementById('modalCloseBtn').addEventListener('click', () => this.closeAirportModal());
    document.getElementById('airportModalBackdrop').addEventListener('click', (e) => {
      if (e.target.id === 'airportModalBackdrop') this.closeAirportModal();
    });

    document.getElementById('modalSetOriginBtn').addEventListener('click', () => {
      if (this.activeAirportForModal) {
        document.getElementById('sourceAirportSelect').value = this.activeAirportForModal.code;
        this.closeAirportModal();
        this.switchTab('dashboard');
      }
    });

    document.getElementById('modalSetDestBtn').addEventListener('click', () => {
      if (this.activeAirportForModal) {
        document.getElementById('destAirportSelect').value = this.activeAirportForModal.code;
        this.closeAirportModal();
        this.switchTab('dashboard');
      }
    });
  }

  setActiveViewBtn(btn) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  switchTab(tabId) {
    // Update sidebar navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabId) item.classList.add('active');
      else item.classList.remove('active');
    });

    // Update active pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    const targetPane = document.getElementById(`pane-${tabId}`);
    if (targetPane) targetPane.classList.add('active');

    // Update Header Title
    const headerTitle = document.getElementById('pageHeaderTitle');
    const titles = {
      dashboard: 'Flight Route Operations Dashboard',
      network: 'Airport Network Topology & Registry',
      comparison: 'Alternative Route Comparison Matrix (Yen\'s K-Paths)',
      algorithms: 'Algorithm Visualizer & Step-by-Step Execution Tracer',
      about: 'About AeroGraph — Academic Project Overview'
    };
    if (headerTitle && titles[tabId]) headerTitle.textContent = titles[tabId];

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  }

  updateSummaryStats() {
    const stats = this.graph.getNetworkStatistics();
    document.getElementById('statTotalAirports').textContent = stats.totalAirports;
    document.getElementById('statTotalEdges').textContent = stats.totalEdges;
    document.getElementById('statAvgDistance').textContent = `${stats.avgDistance} km`;
    document.getElementById('statRoutesCalculated').textContent = this.routesCalculatedCount;
  }

  /**
   * Main calculation entrypoint based on selected origin, destination, and algorithm.
   */
  executeRouteCalculation() {
    const src = document.getElementById('sourceAirportSelect').value;
    const dst = document.getElementById('destAirportSelect').value;
    const algoChoice = document.getElementById('algorithmSelect').value;

    if (!src || !dst) {
      alert('Please select both Origin and Destination airports.');
      return;
    }

    if (src === dst) {
      alert('Origin and Destination cannot be the same airport.');
      return;
    }

    // Check reachability
    if (!this.graph.isReachable(src, dst)) {
      this.renderUnreachableRoute(src, dst);
      return;
    }

    this.routesCalculatedCount++;
    this.updateSummaryStats();

    if (algoChoice === 'prim-mst') {
      this.executeMSTCalculation();
      return;
    }

    if (algoChoice === 'k-shortest') {
      this.executeKShortestCalculation(src, dst);
      return;
    }

    // Standard Dijkstra calculation
    let metric = 'distance';
    if (algoChoice === 'dijkstra-fare') metric = 'fare';
    else if (algoChoice === 'dijkstra-time') metric = 'duration';

    const result = GraphAlgorithms.dijkstra(this.graph, src, dst, metric);

    if (result.found) {
      this.renderRouteResults(result);
      this.mapRenderer.highlightRoute(result.path);
      this.setActiveViewBtn(document.getElementById('viewModeActive'));
      this.mapRenderer.setViewMode('all');

      // Also generate K-shortest paths for comparison tab
      this.executeKShortestCalculation(src, dst, false);

      // Prepare Step Tracer
      this.prepareAlgorithmTracer(result.traceSteps, src, dst);
    }
  }

  /**
   * Render computed optimal route in the Dossier panel
   */
  renderRouteResults(result) {
    const container = document.getElementById('routeResultsContent');
    const badge = document.getElementById('routeStatusBadge');
    badge.className = 'badge badge-success';
    badge.textContent = `OPTIMAL (${result.metric.toUpperCase()})`;

    const srcAp = this.graph.getVertex(result.path[0]);
    const dstAp = this.graph.getVertex(result.path[result.path.length - 1]);

    // Format flight duration into hours and minutes
    const hours = Math.floor(result.totalDuration);
    const minutes = Math.round((result.totalDuration - hours) * 60);
    const timeFormatted = `${hours}h ${minutes}m`;

    // Calculate simulated efficiency indicator (ratio to straight-line distance)
    const directHaversine = this.calculateHaversine(srcAp.lat, srcAp.lng, dstAp.lat, dstAp.lng);
    const efficiencyRatio = Math.min(100, Math.round((directHaversine / result.totalDistance) * 100));

    // Construct Itinerary Timeline
    let timelineHtml = '<div class="itinerary-timeline">';
    result.path.forEach((code, index) => {
      const ap = this.graph.getVertex(code);
      let legClass = 'transit';
      let tagText = 'Transit Hub';

      if (index === 0) {
        legClass = 'origin';
        tagText = 'Origin Departure';
      } else if (index === result.path.length - 1) {
        legClass = 'destination';
        tagText = 'Final Arrival';
      }

      let metaHtml = '';
      if (index < result.path.length - 1) {
        const leg = result.legs[index];
        metaHtml = `
          <div class="leg-flight-meta">
            <span>Airway Leg #${index + 1}</span>
            <span>${leg.distance} km &bull; ${leg.duration}h &bull; \u20B9${leg.fare.toLocaleString('en-IN')}</span>
          </div>
        `;
      }

      timelineHtml += `
        <div class="timeline-leg ${legClass}">
          <div class="timeline-node"></div>
          <div class="timeline-content">
            <div>
              <div class="airport-name-tag">${ap.code} &bull; ${ap.city}</div>
              <div class="airport-sub-tag">${tagText} (${ap.name})</div>
            </div>
            ${metaHtml}
          </div>
        </div>
      `;
    });
    timelineHtml += '</div>';

    container.innerHTML = `
      <div class="result-header-box">
        <div class="result-codes-display">
          <span class="code-pill">${srcAp.code}</span>
          <div class="flight-arrow-path">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 19 21 12 17 5 21 12 2"/>
            </svg>
            <span class="stops-badge">${result.stops === 0 ? 'Non-Stop Direct' : `${result.stops} Stopover${result.stops > 1 ? 's' : ''}`}</span>
          </div>
          <span class="code-pill">${dstAp.code}</span>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700; color: #fff;">${srcAp.city} &rarr; ${dstAp.city}</div>
          <small style="color: var(--text-muted);">Simulated Flight Corridors</small>
        </div>
      </div>

      <div class="result-metrics-grid">
        <div class="metric-pill">
          <small>Total Distance</small>
          <strong>${result.totalDistance.toLocaleString()} km</strong>
        </div>
        <div class="metric-pill">
          <small>Estimated Duration</small>
          <strong>${timeFormatted}</strong>
        </div>
        <div class="metric-pill">
          <small>Estimated Total Fare</small>
          <strong style="color: var(--accent-emerald);">\u20B9${result.totalFare.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      <div class="efficiency-card">
        <div class="efficiency-info">
          <small>Route Efficiency Index</small>
          <span>${efficiencyRatio}% Geodetic Direct Alignment</span>
          <div class="efficiency-bar-container">
            <div class="efficiency-bar" style="width: ${efficiencyRatio}%;"></div>
          </div>
        </div>
        <button class="button button-sm button-secondary" id="viewComparisonQuickBtn">Compare Alternatives</button>
      </div>

      <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Flight Leg Sequence</h4>
      ${timelineHtml}
    `;

    document.getElementById('viewComparisonQuickBtn').addEventListener('click', () => {
      this.switchTab('comparison');
    });
  }

  renderUnreachableRoute(src, dst) {
    const container = document.getElementById('routeResultsContent');
    const badge = document.getElementById('routeStatusBadge');
    badge.className = 'badge badge-warning';
    badge.textContent = 'DISCONNECTED';

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="color: var(--accent-crimson);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h4>No Navigational Route Available</h4>
        <p>No valid sequence of flight corridors connects <strong>${src}</strong> and <strong>${dst}</strong> in this airspace dataset.</p>
      </div>
    `;
    this.mapRenderer.clearHighlights();
  }

  clearCurrentRoute() {
    this.mapRenderer.clearHighlights();
    const container = document.getElementById('routeResultsContent');
    const badge = document.getElementById('routeStatusBadge');
    badge.className = 'badge';
    badge.textContent = 'READY';

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <h4>No Route Computed Yet</h4>
        <p>Select origin and destination airports and click <strong>Calculate Optimal Route</strong> to run graph relaxation algorithms.</p>
      </div>
    `;
  }

  /**
   * Prim's Minimum Spanning Tree execution & display
   */
  executeMSTCalculation() {
    const mst = GraphAlgorithms.primsMST(this.graph, 'distance');
    this.mapRenderer.highlightMST(mst.mstEdges);
    this.mapRenderer.setViewMode('mst');
    this.setActiveViewBtn(document.getElementById('viewModeMst'));

    const container = document.getElementById('routeResultsContent');
    const badge = document.getElementById('routeStatusBadge');
    badge.className = 'badge badge-accent';
    badge.textContent = 'PRIM\'S MST ACTIVE';

    // Calculate total full network distance vs MST distance to show savings
    let totalFullDistance = 0;
    this.graph.getAllEdges().forEach(e => totalFullDistance += e.distance);
    const savings = Math.round(((totalFullDistance - mst.totalWeight) / totalFullDistance) * 100);

    container.innerHTML = `
      <div class="result-header-box" style="border-left: 3px solid var(--accent-emerald);">
        <div>
          <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.2rem;">Minimum Spanning Tree (MST)</h4>
          <small style="color: var(--accent-emerald);">Prim's Greedy Algorithm &bull; Minimum Total Air Corridor Distance</small>
        </div>
        <span class="badge badge-success">${mst.connectedRatio}% Connected</span>
      </div>

      <div class="result-metrics-grid">
        <div class="metric-pill">
          <small>MST Total Distance</small>
          <strong style="color: var(--accent-emerald);">${mst.totalWeight.toLocaleString()} km</strong>
        </div>
        <div class="metric-pill">
          <small>Selected Corridors</small>
          <strong>${mst.mstEdges.length} Edges</strong>
        </div>
        <div class="metric-pill">
          <small>Network Redundancy</small>
          <strong style="color: var(--accent-sky);">${savings}% Saved</strong>
        </div>
      </div>

      <div class="alert-box mb-2">
        <strong>Important Graph Theory Note:</strong> Prim's Algorithm computes a spanning tree that connects all reachable airports with the minimum cumulative edge weight. It guarantees zero cycles. It is designed for <em>infrastructure backbone optimization</em>, NOT point-to-point passenger routing.
      </div>

      <h4 style="font-size: 0.85rem; color: var(--text-muted); margin: 0.75rem 0 0.5rem; text-transform: uppercase;">Selected Spanning Corridors</h4>
      <div style="max-height: 220px; overflow-y: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;">
        ${mst.mstEdges.map((e, idx) => `
          <div style="display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
            <span>${idx + 1}. ${e.u} &harr; ${e.v}</span>
            <span style="color: var(--accent-sky);">${e.distance} km</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Yen's K-Shortest Loopless Paths execution & rendering
   */
  executeKShortestCalculation(src, dst, switchTab = true) {
    const kPaths = GraphAlgorithms.yensKShortestPaths(this.graph, src, dst, 3, 'distance');
    const container = document.getElementById('comparisonContainer');

    if (!kPaths || kPaths.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h4>No Alternative Routes Found</h4>
          <p>No valid loopless alternative paths exist between ${src} and ${dst}.</p>
        </div>
      `;
      return;
    }

    // Render comparison cards
    container.innerHTML = `
      <div class="comparison-grid">
        ${kPaths.map((route, idx) => {
          const hours = Math.floor(route.totalDuration);
          const mins = Math.round((route.totalDuration - hours) * 60);
          const isOptimal = idx === 0;

          return `
            <div class="comparison-card ${isOptimal ? 'recommended' : ''}">
              <div class="comparison-rank">
                ${isOptimal ? '\u2605 Option 1 (Primary Route)' : `Option ${route.rank} (Alternative ${route.rank - 1})`}
              </div>
              <div class="comparison-path-sequence">
                ${route.path.join(' &rarr; ')}
              </div>
              <div class="comparison-metrics-list">
                <div class="comparison-metric-row">
                  <span>Routing Criterion</span>
                  <strong style="color: ${isOptimal ? 'var(--accent-emerald)' : 'var(--accent-sky)'};">
                    ${isOptimal ? 'Shortest by Distance' : 'Alternative Corridor'}
                  </strong>
                </div>
                <div class="comparison-metric-row">
                  <span>Total Distance</span>
                  <strong>${route.totalDistance.toLocaleString()} km</strong>
                </div>
                <div class="comparison-metric-row">
                  <span>Estimated Duration</span>
                  <strong>${hours}h ${mins}m</strong>
                </div>
                <div class="comparison-metric-row">
                  <span>Estimated Fare</span>
                  <strong>\u20B9${route.totalFare.toLocaleString('en-IN')}</strong>
                </div>
                <div class="comparison-metric-row">
                  <span>Stops</span>
                  <strong>${route.stops === 0 ? 'Direct' : `${route.stops} stop(s)`}</strong>
                </div>
              </div>
              <button class="button button-sm ${isOptimal ? 'button-primary' : 'button-secondary'} select-alt-route-btn" data-index="${idx}">
                Visualize This Path
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Visual button handlers
    container.querySelectorAll('.select-alt-route-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const selected = kPaths[index];
        this.renderRouteResults({
          found: true,
          path: selected.path,
          legs: selected.legs,
          totalDistance: selected.totalDistance,
          totalDuration: selected.totalDuration,
          totalFare: selected.totalFare,
          stops: selected.stops,
          metric: 'distance'
        });
        this.mapRenderer.highlightRoute(selected.path);
        this.switchTab('dashboard');
      });
    });

    if (switchTab) {
      this.mapRenderer.highlightAlternativeRoutes(kPaths);
      this.switchTab('comparison');
    }
  }

  // --- Step-by-Step Algorithm Tracer ---
  prepareAlgorithmTracer(traceSteps, src, dst) {
    this.currentTrace = traceSteps;
    this.traceStepIndex = 0;
    this.clearIntervalTrace();

    const playBtn = document.getElementById('stepPlayPauseBtn');
    playBtn.innerHTML = '&#9654; Play';

    this.renderTraceStep(0);
  }

  renderTraceStep(index) {
    if (!this.currentTrace || this.currentTrace.length === 0) return;

    this.traceStepIndex = Math.max(0, Math.min(index, this.currentTrace.length - 1));
    const step = this.currentTrace[this.traceStepIndex];

    // Update Progress
    const pct = Math.round(((this.traceStepIndex + 1) / this.currentTrace.length) * 100);
    document.getElementById('stepperProgressBar').style.width = `${pct}%`;
    document.getElementById('stepCounterLabel').textContent = `Step ${this.traceStepIndex + 1} / ${this.currentTrace.length}`;
    document.getElementById('stepCurrentAction').textContent = step.message;

    // Update Relaxation Table
    const tableBody = document.getElementById('tracerTableBody');
    const vertices = this.graph.getAllVertices();

    tableBody.innerHTML = vertices.map(v => {
      const isSettled = step.visited.includes(v.code);
      const isCurrent = step.current === v.code;
      const dist = step.distances[v.code];
      const pred = step.previous[v.code] || '--';

      let statusBadge = '<span class="badge">Unvisited</span>';
      if (isCurrent) statusBadge = '<span class="badge badge-accent">Current Node</span>';
      else if (isSettled) statusBadge = '<span class="badge badge-success">Settled</span>';
      else if (dist !== Infinity) statusBadge = '<span class="badge badge-warning">In Priority Queue</span>';

      return `
        <tr>
          <td><strong>${v.code}</strong> (${v.city})</td>
          <td>${statusBadge}</td>
          <td class="font-mono">${dist === Infinity ? '\u221E' : `${Math.round(dist)} km`}</td>
          <td class="font-mono">${pred}</td>
        </tr>
      `;
    }).join('');

    // Append to Terminal Log
    const terminal = document.getElementById('tracerTerminalLog');
    let logClass = 'log-info';
    if (step.type === 'RELAX') logClass = 'log-relax';
    else if (step.type === 'TARGET_REACHED') logClass = 'log-target';

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${logClass}`;
    logEntry.textContent = `[Step ${this.traceStepIndex + 1}] ${step.message}`;
    terminal.appendChild(logEntry);
    terminal.scrollTop = terminal.scrollHeight;
  }

  stepTrace(delta) {
    this.clearIntervalTrace();
    this.renderTraceStep(this.traceStepIndex + delta);
  }

  toggleTracePlay() {
    const playBtn = document.getElementById('stepPlayPauseBtn');
    if (this.traceIntervalId) {
      this.clearIntervalTrace();
      playBtn.innerHTML = '&#9654; Play';
    } else {
      playBtn.innerHTML = '&#10074;&#10074; Pause';
      this.traceIntervalId = setInterval(() => {
        if (this.traceStepIndex >= this.currentTrace.length - 1) {
          this.clearIntervalTrace();
          playBtn.innerHTML = '&#9654; Play';
          return;
        }
        this.renderTraceStep(this.traceStepIndex + 1);
      }, 700);
    }
  }

  resetTrace() {
    this.clearIntervalTrace();
    document.getElementById('stepPlayPauseBtn').innerHTML = '&#9654; Play';
    document.getElementById('tracerTerminalLog').innerHTML = '';
    this.renderTraceStep(0);
  }

  clearIntervalTrace() {
    if (this.traceIntervalId) {
      clearInterval(this.traceIntervalId);
      this.traceIntervalId = null;
    }
  }

  // --- Network Table ---
  populateNetworkTable(filter = '') {
    const tbody = document.getElementById('airportsTableBody');
    if (!tbody) return;

    const vertices = this.graph.getAllVertices()
      .filter(ap => !filter || ap.code.toLowerCase().includes(filter) || ap.city.toLowerCase().includes(filter) || ap.name.toLowerCase().includes(filter))
      .sort((a, b) => a.city.localeCompare(b.city));

    tbody.innerHTML = vertices.map(ap => {
      const neighbors = this.graph.getNeighbors(ap.code);
      const destBadges = neighbors.map(n => `<span class="dest-tag">${n.to}</span>`).join('');

      return `
        <tr>
          <td><span class="airport-code-badge">${ap.code}</span></td>
          <td><strong>${ap.name}</strong></td>
          <td>${ap.city}, ${ap.region} India</td>
          <td class="font-mono" style="font-size: 0.78rem;">${ap.lat.toFixed(4)}\u00B0N, ${ap.lng.toFixed(4)}\u00B0E</td>
          <td><span class="badge badge-accent">${neighbors.length} Corridors</span></td>
          <td>${destBadges}</td>
          <td>
            <button class="button button-sm button-secondary table-inspect-btn" data-code="${ap.code}">
              Inspect
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.table-inspect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        const ap = this.graph.getVertex(code);
        this.openAirportModal(ap);
      });
    });
  }

  // --- Airport Modal ---
  openAirportModal(airport) {
    this.activeAirportForModal = airport;
    const modal = document.getElementById('airportModalBackdrop');
    const title = document.getElementById('modalAirportTitle');
    const body = document.getElementById('modalAirportBody');

    const neighbors = this.graph.getNeighbors(airport.code);

    title.textContent = `${airport.city} (${airport.code}) Airport Details`;
    body.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <h4 style="font-size: 1.05rem; color: #fff;">${airport.name}</h4>
        <span style="color: var(--accent-sky); font-size: 0.8rem;">${airport.region} Indian Air Traffic Division</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="background: var(--bg-input); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <small style="color: var(--text-muted); display: block;">WGS84 Coordinates</small>
          <strong class="font-mono">${airport.lat.toFixed(4)}\u00B0N, ${airport.lng.toFixed(4)}\u00B0E</strong>
        </div>
        <div style="background: var(--bg-input); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <small style="color: var(--text-muted); display: block;">Degree of Vertex</small>
          <strong class="font-mono">${neighbors.length} Direct Corridors</strong>
        </div>
      </div>

      <h5 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Direct Flight Connections</h5>
      <div style="max-height: 180px; overflow-y: auto;">
        ${neighbors.map(n => `
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.82rem;">
            <span>&rarr; <strong>${n.to}</strong></span>
            <span class="font-mono" style="color: var(--text-muted);">${n.distance} km &bull; ${n.duration}h &bull; \u20B9${n.fare.toLocaleString('en-IN')}</span>
          </div>
        `).join('')}
      </div>
    `;

    modal.classList.add('active');
  }

  closeAirportModal() {
    const modal = document.getElementById('airportModalBackdrop');
    modal.classList.remove('active');
    this.activeAirportForModal = null;
  }

  handleAirportNodeClick(airport) {
    this.openAirportModal(airport);
  }

  // --- Algorithm Documentation Ingestion ---
  loadAlgorithmDocs(algoKey) {
    const container = document.getElementById('algoDocContent');
    if (!container) return;

    if (algoKey === 'dijkstra') {
      container.innerHTML = `
        <h3 style="font-size: 1.05rem; margin-bottom: 0.4rem;">Dijkstra's Single-Source Shortest Path</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Dijkstra's algorithm solves the single-source shortest path problem on a weighted graph with non-negative edge weights. It operates greedily by always visiting the unvisited vertex with the smallest tentative distance, relaxing all outgoing incident edges.
        </p>

        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
          <div style="background: var(--bg-input); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <small style="color: var(--text-muted); display: block;">Time Complexity</small>
            <strong class="font-mono text-accent">O((V + E) log V)</strong>
          </div>
          <div style="background: var(--bg-input); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <small style="color: var(--text-muted); display: block;">Space Complexity</small>
            <strong class="font-mono text-accent">O(V + E)</strong>
          </div>
        </div>

        <div class="pseudocode-block">
<span class="keyword">function</span> <span class="fn">Dijkstra</span>(Graph, source, target):
  <span class="keyword">for each</span> vertex v <span class="keyword">in</span> Graph:
    dist[v] &larr; &infin;
    prev[v] &larr; <span class="keyword">null</span>
  dist[source] &larr; 0
  Q &larr; MinPriorityQueue()
  Q.insert(source, 0)

  <span class="keyword">while</span> Q <span class="keyword">is not empty</span>:
    u &larr; Q.extractMin()
    <span class="keyword">if</span> u == target: <span class="keyword">break</span>
    <span class="keyword">for each</span> neighbor v <span class="keyword">of</span> u:
      alt &larr; dist[u] + weight(u, v)
      <span class="keyword">if</span> alt &lt; dist[v]:
        dist[v] &larr; alt
        prev[v] &larr; u
        Q.insert(v, alt)
  <span class="keyword">return</span> reconstructPath(prev, target)
        </div>
      `;
    } else if (algoKey === 'prim') {
      container.innerHTML = `
        <h3 style="font-size: 1.05rem; margin-bottom: 0.4rem;">Prim's Minimum Spanning Tree (MST)</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Prim's algorithm builds a spanning tree of minimal total edge weight by growing a single tree from an arbitrary root. At each step, it adds the cheapest edge connecting a tree vertex to an outside vertex.
        </p>

        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
          <div style="background: var(--bg-input); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <small style="color: var(--text-muted); display: block;">Time Complexity</small>
            <strong class="font-mono text-accent">O(E log V)</strong>
          </div>
          <div style="background: var(--bg-input); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <small style="color: var(--text-muted); display: block;">Optimality</small>
            <strong class="font-mono text-accent">Minimum Spanning Forest</strong>
          </div>
        </div>

        <div class="pseudocode-block">
<span class="keyword">function</span> <span class="fn">PrimsMST</span>(Graph):
  MST &larr; empty set
  inMST &larr; empty set
  startNode &larr; Graph.vertices[0]
  inMST.add(startNode)
  Q &larr; MinPriorityQueue(startNode.edges)

  <span class="keyword">while</span> Q <span class="keyword">is not empty and</span> |inMST| &lt; |V|:
    edge(u, v) &larr; Q.extractMin()
    <span class="keyword">if</span> v &isin; inMST: <span class="keyword">continue</span>
    inMST.add(v)
    MST.add(edge(u, v))
    <span class="keyword">for each</span> outgoing edge(v, w):
      <span class="keyword">if</span> w &notin; inMST: Q.insert(edge(v, w))
  <span class="keyword">return</span> MST
        </div>
      `;
    } else if (algoKey === 'yen') {
      container.innerHTML = `
        <h3 style="font-size: 1.05rem; margin-bottom: 0.4rem;">Yen's K-Shortest Loopless Paths</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Yen's algorithm finds the top K loopless paths in non-decreasing order of cost. It utilizes Dijkstra to find the first shortest path, then systematically derives deviations at spur nodes while avoiding cycles.
        </p>

        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem;">
          <div style="background: var(--bg-input); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <small style="color: var(--text-muted); display: block;">Time Complexity</small>
            <strong class="font-mono text-accent">O(K &bull; V &bull; (E + V log V))</strong>
          </div>
          <div style="background: var(--bg-input); padding: 0.5rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <small style="color: var(--text-muted); display: block;">Applications</small>
            <strong class="font-mono text-accent">Airspace Bypass / Weather Deviation</strong>
          </div>
        </div>

        <div class="pseudocode-block">
<span class="keyword">function</span> <span class="fn">YensKShortest</span>(Graph, source, sink, K):
  A[0] &larr; Dijkstra(Graph, source, sink)
  B &larr; MinPriorityQueue()

  <span class="keyword">for</span> k <span class="keyword">from</span> 1 <span class="keyword">to</span> K-1:
    <span class="keyword">for</span> i <span class="keyword">from</span> 0 <span class="keyword">to</span> |A[k-1]| - 2:
      spurNode &larr; A[k-1][i]
      rootPath &larr; A[k-1][0...i]
      <span class="comment">// Temporarily remove overlapping edges & root nodes</span>
      spurPath &larr; Dijkstra(Graph, spurNode, sink)
      totalPath &larr; rootPath + spurPath
      B.insert(totalPath)
    A[k] &larr; B.extractMin()
  <span class="keyword">return</span> A
        </div>
      `;
    }
  }

  // --- Great Circle / Haversine Distance (km) ---
  calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's mean radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
}

// ============================================================================
// 6. APPLICATION BOOTSTRAPPER
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  window.AeroApp = new AppController();
});
