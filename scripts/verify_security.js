
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
