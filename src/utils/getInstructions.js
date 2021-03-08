/* eslint-disable */
const stationsGraph = require('../assets/js/stationsGraph.json')
const stationsGraphWeighted = require('../assets/js/stationsGraphWeighted.json')

const distances = new Array(150)
const parents = new Array(150)
const visited = new Array(150)

const getMessages = (startStation, endStation, graph) => {
  let mensagens = []
  const path = []
  let parent = graph[endStation].id

  while (parent !== graph[startStation].id) {
    path.unshift(graph[parent])
    parent = parents[parent]
  }
  path.unshift(graph[parent])

  mensagens.push(`Embarque em ${path[0].stationName} sentido à estação ${path[1].stationName}`)
  for (let i = 1; i < path.length - 1; i += 1) {
    if (path[i].lineName === 'Estação de Integração') {
      mensagens.push(`Na estação ${path[i].stationName} siga sentido à estação ${path[i + 1].stationName}`)
    }
  }
  mensagens.push(`Desembarque em ${path[path.length - 1].stationName}`)

  return mensagens
}

const BFS = (startStation, endStation) => {
  const queue = []

  queue.push(stationsGraph[startStation])
  distances.fill('Infinity')
  parents.fill(-1)
  visited.fill(false)

  visited[startStation] = true
  distances[startStation] = 0

  while (queue.length > 0) {
    const currentNode = queue[0]
    queue.shift()

    if (currentNode.id === endStation) {
      return true
    }

    currentNode.neighboringStations.forEach((neigh) => {
      if (visited[neigh] === false) {
        distances[neigh] = distances[currentNode.id] + 1
        parents[neigh] = currentNode.id

        visited[neigh] = true
        queue.push(stationsGraph[neigh])
      }
    })
  }

  return false
}

const dijkstra = (startStation, endStation) => {
  const queue = []

  queue.push(stationsGraphWeighted[startStation])

  distances.fill('Infinity')
  parents.fill(-1)
  visited.fill(false)

  visited[startStation] = true
  distances[startStation] = 0

  while (queue.length > 0) {
    const currentNode = queue[0]
    queue.shift()

    if (currentNode.id === endStation) {
      return true
    }

    currentNode.neighboringStations.forEach((neigh) => {
      if (visited[neigh.node] === false) {
        distances[neigh.node] = distances[currentNode.id] + neigh.weight
        parents[neigh.node] = currentNode.id

        visited[neigh.node] = true
        queue.push(stationsGraphWeighted[neigh.node])
      }
    })
  }

  return false
}

export const getInstructions = (startStation, endStation, isDijkstra) => {
  const bfs = isDijkstra ? dijkstra(startStation, endStation) : BFS(startStation, endStation)

  if (!bfs) {
    return ['Rota não encontrada']
  }

  return getMessages(startStation, endStation, isDijkstra ? stationsGraphWeighted : stationsGraph)
}