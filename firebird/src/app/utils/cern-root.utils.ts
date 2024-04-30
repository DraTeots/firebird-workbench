/// Prints geometry structure

import { wildCardCheck } from './wildcard';

export type GeoNodeWalkCallback = (node: any, nodeFullPath: string, level: number) => void;

export function walkGeoNodes(node: any, callback: GeoNodeWalkCallback, maxLevel = 0, level = 0, path = "", pattern?: string) {
  const nodeName = node.fName;
  const volume = node.fVolume;
  const subNodes = volume ? volume.fNodes : null;
  const nodeFullPath = path ? `${path}/${nodeName}` : nodeName;
  let processedNodes = 1;

  // Only invoke the callback if no pattern is provided or if the pattern matches the fullPath
  if (!pattern || wildCardCheck(pattern, nodeFullPath)) {
    callback(node, nodeFullPath, level);
  }

  // Continue recursion to child nodes if they exist and the max level is not reached
  if (volume && subNodes && level < maxLevel) {
    for (let i = 0; i < subNodes.arr.length; i++) {
      const childNode = subNodes.arr[i];
      if (childNode) {
        processedNodes += walkGeoNodes(childNode, callback, maxLevel, level + 1, nodeFullPath, pattern);
      }
    }
  }

  return processedNodes;
}

export function findGeoNodes(node: any, pattern: string): any[] {
  let matchingNodes: {node: any, fullPath: string}[] = [];

  // Define a callback using the GeoNodeWalkCallback type
  const collectNodes: GeoNodeWalkCallback = (node, nodeFullPath, level) => {
    matchingNodes.push({ node, fullPath: nodeFullPath });
  };

  // Use walkGeoNodes with the collecting callback and the pattern
  walkGeoNodes(node, collectNodes, Infinity, 0, "", pattern);

  return matchingNodes;
}

export async function findGeoManager(file: any){
  for (const key of file.fKeys) {
    if(key.fClassName === "TGeoManager") {
      return file.readObject(key.fName);
    }
  }
  return null;
}
