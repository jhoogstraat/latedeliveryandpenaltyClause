class LinguisticVariable {
  constructor(description, range, terms) {
    this.description = description;
    this.range = range;
    this.terms = {};
    terms.forEach(term => {
      this.terms[term.description] = term;
    });
  }
}

class LinguisticTerm {
  constructor(description, func) {
    this.description = description;
    this.func = func;
  }
}

class FuzzyRule {
  constructor(terms, resultTerm) {
    this.terms = terms;
    this.resultTerm = resultTerm;
  }
}

class Range {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }
}

class FuzzyLogic {
  constructor(defuzzyMethod) {
    this.defuzzyMethod = defuzzyMethod;
    this.inputVariables = {};
    this.outputVariable = [];
    this.rules = [];
  }

  addInput(variable) {
    this.inputVariables[variable.description] = variable;
  }

  addOutput(variable) {
    this.outputVariable = variable;
  }

  addRules(rules) {
    this.rules = this.rules.concat(rules);
  }

  computeSystem(values) {
    var outputValues = [];
    this.rules.forEach(rule => {
      // Iterate through each rule
      var minValue = 1; // Start out at maximum Value for a LinguisticTerm -> AND-OPERATOR chooses least active.
      for (var x in values) {
        // For every InputVariable Description
        var inputVariable = this.inputVariables[x]; // Get the matching InputVariable
        var variableTermRuleDescription = rule.terms[x]; // Get the matching rule description for the InputVariable (eg. "niedrig, "mittel", etc.)
        var term = inputVariable.terms[variableTermRuleDescription]; // Get the Lingustic Term (function) for the rule description
        minValue = Math.min(minValue, term.func.y(values[x])); // AND-Operator
      }
      outputValues.push(minValue);
    });
    return this.defuzzyMethod(this.outputValue, this.rules, outputValues);
  }
}

class DefuzzyficationMethods {
  static centroidMethod(outputVariable, rules, values) {
    var xsZaehler = 0,
      xsNenner = 0;
    var startValue = outputVariable.range.min;
    var endValue = outputVariable.range.max;
    var dx = 0.5; // Delta X

    for (var xValue = startValue; xValue <= endValue; xValue += dx) {
      var maxValue = 0; //Start out with minimum value -> OR-Operator chooses maximum value
      for (var x in rules) {
        // Iterate through each rule (again)
        var calculatedY = outputVariable.terms[rules[x].resultTerm].func.y(
          xValue
        );
        maxValue = Math.max(maxValue, Math.min(values[x], calculatedY)); // We want the maximum of all output term values (for each rule). Each OutputTerm has a function that is capped at the maximum value of the previous min-operation.
      }
      xsZaehler += xValue * maxValue;
      xsNenner += maxValue;
    }
    return xsZaehler / xsNenner;
  }
}

class Schema {
  y(xValue) {
    throw new Error("Not implemented");
  }
}

class Triangular extends Schema {
  constructor(array) {
    this.left = array[0];
    this.top = array[1];
    this.right = array[2];
    this.risingSlope = 1 / (this.top - this.left);
    this.fallingSlope = 1 / (this.top - this.right);
  }

  y(xValue) {
    // classic y = f(x)
    if (xValue <= this.top && this.top - this.left > 0) {
      return Math.max(
        0,
        this.risingSlope * xValue + -this.risingSlope * this.left
      );
    } else {
      return Math.max(
        0,
        this.fallingSlope * xValue + -this.fallingSlope * this.right
      );
    }
  }
}

class Trapezoidal extends Schema {
  constructor(array) {
    this.left = array[0];
    this.topLeft = array[1];
    this.topRight = array[2];
    this.right = array[3];

    this.risingSlope = 1 / (this.topLeft - this.left);
    this.fallingSlope = 1 / (this.topRight - this.right);
  }

  y(xValue) {
    // classic y = f(x)
    if (xValue < this.topLeft) {
      if (this.left == this.topLeft) return 0;
      return Math.max(
        0,
        this.risingSlope * xValue + -this.risingSlope * this.left
      );
    } else if (xValue <= this.topRight) {
      return 1;
    } else {
      if (this.topRight == this.right) return 0;
      return Math.max(
        0,
        this.fallingSlope * xValue + -this.fallingSlope * this.right
      );
    }
  }
}
