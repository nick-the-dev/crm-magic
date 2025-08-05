// Fixed "Prepare Column Values" node code
// Now we have the combined data from Combine Item Data node
const data = $json;
const task = data.task || {};
const itemId = data.itemId;
const boardId = data.boardId;

console.log('Combined data received:', JSON.stringify(data));
console.log('Task:', JSON.stringify(task));
console.log('Item ID:', itemId);

// Create column values with proper Monday.com format
const columnValues = {};

// Add description to text column if available (using generic 'text' column)
if (task.description) {
  columnValues.text = task.description.substring(0, 255);
  console.log('Added description');
}

// Add priority as status using simple string format (Monday.com accepts string values)
if (task.priority) {
  columnValues.status = task.priority; // Simple string format: "High", "Medium", "Low"
  console.log('Added priority:', task.priority);
}

// Add assignee to a notes/text column since we don't have user IDs
// Using 'notes' column which typically exists on Monday boards
if (task.assignee && typeof task.assignee === 'string') {
  columnValues.notes = `Assigned to: ${task.assignee}`;
  console.log('Added assignee as notes:', task.assignee);
}

// Add estimated hours to numbers column if it exists
if (task.estimatedHours) {
  columnValues.numbers = task.estimatedHours.toString();
  console.log('Added estimated hours:', task.estimatedHours);
}

console.log('Final column values:', JSON.stringify(columnValues));

return [{
  json: {
    boardId: boardId,
    itemId: itemId,
    columnValues: JSON.stringify(columnValues),
    task: task
  }
}];