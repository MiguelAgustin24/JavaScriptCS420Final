// ========================================
// EXAMPLE 1: Field Shadowing
// ========================================
console.log("=== EXAMPLE 1: Field Shadowing ===\n");

class C1 extends Object {
    constructor() {
        super();
        this.x = undefined;
        this.y = undefined;
        this.initialize();
    }

    initialize() {
        return 1; // doesn't do anything but has to exist
    }

    setx1(v) {
        this.x = v;
    }

    sety1(v) {
        this.y = v;
    }

    getx1() {
        return this.x;
    }

    gety1() {
        return this.y;
    }
}

class C2 extends C1 {
    constructor() {
        super();
        // C2 has its own 'y' field that shadows C1's 'y'
        this.y = undefined;
    }

    sety2(v) {
        this.y = v;
    }

    getx2() {
        return this.x;
    }

    gety2() {
        return this.y;
    }
}

let o2 = new C2();
o2.setx1(101);
o2.sety1(102);
o2.sety2(999);

console.log("Results:");
console.log("getx1():", o2.getx1()); // 101
console.log("gety1():", o2.gety1()); // 102 (C1's y, set by sety1)
console.log("getx2():", o2.getx2()); // 101
console.log("gety2():", o2.gety2()); // 999 (C2's y, set by sety2)
console.log("List:", [o2.getx1(), o2.gety1(), o2.getx2(), o2.gety2()]);

console.log("\n");


// ========================================
// EXAMPLE 2: Super Method Calls
// ========================================
console.log("=== EXAMPLE 2: Super Method Calls ===\n");

class C1_Ex2 extends Object {
    initialize() {
        return 1;
    }

    m1() {
        return this.m2(); // 'this' enables dynamic dispatch
    }

    m2() {
        return 13;
    }
}

class C2_Ex2 extends C1_Ex2 {
    m1() {
        return 22;
    }

    m2() {
        return 23;
    }

    m3() {
        return super.m1(); // calls C1_Ex2's m1
    }
}

class C3_Ex2 extends C2_Ex2 {
    m1() {
        return 32;
    }

    m2() {
        return 33;
    }
}

let o3 = new C3_Ex2();
console.log("o3.m3() result:", o3.m3());
console.log("\nExplanation:");
console.log("- o3.m3() calls super.m1() -> C2's parent is C1");
console.log("- C1.m1() calls this.m2()");
console.log("- 'this' still refers to o3 (instance of C3)");
console.log("- So it calls C3.m2() which returns 33");

console.log("\n");


// ========================================
// EXAMPLE 3: Dynamic Dispatch with Fields
// ========================================
console.log("=== EXAMPLE 3: Dynamic Dispatch with Fields ===\n");

class C1_Ex3 extends Object {
    constructor() {
        super();
        this.x = undefined;
        this.y = undefined;
        this.initialize();
    }

    initialize() {
        this.x = 1;
        this.y = 2;
    }

    get() {
        return this.x;
    }

    m1() {
        return this.get(); // dynamic dispatch
    }
}

class C2_Ex3 extends C1_Ex3 {
    constructor() {
        super();
        // C2 has its own x and y fields (shadowing C1's fields)
        this.x = undefined;
        this.y = undefined;
        this.initialize();
    }

    initialize() {
        super.initialize(); // calls C1's initialize (sets C1's x=1, y=2)
        this.x = 3;         // sets C2's x
        this.y = 4;         // sets C2's y
    }

    get() {
        return this.y;
    }
}

let x = 3; // outer variable (not used)
let o2_ex3 = new C2_Ex3();
console.log("o2.m1() result:", o2_ex3.m1());
console.log("\nExplanation:");
console.log("- o2.m1() calls inherited C1.m1()");
console.log("- C1.m1() calls this.get()");
console.log("- 'this' is o2 (instance of C2), so it calls C2.get()");
console.log("- C2.get() returns this.y, which is 4");

console.log("\n");


// ========================================
// STATIC vs DYNAMIC BINDING DEMONSTRATION
// ========================================
console.log("=== STATIC vs DYNAMIC BINDING ===\n");

console.log("--- Variables (Fields) use STATIC binding ---");
console.log("In most OOP languages, field access is resolved at COMPILE-TIME\n");

// Simulating static field binding (what the pseudocode Example 1 shows)
class Parent_Static {
    constructor() {
        this._parentFields = { x: undefined, y: undefined };
    }

    initialize() {
        return 1;
    }

    setx1(v) {
        this._parentFields.x = v;
    }

    sety1(v) {
        this._parentFields.y = v;
    }

    getx1() {
        return this._parentFields.x;  // Accesses C1's x (static binding)
    }

    gety1() {
        return this._parentFields.y;  // Accesses C1's y (static binding)
    }
}

class Child_Static extends Parent_Static {
    constructor() {
        super();
        this._childFields = { y: undefined };  // Child has its own y field
    }

    sety2(v) {
        this._childFields.y = v;  // Sets C2's y
    }

    getx2() {
        return this._parentFields.x;  // Accesses C1's x
    }

    gety2() {
        return this._childFields.y;  // Accesses C2's y (static binding)
    }
}

let obj_static = new Child_Static();
obj_static.setx1(101);
obj_static.sety1(102);
obj_static.sety2(999);

console.log("With STATIC field binding:");
console.log("getx1():", obj_static.getx1(), "// C1's x field");
console.log("gety1():", obj_static.gety1(), "// C1's y field = 102");
console.log("getx2():", obj_static.getx2(), "// C1's x field");
console.log("gety2():", obj_static.gety2(), "// C2's y field = 999");
console.log("\nResult:", [obj_static.getx1(), obj_static.gety1(), obj_static.getx2(), obj_static.gety2()]);

console.log("\n--- Methods use DYNAMIC binding ---");
console.log("Method calls are resolved at RUN-TIME based on actual object type\n");

class Parent_Dynamic {
    getValue() {
        return "Parent's getValue()";
    }

    display() {
        // 'this' is bound at runtime (dynamic)
        return this.getValue();
    }
}

class Child_Dynamic extends Parent_Dynamic {
    getValue() {
        return "Child's getValue()";
    }
}

let obj_dynamic = new Child_Dynamic();
console.log("obj.display() calls:", obj_dynamic.display());
console.log("Even though display() is defined in Parent,");
console.log("it calls Child's getValue() due to DYNAMIC binding\n");


console.log("=== KEY DIFFERENCES ===\n");
console.log("STATIC BINDING (Variables/Fields):");
console.log("  ✓ Resolved at COMPILE-TIME");
console.log("  ✓ Based on the CLASS that defines the method");
console.log("  ✓ Example: gety1() always accesses C1's y field\n");

console.log("DYNAMIC BINDING (Methods):");
console.log("  ✓ Resolved at RUN-TIME");
console.log("  ✓ Based on the ACTUAL OBJECT TYPE");
console.log("  ✓ Example: this.getValue() calls Child's version\n");

console.log("\n");


// ========================================
// ADDITIONAL DEMONSTRATION
// ========================================
console.log("=== Additional Field Shadowing Demo ===\n");

// To better demonstrate field shadowing in Example 1:
class Parent {
    constructor() {
        this._parentY = undefined; // C1's y field
    }
}

class Child extends Parent {
    constructor() {
        super();
        this._childY = undefined;  // C2's y field
    }
}

// JavaScript doesn't truly support field shadowing like the pseudocode,
// so the above examples simulate the behavior through separate field names
// or by reassigning the same property name (which overwrites, not shadows)

console.log("Note: JavaScript doesn't have true field shadowing like some OOP languages.");
console.log("In Example 1, when C2 declares 'this.y', it overwrites C1's y in the same object.");
console.log("The pseudocode implies separate storage, but JS uses single object property space.");
