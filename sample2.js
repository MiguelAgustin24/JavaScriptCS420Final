// ============================================================
// EXAMPLE 1: Method calls with super and self
// ============================================================

class C1_Ex1 {
    initialize() {
        return 1;
    }
    
    m1() {
        return this.m2();  // send self m2()
    }
    
    m2() {
        return 13;
    }
}

class C2_Ex1 extends C1_Ex1 {
    m1() {
        return 22;
    }
    
    m2() {
        return 23;
    }
    
    m3() {
        return super.m1();  // super m1()
    }
}

class C3_Ex1 extends C2_Ex1 {
    m1() {
        return 32;
    }
    
    m2() {
        return 33;
    }
}

// Test Example 1
let o3 = new C3_Ex1();
console.log("Example 1 Result:", o3.m3());
// o3.m3() -> calls super.m1() (C1's m1) -> calls this.m2() -> C3's m2() -> 33


// ============================================================
// EXAMPLE 2: Field shadowing with get methods
// ============================================================

class C1_Ex2 {
    constructor() {
        this._c1_x = undefined;
        this._c1_y = undefined;
        this.initialize();
    }
    
    initialize() {
        this._c1_x = 1;
        this._c1_y = 2;
    }
    
    get() {
        return this._c1_x;
    }
    
    m1() {
        return this.get();  // send self get()
    }
}

class C2_Ex2 extends C1_Ex2 {
    constructor() {
        super();
        this._c2_x = undefined;
        this._c2_y = undefined;
        this.initialize();
    }
    
    initialize() {
        super.initialize();
        this._c2_x = 3;
        this._c2_y = 4;
    }
    
    get() {
        return this._c2_y;
    }
}

// Test Example 2
let x = 3;
let o2 = new C2_Ex2();
console.log("Example 2 Result:", o2.m1());
// o2.m1() -> calls this.get() -> C2's get() -> returns y (4)


// ============================================================
// Summary of all results
// ============================================================
console.log("\n--- Summary ---");
console.log("Example 1 (o3.m3()):", o3.m3());
console.log("Example 2 (o2.m1()):", o2.m1());

// ============================================================
// DETAILED ANALYSIS
// ============================================================

console.log("\n=== PROPERTY ANALYSIS ===\n");

// DYNAMIC METHOD DISPATCH - Example 1
console.log("📌 DYNAMIC METHOD DISPATCH - Example 1:");
console.log("   Trace: o3.m3()");
console.log("   1. o3.m3() calls super.m1() → c1's m1()");
console.log("   2. c1's m1() executes 'send self m2()'");
console.log("   3. 'self' = o3 (the actual object, type c3)");
console.log("   4. Calls c3's m2() → returns 33");
console.log("   → If static: would call c1's m2() → 13");
console.log("   → Result: 33 (DYNAMIC - uses object type)\n");

// STATIC VARIABLE INHERITANCE - Example 2  
console.log("📌 STATIC VARIABLE INHERITANCE - Example 2:");
console.log("   Trace: o2.m1()");
console.log("   1. o2.m1() calls 'send self get()' → c2's get()");
console.log("   2. c2's get() returns 'y'");
console.log("   3. Which 'y'? c2's y field (not c1's y)");
console.log("   4. Returns 4 (c2's y), not 2 (c1's y)");
console.log("   → c1's get() would return c1's x");
console.log("   → c2's get() returns c2's y");
console.log("   → Field binding based on WHERE method defined (STATIC)\n");

console.log("=== CONCLUSION ===");
console.log("✓ Method Dispatch: DYNAMIC (resolved by object type)");
console.log("✓ Variable Inheritance: STATIC (resolved by method location)");
