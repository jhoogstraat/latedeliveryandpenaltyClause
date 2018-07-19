'use strict';

import { FuzzySystem } from 'FuzzySystem'

/**
* Execute the smart clause
* @param {Context} context - the Accord context
* @param {org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyRequest} context.request - the incoming request
* @param {org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyResponse} context.response - the response
* @AccordClauseLogic
*/

function execute(context) {
    logger.info(context);

    context.response.penalty = 1340.0;
    context.response.buyerMayTerminate = false;

    if (context.request.failure) {

        var transhipmentFigures = context.request.transhipmentFigures
        var shipSize = context.request.shipSize
        var malfunction = context.request.malfunction

        context.response.DeliveryExtensionDays = calculateFuzzySystem([transhipmentFigures, shipSize, malfunction]);
    }
}

function calculateFuzzySystem(values) {
    var fuzzySystem = new FuzzySystem();

    fuzzySystem.addInput(
        new LinguisticVariable("Hafengröße", new Range(0, 12), [
            new LinguisticTerm("niedrig", RuleType.TRIANGULAR, new Triangular([0, 0, 6])),
            new LinguisticTerm("mittel", RuleType.TRAPEZOIDAL, new Trapezoidal([0, 5.5, 6.5, 12])),
            new LinguisticTerm("hoch", RuleType.TRIANGULAR, new Triangular([6, 12, 12]))
        ])
    )

    fuzzySystem.addInput(
        new LinguisticVariable("Schiffgröße", new Range(5, 18), [
            new LinguisticTerm("niedrig", RuleType.TRIANGULAR, new Triangular([5, 5, 11])),
            new LinguisticTerm("mittel", RuleType.TRAPEZOIDAL, new Trapezoidal([5, 10, 12, 18])),
            new LinguisticTerm("hoch", RuleType.TRIANGULAR, new Triangular([11, 18, 18]))
        ])
    )

    fuzzySystem.addInput(
        new LinguisticVariable("Unfallschwere", new Range(0, 10), [
            new LinguisticTerm("niedrig", RuleType.TRIANGULAR, new Triangular([0, 0, 5])),
            new LinguisticTerm("mittel", RuleType.TRIANGULAR, new Triangular([0, 5, 10])),
            new LinguisticTerm("hoch", RuleType.TRIANGULAR, new Triangular([5, 10, 10]))
        ])
    )

    fuzzySystem.addOutput(
        new LinguisticVariable("Lieferverlängerung", new Range(0, 30), [
            new LinguisticTerm("niedrig", RuleType.TRIANGULAR, new Triangular([0, 0, 15])),
            new LinguisticTerm("mittel", RuleType.TRIANGULAR, new Triangular([0, 15, 30])),
            new LinguisticTerm("hoch", RuleType.TRIANGULAR, new Triangular([15, 30, 30]))
        ])
    )

    fuzzySystem.addRules(
        [
            new FuzzyRule(["niedrig", "niedrig", "niedrig"], ["mittel"]),
            new FuzzyRule(["niedrig", "niedrig", "mittel"], ["mittel"]),
            new FuzzyRule(["niedrig", "niedrig", "hoch"], ["hoch"]),
            new FuzzyRule(["niedrig", "mittel", "niedrig"], ["mittel"]),
            new FuzzyRule(["niedrig", "mittel", "mittel"], ["hoch"]),
            new FuzzyRule(["niedrig", "mittel", "niedrig"], ["hoch"]),
            new FuzzyRule(["niedrig", "hoch", "niedrig"], ["hoch"]),
            new FuzzyRule(["niedrig", "hoch", "mittel"], ["hoch"]),
            new FuzzyRule(["niedrig", "hoch", "hoch"], ["hoch"]),

            new FuzzyRule(["mittel", "niedrig", "niedrig"], ["niedrig"]),
            new FuzzyRule(["mittel", "niedrig", "mittel"], ["mittel"]),
            new FuzzyRule(["mittel", "niedrig", "hoch"], ["mittel"]),
            new FuzzyRule(["mittel", "mittel", "niedrig"], ["mittel"]),
            new FuzzyRule(["mittel", "mittel", "mittel"], ["mittel"]),
            new FuzzyRule(["mittel", "mittel", "niedrig"], ["mittel"]),
            new FuzzyRule(["mittel", "hoch", "niedrig"], ["mittel"]),
            new FuzzyRule(["mittel", "hoch", "mittel"], ["mittel"]),
            new FuzzyRule(["mittel", "hoch", "hoch"], ["hoch"]),

            new FuzzyRule(["hoch", "niedrig", "niedrig"], ["niedrig"]),
            new FuzzyRule(["hoch", "niedrig", "mittel"], ["niedrig"]),
            new FuzzyRule(["hoch", "niedrig", "hoch"], ["niedrig"]),
            new FuzzyRule(["hoch", "mittel", "niedrig"], ["niedrig"]),
            new FuzzyRule(["hoch", "mittel", "mittel"], ["niedrig"]),
            new FuzzyRule(["hoch", "mittel", "niedrig"], ["mittel"]),
            new FuzzyRule(["hoch", "hoch", "niedrig"], ["niedrig"]),
            new FuzzyRule(["hoch", "hoch", "mittel"], ["mittel"]),
            new FuzzyRule(["hoch", "hoch", "hoch"], ["mittel"]),
        ]
    )

    return fuzzySystem.computeSystem(values);
}





























/**
 * FuzzyLogic Core - defines the core Fuzzy Logic types
 * @module FuzzyLogic
 */
class FuzzySystem {

    constructor() {
        this.inputVariables = [];
        this.outputVariable = [];
        this.rules = [];
    }

    /**
    * @param {LinguisticVariable} variable - the Variable to add to inputVariables
    **/
    addInput(variable) {
        this.inputVariables.push(variable);
    }

    /**
    * @param {LinguisticVariable} variable - variable to set the outputVariable
    **/
    addOutput(variable) {
        this.outputVariable = variable;
    }

    /**
    * @param {FuzzyRule} rule - add a new rule to the system
    **/
    addRule(rule) {
        this.rules.push(rule);
    }

    /**
    * @param {FuzzyRule[]} rules - the Variable to add to inputVariables
    **/
    addRules(rules) {
        this.rules = this.rules.concat(rules);
    }

    /**
    * @param {Number[]} values - the Variable to add to inputVariables
    **/
    computeSystem(values) {
        var outputValues = [] //creates blue column vector in matlab
        this.rules.forEach((rule) => {
            var minValue = 1
            for (var x in values) {
                var inputVariable = this.inputVariables[x]
                var variableTermRuleName = rule.terms[x]
                var term = inputVariable.terms[variableTermRuleName]
                //console.log(inputVariable.description, term.values.y(values[x]))
                minValue = Math.min(minValue, term.values.y(values[x]))
            }
            outputValues.push(minValue)
        })
        //console.log(outputValues)
        return this.computeHeavyPoint(outputValues)
    }

    computeHeavyPoint(values) {
        var xsZaehler = 0;
        var xsNenner = 0;

        for (var xValue = this.outputVariable.range.min; xValue <= this.outputVariable.range.max; xValue += 0.1) { // 0..30 Integral
            var maxValue = 0;
            for (var x in this.rules) { // Max jedes blauen Kastens
                var calculatedY = this.outputVariable.terms[this.rules[x].resultTerm].values.y(xValue)
                if (calculatedY > 0) {
                    maxValue = Math.max(maxValue, Math.min(values[x], calculatedY))
                }
            }
            //console.log(xValue + ": " + maxValue)
            xsZaehler += xValue * maxValue
            xsNenner += maxValue
        }

        var centerOfGravity = xsZaehler / xsNenner;
        console.log("Center of Gravity: " + centerOfGravity)
        return centerOfGravity
    }
}

class LinguisticVariable {
    constructor(description, range, terms) {
        this.description = description
        this.range = range
        this.terms = {}
        terms.forEach((term) => {
            this.terms[term.name] = term
        })
    }
}

class LinguisticTerm {
    constructor(name, type, values) {
        this.name = name
        this.type = type
        this.values = values
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

var RuleType = {
    TRIANGULAR: 1, // 3 Values
    TRAPEZOIDAL: 2 // 4 Values
};

class Triangular {
    constructor(array) {
        this.left = array[0]
        this.top = array[1]
        this.right = array[2]
    }

    /*
    Rising Edge:
    ax+b

    al+b = 0
    at+b = 1

    =>

    b = -al
    at-al = 1
    a(t-l) = 1

    a = 1/(t-l)
    b = -al

    --------------------

    Falling Edge:
    ax+b

    at+b = 1
    ar+b = 0

    =>

    b = -ar
    at-ar = 1
    a(t-r) = 1

    a = 1/(t-r)
    b = -ar
    */

    y(xValue) {
        if (xValue <= this.top && this.top - this.left > 0) {
            var m = 1 / (this.top - this.left)
            return Math.max(0, m * xValue + -m * this.left)
        } else {
            var m = 1 / (this.top - this.right)
            return Math.max(0, m * xValue + -m * this.right)
        }
    }
}

class Trapezoidal {
    constructor(array) {
        this.left = array[0]
        this.topLeft = array[1]
        this.topRight = array[2]
        this.right = array[3]
    }

    y(xValue) {
        if (xValue < this.topLeft) {
            if (this.left == this.topLeft) return 0
            var m = 1 / (this.topLeft - this.left)
            return Math.max(0, m * xValue + -m * this.left)
        } else if (xValue <= this.topRight) {
            return 1
        } else {
            if (this.topRight == this.right) return 0
            var m = 1 / (this.topRight - this.right)
            return Math.max(0, m * xValue + -m * this.right)
        }
    }
}