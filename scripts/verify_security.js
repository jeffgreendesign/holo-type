/**
 * Copyright 2026 Holo-Type Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

async function testSecurity() {
  console.log("Testing Security Improvements...");

  // 1. Test Input Length Limit
  console.log("\n1. Testing Input Length Limit (> 500 chars)...");
  const longInput = "A".repeat(501);
  const res1 = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput: longInput }),
  }).catch(e => ({ ok: false, statusText: e.message }));

  if (res1.status === 400) {
    console.log("✅ Corrected blocked long input (400)");
  } else {
    console.log("❌ Failed to block long input. Status:", res1.status);
  }

  // 2. Test Empty Input
  console.log("\n2. Testing Empty Input...");
  const res2 = await fetch("http://localhost:3000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput: "" }),
  }).catch(e => ({ ok: false, statusText: e.message }));

  if (res2.status === 400) {
    console.log("✅ Corrected blocked empty input (400)");
  } else {
    console.log("❌ Failed to block empty input. Status:", res2.status);
  }

  console.log("\nSecurity Verification Script Complete.");
  console.log("Note: Ensure the server is running on localhost:3000 to verify results.");
}

testSecurity();
