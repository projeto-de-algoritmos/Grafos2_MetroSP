const fs = require('fs')

const stationsGraph = require('../assets/js/stationsGraph.json')

const edges = new Array()
const unionFind = new Object()

const loadEdges = () => {
  const ids = Object.keys(stationsGraph);
  for (let id of ids) {
    for (let neighboringStation of stationsGraph[id].neighboringStations) {
      let edge = [parseInt(id), parseInt(neighboringStation)]
      edge.sort((a, b) => a - b)
      if (edges.find(e => e[0] === edge[0] && e[1] === edge[1]) === undefined) {
        edges.push(edge)
      }
    }
  }
}

const loadUnionFind = () => {
  const ids = Object.keys(stationsGraph);
  for (let id of ids) {
    unionFind[id] = { size: 1, parent: id }
  }
}

const find = (node) => {
  let presentNode = node;
  while (presentNode !== unionFind[presentNode].parent) {
    presentNode = unionFind[presentNode].parent;
  }
  return presentNode
}

const union = (nodeOne, nodeTwo) => {
  nodeOneRoot = find(nodeOne)
  nodeTwoRoot = find(nodeTwo)
  if (nodeOne.size < nodeTwo.size) {
    unionFind[nodeOneRoot].parent = nodeTwoRoot
  }
  else if (nodeOne.size > nodeTwo.size) {
    unionFind[nodeTwoRoot].parent = nodeOneRoot
  }
  else {
    unionFind[nodeTwoRoot].parent = nodeOneRoot
    unionFind[nodeOneRoot].size++;
  }
}

const kruskal = () => {
  loadEdges()
  loadUnionFind()

  const mstEdges = new Array();

  while (edges.length > 0) {
    const edge = edges.shift()
    if (find(edge[0]) !== find(edge[1])) {
      mstEdges.push(edge)
      union(edge[0], edge[1])
    }
  }

  let mst = new Object();
  mst[mstEdges[0][0]] = stationsGraph[mstEdges[0][0]]
  for (let edge of mstEdges) {
    mst[edge[1]] = {
      ...stationsGraph[edge[1]], neighboringStations: []
    }
  }

  fs.writeFile(
    './src/assets/js/mst.json',
    JSON.stringify(mst),
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('Erro ao escrever JSON', err)
      } else {
        // eslint-disable-next-line no-console
        console.log('JSON escrito com sucesso')
      }
    }
  )
}

kruskal();