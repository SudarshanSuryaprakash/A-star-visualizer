import React, { useState, useEffect } from 'react'

import './pathfind.css'
import Node from '../node/Node'
import astar from '../../A-star/astar'


const cols = 30
const rows = 16

const NODE_START_ROW = 0
const NODE_END_ROW = rows - 1
const NODE_START_COLUMN = 0
const NODE_END_COLUMN = cols - 1

const Pathfind = () => {
    const [Grid, setGrid] = useState([])
    const [Path, setPath] = useState([])
    const [VisitedNodes, setVisitedNodes] = useState([])
    const [error, setError] = useState(false)


    useEffect(() => {
        initializeGrid()
    }, [])


    //creates grid
    const initializeGrid = () => {
        const grid = new Array(rows);

        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols)
        }
        createSpots(grid)
        setGrid(grid)
        addNeighbors(grid)

        const startNode = grid[NODE_START_ROW][NODE_START_COLUMN]
        const endNode = grid[NODE_END_ROW][NODE_END_COLUMN]
        const path = astar(startNode, endNode)
        startNode.isWall = false
        endNode.isWall = false
        setPath(path.path)
        setVisitedNodes(path.visitedNodes)
        if(path.error) setError(true)
    }

    //creates spots
    const createSpots = (grid) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = new Spot(i, j)
            }
        }
    }

    //The spot constructor

    class Spot {
        constructor(i, j) {
            this.x = i
            this.y = j
            this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COLUMN
            this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COLUMN
            this.g = 0
            this.f = 0
            this.h = 0
            this.isWall = false
            if(Math.random(1) < 0.2){
                this.isWall = true
            }

            this.neighbors = []
            this.previous = undefined;
            this.addNeighbors = (grid) => {
                let i = this.x
                let j = this.y
                if(i > 0) this.neighbors.push(grid[i-1][j])
                if(i < rows - 1) this.neighbors.push(grid[i+1][j])
                if(j > 0) this.neighbors.push(grid[i][j - 1])
                if(j < cols - 1) this.neighbors.push(grid[i][j + 1])
            }
        }
    }

    //Add neighbors
    const addNeighbors = (grid) => {
        for(let i = 0; i< rows; i++){
            for(let j=0; j< cols; j++){
                grid[i][j].addNeighbors(grid)
            }
        }
    }

    //grid with nodes
    const gridWithNodes = () => {
        return (
            <div>
                {Grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx} className='rowWrapper'>
                            {row.map((col, colIdx) => {
                                const { isStart, isEnd, isWall } = col
                                return <Node key={colIdx} isStart={isStart} isEnd={isEnd} row={rowIdx} col={colIdx} isWall = {isWall} />
                            })}
                        </div>
                    )
                })}
            </div>
        )

    }

    const visualizeShortestPath = (shortestPathNodes) => {
        for(let i = 0; i < shortestPathNodes.length; i++){
            setTimeout(() => {
                const node = shortestPathNodes[i]
                document.getElementById(`node-${node.x}-${node.y}`).className = 'node node-shortest-path'
            }, 10 * i)
        }
    }

    const visualizePath = () => {
        for(let i = 0; i <= VisitedNodes.length; i++){
            if(i === VisitedNodes.length){
                setTimeout(() => {
                    visualizeShortestPath(Path)
                }, 20 * i)
            } else {
                setTimeout(() => {
                    const node = VisitedNodes[i]
                document.getElementById(`node-${node.x}-${node.y}`).className = 'node node-visited'
                }, 20 * i)
                
            
            }
        }
    }
    return (
        <div className='wrapper'>
        <button className = 'btn' onClick = {visualizePath}>Click to Visualize Path - A* Algorithm</button>
        <h4>Sudarshan Suryaprakash</h4>
        {error ? <h1>Can't find a path!</h1> : null}
            {gridWithNodes()}
        </div>
    )
}

export default Pathfind