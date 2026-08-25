/**
 * FILESYSTEM GRAPH ENGINE — builds an Obsidian-style knowledge graph
 * from the vault's directory structure.
 * 
 * Automatically discovers folders and markdown files, creating:
 * - Root node (e.g., "Artificial Intelligence")
 * - Folder nodes for each directory
 * - Note nodes for each .md file
 * 
 * Edges are created for:
 * - Structural relationships (parent → child)
 * - Wikilinks between notes ([[Note Name]])
 */

import type { FileSystemGraphData, FileSystemGraphNode, FileSystemGraphEdge } from "./types";

const VAULT_PATH = "/src/content/vault/";
const ROOT_DISPLAY_NAME = "Artificial Intelligence";

/**
 * Normalize a folder/file name for display
 * Fixes common typos while preserving filesystem path
 */
function normalizeDisplayLabel(name: string): string {
  // Fix common typos in display only
  let label = name;
  
  // Fix "ArtificiaL Intillegence" → "Artificial Intelligence"
  if (label.toLowerCase().includes("artificial") || label.toLowerCase().includes("intillegence")) {
    label = label.replace(/ArtificiaL\s+Intillegence/i, "Artificial Intelligence");
    label = label.replace(/ArtificiaL/i, "Artificial");
    label = label.replace(/Intillegence/i, "Intelligence");
  }
  
  // Fix "Proablity & Stat" → "Probability & Statistics"
  if (label.toLowerCase().includes("proablity")) {
    label = label.replace(/Proablity\s*&\s*Stat/i, "Probability & Statistics");
    label = label.replace(/Proablity/i, "Probability");
  }
  
  return label;
}

/**
 * Extract wikilinks from markdown content
 * Supports: [[Note]], [[Note|Alias]], [[Note#Heading]]
 */
function extractWikilinks(content: string): string[] {
  const links: string[] = [];
  const wikilinkRegex = /\[\[([^\]|#\n]+?)(?:#[^\]|\n]*)?(?:\|([^\]\n]+))?\]\]/g;
  let match: RegExpExecArray | null;
  
  while ((match = wikilinkRegex.exec(content)) !== null) {
    const target = match[1].trim();
    if (target && !links.includes(target)) {
      links.push(target);
    }
  }
  
  return links;
}

/**
 * Build the filesystem-based graph data
 */
export function buildFileSystemGraph(): FileSystemGraphData {
  const modules = import.meta.glob("/src/content/vault/**/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;

  const nodes: Map<string, FileSystemGraphNode> = new Map();
  const edges: FileSystemGraphEdge[] = [];
  const notePaths: Map<string, string> = new Map(); // label → full path for link resolution
  
  // Find the root folder name (first level under vault)
  let rootFolderName = "";
  const allPaths = Object.keys(modules);
  
  if (allPaths.length > 0) {
    // Extract the first folder name after VAULT_PATH
    const firstPath = allPaths[0];
    const relativePath = firstPath.startsWith(VAULT_PATH) 
      ? firstPath.slice(VAULT_PATH.length) 
      : firstPath;
    const segments = relativePath.split("/");
    rootFolderName = segments[0] || "";
  }
  
  // Create root node
  const rootId = "root";
  const rootLabel = normalizeDisplayLabel(rootFolderName) || ROOT_DISPLAY_NAME;
  
  nodes.set(rootId, {
    id: rootId,
    label: rootLabel,
    type: "root",
    path: VAULT_PATH + rootFolderName,
    metadata: { displayName: rootLabel },
  });
  
  // Track folders we've already created
  const folderIds: Map<string, string> = new Map(); // path → id
  
  // Process all files and folders
  for (const [filePath, rawContent] of Object.entries(modules)) {
    const relativePath = filePath.startsWith(VAULT_PATH) 
      ? filePath.slice(VAULT_PATH.length) 
      : filePath;
    
    const segments = relativePath.split("/");
    const fileName = segments[segments.length - 1];
    const fileBase = fileName.replace(/\.md$/i, "");
    
    // Skip README files
    if (/^readme$/i.test(fileBase)) continue;
    
    // Create folder nodes for all parent directories
    let currentParentId = rootId;
    let currentPath = rootFolderName;
    
    for (let i = 1; i < segments.length - 1; i++) {
      const folderName = segments[i];
      const folderPath = segments.slice(0, i + 1).join("/");
      const folderId = `folder:${folderPath}`;
      
      if (!nodes.has(folderId)) {
        const displayLabel = normalizeDisplayLabel(folderName);
        nodes.set(folderId, {
          id: folderId,
          label: displayLabel,
          type: "folder",
          path: VAULT_PATH + folderPath,
          parentId: currentParentId,
          metadata: { depth: i },
        });
        
        // Add structural edge from parent to this folder
        edges.push({
          source: currentParentId,
          target: folderId,
          type: "structure",
        });
      }
      
      folderIds.set(folderPath, folderId);
      currentParentId = folderId;
      currentPath = folderPath;
    }
    
    // Create note node for the markdown file
    const noteId = `note:${relativePath}`;
    const noteLabel = fileBase;
    
    nodes.set(noteId, {
      id: noteId,
      label: noteLabel,
      type: "note",
      path: filePath,
      parentId: currentParentId,
      metadata: { 
        title: fileBase,
        category: segments[0],
      },
    });
    
    // Add structural edge from parent folder to note
    edges.push({
      source: currentParentId,
      target: noteId,
      type: "structure",
    });
    
    // Store for link resolution
    notePaths.set(noteLabel.toLowerCase(), noteId);
    
    // Also store with normalized name (without special chars)
    const normalizedLabel = noteLabel.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    if (normalizedLabel !== noteLabel.toLowerCase()) {
      notePaths.set(normalizedLabel, noteId);
    }
  }
  
  // Now parse files for wikilinks and create link edges
  for (const [filePath, rawContent] of Object.entries(modules)) {
    const relativePath = filePath.startsWith(VAULT_PATH) 
      ? filePath.slice(VAULT_PATH.length) 
      : filePath;
    
    const segments = relativePath.split("/");
    const fileName = segments[segments.length - 1];
    const fileBase = fileName.replace(/\.md$/i, "");
    
    if (/^readme$/i.test(fileBase)) continue;
    
    const sourceNoteId = `note:${relativePath}`;
    
    // Extract wikilinks from content
    const wikilinks = extractWikilinks(rawContent);
    
    for (const link of wikilinks) {
      const normalizedLink = link.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
      const targetNoteId = notePaths.get(link.toLowerCase()) || notePaths.get(normalizedLink);
      
      if (targetNoteId && targetNoteId !== sourceNoteId) {
        edges.push({
          source: sourceNoteId,
          target: targetNoteId,
          type: "link",
        });
      }
    }
  }
  
  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
}

/**
 * Get a filtered view of the graph centered around a specific node
 */
export function getFileSystemNeighborhood(
  graph: FileSystemGraphData,
  centerId: string,
  depth: number = 1
): FileSystemGraphData {
  const visited = new Set<string>();
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
  
  // BFS to find nodes within depth
  const queue: Array<{ id: string; d: number }> = [{ id: centerId, d: 0 }];
  visited.add(centerId);
  
  while (queue.length > 0) {
    const { id, d } = queue.shift()!;
    
    if (d >= depth) continue;
    
    // Find all connected nodes
    for (const edge of graph.edges) {
      let neighborId: string | undefined;
      if (edge.source === id) {
        neighborId = edge.target;
      } else if (edge.target === id) {
        neighborId = edge.source;
      }
      
      if (neighborId && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({ id: neighborId, d: d + 1 });
      }
    }
  }
  
  // Filter nodes and edges
  const filteredNodes = graph.nodes.filter(n => visited.has(n.id));
  const filteredEdges = graph.edges.filter(
    e => visited.has(e.source) && visited.has(e.target)
  );
  
  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

/**
 * Convert filesystem graph to the legacy GraphData format for compatibility
 */
export function convertToLegacyGraph(
  fsGraph: FileSystemGraphData
): { nodes: any[]; edges: any[] } {
  // For now, return empty - the UI should use the new format
  // This is a placeholder for backward compatibility if needed
  return { nodes: [], edges: [] };
}
