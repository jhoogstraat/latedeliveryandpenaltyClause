/**
* Execute the smart clause
* @param {Context} context - the Accord context
* @param {org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyRequest} context.request - the incoming request
* @param {org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyResponse} context.response - the response
* @AccordClauseLogic
*/

function execute(context) {
    context.response.penalty = 1340.0;
    context.response.buyerMayTerminate = false;

    if (context.request.machineFailure) {
        var transhipmentFigures = context.request.transhipmentFigures
        var shipSize = context.request.shipSize
        var malfunction = context.request.malfunction

        context.response.MaxEndededDeliveryTermination = calculateMaxDelay({ Defektschwere: malfunction, Schiffsgroesse: shipSize, Umschlagszahl: transhipmentFigures })
    }
}

function calculateMaxDelay(values) {
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

    return fuzzySystem.computeSystem(values)
}