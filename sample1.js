// Class c1 extends object
class C1 {
    constructor() {
        this._c1_x = undefined;  // field x
        this._c1_y = undefined;  // field y
        this.initialize();
    }
    
    initialize() {
        // doesn't do anything but has to exist
    }
    
    setx1(v) {
        this._c1_x = v;
    }
    
    sety1(v) {
        this._c1_y = v;
    }
    
    getx1() {
        return this._c1_x;
    }
    
    gety1() {
        return this._c1_y;
    }
}

// Class c2 extends c1
class C2 extends C1 {
    constructor() {
        super();
        this._c2_y = undefined;  // field y (shadows c1's y)
    }
    
    sety2(v) {
        this._c2_y = v;
    }
    
    getx2() {
        return this._c1_x;
    }
    
    gety2() {
        return this._c2_y;
    }
}

// Create instance and execute operations
let o2 = new C2();
o2.setx1(101);
o2.sety1(102);
o2.sety2(999);

// Output the list of results
const result = [
    o2.getx1(),   // 101
    o2.gety1(),   // 102
    o2.getx2(),   // 101
    o2.gety2()    // 999
];

console.log(result);
console.log('Result:', result);

// ============================================================
// ANALYSIS: Dynamic vs Static Properties
// ============================================================

console.log("\n=== INHERITANCE PROPERTY ANALYSIS ===\n");

// ============================================================
// 1. STATIC VARIABLE INHERITANCE
// ============================================================
console.log("1. VARIABLE INHERITANCE: STATIC");
console.log("   Evidence:");
console.log("   - gety1() returns c1's y field:", o2.gety1(), "(102)");
console.log("   - gety2() returns c2's y field:", o2.gety2(), "(999)");
console.log("   - c2 has TWO separate y fields (c1's y and c2's y)");
console.log("   - Each method accesses the field defined in its class");
console.log("   → Field references resolved by METHOD LOCATION (static)\n");

// ============================================================
// 2. DYNAMIC METHOD DISPATCH
// ============================================================
console.log("2. METHOD DISPATCH: DYNAMIC");
console.log("   Evidence from Example 2:");
console.log("   - When o3.m3() is called, it executes c1's m1()");
console.log("   - c1's m1() does 'send self m2()'");
console.log("   - Even though we're IN c1's method,");
console.log("   - 'self' refers to the ACTUAL object (o3, a c3 instance)");
console.log("   - So it calls c3's m2() → returns 33");
console.log("   → Method calls resolved by OBJECT TYPE (dynamic)\n");

console.log("=== SUMMARY ===");
console.log("✓ Static Variable Inheritance - fields bound to class");
console.log("✓ Dynamic Method Dispatch - methods bound to object");
