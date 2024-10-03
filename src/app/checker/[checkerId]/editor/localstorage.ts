// Define an interface for the editor entry
interface EditorEntry {
  text: string;
  lastReadDate: string;
}

const MAX_DOCS_TO_KEEP = 30;

const getCheckerDocMap = () => {
  // Retrieve the existing map from localStorage or initialize an empty object
  const rawCheckerDocMap = localStorage.getItem("checkerDocMap");
  const checkerDocMap: Record<string, EditorEntry> = rawCheckerDocMap
    ? JSON.parse(rawCheckerDocMap)
    : {};
  return checkerDocMap;
};

export function saveEditorText(checkerId: string, doc: string) {
  // Retrieve the existing map from localStorage or initialize an empty object
  const checkerDocMap = getCheckerDocMap();

  // Save the new state along with the current timestamp
  const currentDate = new Date().toISOString();
  checkerDocMap[checkerId] = {
    text: doc,
    lastReadDate: currentDate,
  };

  // Evict the oldest entry if the map has too many elements
  if (Object.keys(checkerDocMap).length > MAX_DOCS_TO_KEEP) {
    let oldestCheckerId = null;
    let oldestDate = new Date();

    // Iterate through the map to find the oldest entry
    for (const key in checkerDocMap) {
      const entryDate = new Date(checkerDocMap[key]!.lastReadDate);
      if (entryDate < oldestDate) {
        oldestDate = entryDate;
        oldestCheckerId = key;
      }
    }

    // Remove the oldest entry
    if (oldestCheckerId) {
      delete checkerDocMap[oldestCheckerId];
    }
  }

  // Save the updated map back to localStorage
  localStorage.setItem("checkerDocMap", JSON.stringify(checkerDocMap));
}

export function readEditorText(checkerId: string) {
  const checkerDocMap = getCheckerDocMap();

  // If the checkerId exists, update its lastReadDate and return the text
  if (checkerDocMap[checkerId]) {
    const currentDate = new Date().toISOString();
    checkerDocMap[checkerId].lastReadDate = currentDate;

    // Save the updated map back to localStorage
    localStorage.setItem("checkerDocMap", JSON.stringify(checkerDocMap));

    // Return the editor text
    return checkerDocMap[checkerId].text;
  }

  // Return null if the entry is not found
  return null;
}
