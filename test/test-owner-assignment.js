#!/usr/bin/env node

/**
 * Test script for verifying owner assignment in Monday.com workflow
 * Tests the webhook endpoint with a user email to verify owner is properly assigned
 */

const webhookUrl = 'https://automations-n8n.u841sv.easypanel.host/webhook/monday-tasks';

// Test payload with owner assignment
const testPayload = {
  projectDescription: "Test owner assignment functionality - debugging session",
  boardId: "9744010967",
  assigneeEmails: "gluknik+1@gmail.com"  // This email should exist in Monday.com
};

console.log('🧪 Testing Monday.com Workflow - Owner Assignment');
console.log('================================================');
console.log('Webhook URL:', webhookUrl);
console.log('Test Payload:', JSON.stringify(testPayload, null, 2));
console.log('');

async function testWorkflow() {
  try {
    console.log('📤 Sending test request...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('✅ Response received!');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('');
    
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (parseError) {
      console.log('Raw response (not JSON):', responseText);
      console.log('');
      console.log('⚠️ Response was not valid JSON. This might indicate:');
      console.log('1. Workflow execution error');
      console.log('2. Workflow not active');
      console.log('3. Response node not configured correctly');
      return;
    }
    
    if (result.success) {
      console.log('');
      console.log('🎉 SUCCESS! Tasks created in Monday.com');
      console.log('');
      console.log('Next Steps:');
      console.log('1. Check Monday.com board to verify tasks have owners assigned');
      console.log('2. Check n8n execution logs for detailed owner assignment info');
      console.log('3. Look for "✅ Setting owner with ID:" messages in the logs');
    } else {
      console.log('');
      console.log('❌ Workflow returned an error:', result.error || result.message);
    }
    
  } catch (error) {
    console.error('');
    console.error('❌ Error testing workflow:', error.message);
    
    if (error.message.includes('timeout')) {
      console.error('');
      console.error('The workflow timed out. Possible issues:');
      console.error('1. Workflow may be inactive - check n8n');
      console.error('2. AI generation might be slow');
      console.error('3. Monday.com API might be slow');
    }
  }
}

// Run the test
testWorkflow();