import {expect, test,} from "vitest";
import {add} from "../index.ts";

test("add ", async () => {
    const result = add(3, 3)
    expect(result).toBe(6);
});
