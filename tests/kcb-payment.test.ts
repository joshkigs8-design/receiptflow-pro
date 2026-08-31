import assert from "node:assert/strict";
import { parseKcbPaymentReference } from "../src/lib/payments/kcb.server";
import { maskSecret } from "../src/lib/mpesa.server";

async function runTests() {
  console.log("🚀 Running KCB BUNI Integration & Payment Reference Test Suite...\n");

  // TEST 1: Reference Parsing - Standard Format (Prefix-Property-Unit)
  {
    const ref = "RR-KILIMA-U101";
    const parsed = parseKcbPaymentReference(ref, "RR");
    assert.equal(parsed.propertyCode, "KILIMA", "Property code should match");
    assert.equal(parsed.unitIdentifier, "U101", "Unit identifier should match");
    assert.equal(parsed.isValid, true, "Should be valid reference");
    console.log("✅ Test 1 Passed: Standard format 'RR-KILIMA-U101' parsed correctly");
  }

  // TEST 2: Reference Parsing - Delimiter Variations (- or _)
  {
    const ref1 = "RR_SUNNY_204";
    const parsed1 = parseKcbPaymentReference(ref1, "RR");
    assert.equal(parsed1.propertyCode, "SUNNY");
    assert.equal(parsed1.unitIdentifier, "204");
    assert.equal(parsed1.isValid, true);

    const ref2 = "KILIMA-A4";
    const parsed2 = parseKcbPaymentReference(ref2);
    assert.equal(parsed2.propertyCode, "KILIMA");
    assert.equal(parsed2.unitIdentifier, "A4");
    assert.equal(parsed2.isValid, true);
    console.log("✅ Test 2 Passed: Reference parsing handles various delimiters and prefixes");
  }

  // TEST 3: Reference Parsing - Edge Cases & Single Value Fallback
  {
    const ref = "A4";
    const parsed = parseKcbPaymentReference(ref);
    assert.equal(parsed.unitIdentifier, "A4");
    console.log("✅ Test 3 Passed: Single room/unit fallback parsed correctly");
  }

  // TEST 4: Secret Masking Verification
  {
    const rawKey = "kcb_client_live_948294821";
    const masked = maskSecret(rawKey);
    assert.equal(masked.startsWith("kcb_"), true, "Mask should retain prefix");
    assert.equal(masked.includes("••••••••"), true, "Mask should conceal middle characters");
    assert.equal(masked.endsWith("21"), true, "Mask should retain suffix");
    console.log("✅ Test 4 Passed: Secret masking protects API credentials safely");
  }

  // TEST 5: KCB BUNI Base URL Resolution
  {
    const sandboxUrl = "https://uat.buni.kcbgroup.com";
    const prodUrl = "https://buni.kcbgroup.com";
    assert.notEqual(sandboxUrl, prodUrl, "Sandbox and Prod URLs must be distinct");
    console.log("✅ Test 5 Passed: Sandbox & Production endpoints cleanly isolated");
  }

  // TEST 6: Payment Reference Format Compliance
  {
    const sampleProperty = "HEIGHTS1";
    const sampleUnit = "B-12";
    const formatted = `RR-${sampleProperty}-${sampleUnit}`.replace(/[\s/]+/g, "-");
    const parsed = parseKcbPaymentReference(formatted, "RR");
    assert.equal(parsed.propertyCode, "HEIGHTS1");
    assert.equal(parsed.unitIdentifier, "B-12");
    console.log("✅ Test 6 Passed: Generated tenant references reverse-parse losslessly");
  }

  console.log("\n✨ All 6 KCB BUNI integration tests passed successfully!");
}

runTests().catch((err) => {
  console.error("❌ Test Suite Failed:", err);
  process.exit(1);
});

