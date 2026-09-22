import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPhone, submitLead, validateLead } from "../src/lib/leads";

const valid = {
  name: "Cliente Teste",
  email: "teste@example.com",
  whatsapp: "(21) 99999-9999",
  city: "Rio de Janeiro",
};
test("requires all four contact fields", () =>
  assert.equal(
    Object.keys(validateLead({ name: "", email: "", whatsapp: "", city: "" }))
      .length,
    4,
  ));
test("accepts valid Brazilian contact fields and international prefix", () => {
  assert.deepEqual(validateLead(valid), {});
  assert.deepEqual(
    validateLead({ ...valid, whatsapp: "+55 21 99999-9999" }),
    {},
  );
});
test("rejects single name, invalid mail and landline", () =>
  assert.equal(
    Object.keys(
      validateLead({
        ...valid,
        name: "Teste",
        email: "a@b",
        whatsapp: "2133333333",
      }),
    ).length,
    3,
  ));
test("formats pasted phone with country prefix", () =>
  assert.equal(formatPhone("+55 21 99999-9999"), "(21) 99999-9999"));
test("submission adapter rejects invalid payload", async () => {
  await assert.rejects(
    submitLead({ ...valid, email: "invalid", intent: "test-ride", bikeId: "" }),
  );
});
