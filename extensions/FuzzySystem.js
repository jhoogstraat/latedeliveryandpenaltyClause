class FuzzySystem {

    constructor(defuzzyMethod) {
        this.defuzzyMethod = defuzzyMethod
        this.inputVariables = {};
        this.outputVariable = [];
        this.rules = [];
    }

    addInput(variable) {
        this.inputVariables[variable.description] = variable
    }

    addOutput(variable) {
        this.outputVariable = variable;
    }

    addRules(rules) {
        this.rules = this.rules.concat(rules);
    }

    computeSystem(values) {
        var outputValues = []
        this.rules.forEach((rule) => { // Iterate through each rule
            var minValue = 1 // Start out at maximum Value for a LinguisticTerm -> AND-OPERATOR chooses least active.
            for (var x in values) { // For every InputVariable Description
                var inputVariable = this.inputVariables[x] // Get the matching InputVariable
                var variableTermRuleDescription = rule.terms[x] // Get the matching rule description for the InputVariable (eg. "niedrig, "mittel", etc.)
                var term = inputVariable.terms[variableTermRuleDescription] // Get the Lingustic Term (function) for the rule description
                minValue = Math.min(minValue, term.func.y(values[x]))// AND-Operator
            }
            outputValues.push(minValue)
        })

        return this.defuzzyMethod(this, outputValues)
    }

    //---------
    // Defuzzyfication Methods //
    //---------

    // Does a poor-mans integral by taking the max value of each rules term description matching in outputValue yValue.
}

class DefuzzyficationMethods {
    static centroidMethod(fuzzySystem, values) {
        var xsZaehler = 0;
        var xsNenner = 0;

        var startValue = fuzzySystem.outputVariable.range.min
        var endValue = fuzzySystem.outputVariable.range.max

        var dx = (endValue - startValue) / 150 // range evenly distributed into 250 wide steps.

        for (var xValue = startValue; xValue <= endValue; xValue += dx) { // Poor-mans Integral (but precision can be adjusted for the cost of compute time)

            var maxValue = 0; //Start out with minimum value -> OR-Operator chooses maximum value
            for (var x in fuzzySystem.rules) { // Iterate through each rule (again)
                var calculatedY = fuzzySystem.outputVariable.terms[fuzzySystem.rules[x].resultTerm].func.y(xValue)
                maxValue = Math.max(maxValue, Math.min(values[x], calculatedY)) // We want the maximum of all output term values (for each rule). Each OutputTerm has a function, but is capped at the maximum value of the inference (min-operator here).
            }

            xsZaehler += xValue * maxValue
            xsNenner += maxValue
        }

        console.log("Schwerpunkt für " + fuzzySystem.outputVariable.description + ": " + xsZaehler / xsNenner)
        return xsZaehler / xsNenner
    }
}

class LinguisticVariable {
    constructor(description, range, terms) {
        this.description = description
        this.range = range
        this.terms = {}
        terms.forEach((term) => {
            this.terms[term.description] = term
        })
    }
}

class LinguisticTerm {
    constructor(description, func) {
        this.description = description
        this.func = func
    }
}

class FuzzyRule {
    constructor(terms, resultTerm) {
        this.terms = terms
        this.resultTerm = resultTerm
    }
}

class Range {
    constructor(min, max) {
        this.min = min
        this.max = max
    }
}

class Triangular {
    constructor(array) {
        this.left = array[0]
        this.top = array[1]
        this.right = array[2]
        this.risingSlope = 1 / (this.top - this.left)
        this.fallingSlope = 1 / (this.top - this.right)
    }

    y(xValue) {
        if (xValue <= this.top && this.top - this.left > 0) {
            return Math.max(0, this.risingSlope * xValue + -this.risingSlope * this.left)
        } else {
            return Math.max(0, this.fallingSlope * xValue + -this.fallingSlope * this.right)
        }
    }
}

class Trapezoidal {
    constructor(array) {
        this.left = array[0]
        this.topLeft = array[1]
        this.topRight = array[2]
        this.right = array[3]

        this.risingSlope = 1 / (this.topLeft - this.left)
        this.fallingSlope = 1 / (this.topRight - this.right)
    }

    y(xValue) {
        if (xValue < this.topLeft) {
            if (this.left == this.topLeft) return 0
            return Math.max(0, this.risingSlope * xValue + -this.risingSlope * this.left)
        } else if (xValue <= this.topRight) {
            return 1
        } else {
            if (this.topRight == this.right) return 0
            return Math.max(0, this.fallingSlope * xValue + -this.fallingSlope * this.right)
        }
    }
}


var fuzzySystem = new FuzzySystem(DefuzzyficationMethods.centroidMethod);

fuzzySystem.addInput(
    new LinguisticVariable("Umschlagszahl", new Range(0, 12), [
        new LinguisticTerm("niedrig", new Triangular([0, 0, 6])),
        new LinguisticTerm("mittel", new Trapezoidal([0, 5.5, 6.5, 12])),
        new LinguisticTerm("hoch", new Triangular([6, 12, 12]))
    ])
)

fuzzySystem.addInput(
    new LinguisticVariable("Schiffsgroesse", new Range(5, 18), [
        new LinguisticTerm("niedrig", new Triangular([5, 5, 11])),
        new LinguisticTerm("mittel", new Trapezoidal([5, 10, 12, 18])),
        new LinguisticTerm("hoch", new Triangular([11, 18, 18]))
    ])
)

fuzzySystem.addInput(
    new LinguisticVariable("Defektschwere", new Range(0, 10), [
        new LinguisticTerm("niedrig", new Triangular([0, 0, 5])),
        new LinguisticTerm("mittel", new Triangular([0, 5, 10])),
        new LinguisticTerm("hoch", new Triangular([5, 10, 10]))
    ])
)

fuzzySystem.addOutput(
    new LinguisticVariable("Lieferverlängerung", new Range(0, 30), [
        new LinguisticTerm("niedrig", new Triangular([0, 0, 15])),
        new LinguisticTerm("mittel", new Triangular([0, 15, 30])),
        new LinguisticTerm("hoch", new Triangular([15, 30, 30]))
    ])
)

fuzzySystem.addRules(
    [
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "niedrig", Schiffsgroesse: "niedrig" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "niedrig", Schiffsgroesse: "mittel" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "niedrig", Schiffsgroesse: "hoch" }, "hoch"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "mittel", Schiffsgroesse: "niedrig" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "mittel", Schiffsgroesse: "mittel" }, "hoch"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "mittel", Schiffsgroesse: "hoch" }, "hoch"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "hoch", Schiffsgroesse: "niedrig" }, "hoch"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "hoch", Schiffsgroesse: "mittel" }, "hoch"),
        new FuzzyRule({ Umschlagszahl: "niedrig", Defektschwere: "hoch", Schiffsgroesse: "hoch" }, "hoch"),

        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "niedrig", Schiffsgroesse: "niedrig" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "niedrig", Schiffsgroesse: "mittel" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "niedrig", Schiffsgroesse: "hoch" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "mittel", Schiffsgroesse: "niedrig" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "mittel", Schiffsgroesse: "mittel" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "mittel", Schiffsgroesse: "hoch" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "hoch", Schiffsgroesse: "niedrig" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "hoch", Schiffsgroesse: "mittel" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "mittel", Defektschwere: "hoch", Schiffsgroesse: "hoch" }, "hoch"),

        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "niedrig", Schiffsgroesse: "niedrig" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "niedrig", Schiffsgroesse: "mittel" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "niedrig", Schiffsgroesse: "hoch" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "mittel", Schiffsgroesse: "niedrig" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "mittel", Schiffsgroesse: "mittel" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "mittel", Schiffsgroesse: "hoch" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "hoch", Schiffsgroesse: "niedrig" }, "niedrig"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "hoch", Schiffsgroesse: "mittel" }, "mittel"),
        new FuzzyRule({ Umschlagszahl: "hoch", Defektschwere: "hoch", Schiffsgroesse: "hoch" }, "mittel"),
    ]
)

// // Hafen 1
// console.log("\nHafen 1")
// fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 6.3, Umschlagszahl: 8.9 }) // Yilmaz: 11.9995 || Matlab: 13.3430
// fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 6.3, Umschlagszahl: 8.9 }) // Yilmaz: 11.9995 || Matlab: 13.3430
// fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 15.5, Umschlagszahl: 8.9 }) // Yilmaz: 15.8475 || Matlab: 15.9119
// fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 15.5, Umschlagszahl: 8.9 }) // Yilmaz: 12.3015 || Matlab: 13.6848

// // Hafen 2
// console.log("\nHafen 2")
// fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 6.3, Umschlagszahl: 1.95 }) // Yilmaz: 19.2855 || Matlab: 17.7247
// fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 6.3, Umschlagszahl: 1.95 }) // Yilmaz: 15.3315 || Matlab: 15.2017
// fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 15.5, Umschlagszahl: 1.95 }) // Yilmaz: 19.5830 || Matlab: 17.9913
// fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 15.5, Umschlagszahl: 1.95 }) // Yilmaz: 19.7550 || Matlab: 18.1842

var results = [];
results.push(fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 6.3, Umschlagszahl: 8.9 }) - 13.1330) // Yilmaz: 11.9995 || Matlab: 13.3430
// results.push(fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 6.3, Umschlagszahl: 8.9 }) - 13.3430) // Yilmaz: 11.9995 || Matlab: 13.3430
// results.push(fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 15.5, Umschlagszahl: 8.9 }) - 15.9119)// Yilmaz: 15.8475 || Matlab: 15.9119
// results.push(fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 15.5, Umschlagszahl: 8.9 }) - 13.6848)// Yilmaz: 12.3015 || Matlab: 13.6848

// // Hafen 2
// console.log("\nHafen 2")
// results.push(fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 6.3, Umschlagszahl: 1.95 }) - 17.7247)// Yilmaz: 19.2855 || Matlab: 17.7247
// results.push(fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 6.3, Umschlagszahl: 1.95 }) - 15.2017)// Yilmaz: 15.3315 || Matlab: 15.2017
// results.push(fuzzySystem.computeSystem({ Defektschwere: 8, Schiffsgroesse: 15.5, Umschlagszahl: 1.95 }) - 17.9913)// Yilmaz: 19.5830 || Matlab: 17.9913
// results.push(fuzzySystem.computeSystem({ Defektschwere: 4, Schiffsgroesse: 15.5, Umschlagszahl: 1.95 }) - 18.1842)// Yilmaz: 19.7550 || Matlab: 18.1842

// var sum = 0
// results.forEach((result) => sum += Math.abs(result))
// console.log(sum / 8);