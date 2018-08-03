class FuzzySystems {
    static InTransportProblem(values) {
        var fuzzySystem = new FuzzyLogic(DefuzzyficationMethods.centroidMethod)

        fuzzySystem.addInput(new LinguisticVariable("Distanz", new Range(0, 800), [
            new LinguisticTerm("kurz", new Triangular([0, 0, 350])),
            new LinguisticTerm("mittel", new Triangular([200, 400, 600])),
            new LinguisticTerm("lang", new Triangular([450, 800, 800]))
        ]))

        fuzzySystem.addInput(new LinguisticVariable("Fahrzeuge", new Range(1, 7), [
            new LinguisticTerm("wenige", new Triangular([1, 1, 4.5])),
            new LinguisticTerm("viele", new Triangular([3.5, 7, 7]))
        ]))

        fuzzySystem.addInput(new LinguisticVariable("Warenlaenge", new Range(5, 60), [
            new LinguisticTerm("kurz", new Triangular([5, 5, 27])),
            new LinguisticTerm("mittel", new Triangular([20, 30, 45])),
            new LinguisticTerm("lang", new Triangular([30, 60, 60]))
        ]))

        fuzzySystem.addOutput(new LinguisticVariable("Nachfrist", new Range(0, 14), [
            new LinguisticTerm("kurz", new Triangular([0, 0, 5])),
            new LinguisticTerm("mittel", new Triangular([3, 7, 11])),
            new LinguisticTerm("lang", new Triangular([10, 14, 14]))
        ]))

        fuzzySystem.addRules([
            new FuzzyRule({ Distanz: "kurz", Fahrzeuge: "wenige", Warenlaenge: "kurz" }, "kurz"),
            new FuzzyRule({ Distanz: "kurz", Fahrzeuge: "wenige", Warenlaenge: "mittel" }, "kurz"),
            new FuzzyRule({ Distanz: "kurz", Fahrzeuge: "wenige", Warenlaenge: "lang" }, "kurz"),
            new FuzzyRule({ Distanz: "kurz", Fahrzeuge: "viele", Warenlaenge: "kurz" }, "kurz"),
            new FuzzyRule({ Distanz: "kurz", Fahrzeuge: "viele", Warenlaenge: "mittel" }, "mittel"),
            new FuzzyRule({ Distanz: "kurz", Fahrzeuge: "viele", Warenlaenge: "lang" }, "mittel"),
            new FuzzyRule({ Distanz: "mittel", Fahrzeuge: "wenige", Warenlaenge: "kurz" }, "kurz"),
            new FuzzyRule({ Distanz: "mittel", Fahrzeuge: "wenige", Warenlaenge: "mittel" }, "mittel"),
            new FuzzyRule({ Distanz: "mittel", Fahrzeuge: "wenige", Warenlaenge: "lang" }, "mittel"),
            new FuzzyRule({ Distanz: "mittel", Fahrzeuge: "viele", Warenlaenge: "kurz" }, "mittel"),
            new FuzzyRule({ Distanz: "mittel", Fahrzeuge: "viele", Warenlaenge: "mittel" }, "mittel"),
            new FuzzyRule({ Distanz: "mittel", Fahrzeuge: "viele", Warenlaenge: "lang" }, "lang"),
            new FuzzyRule({ Distanz: "lang", Fahrzeuge: "wenige", Warenlaenge: "kurz" }, "mittel"),
            new FuzzyRule({ Distanz: "lang", Fahrzeuge: "wenige", Warenlaenge: "mittel" }, "mittel"),
            new FuzzyRule({ Distanz: "lang", Fahrzeuge: "wenige", Warenlaenge: "lang" }, "mittel"),
            new FuzzyRule({ Distanz: "lang", Fahrzeuge: "viele", Warenlaenge: "kurz" }, "mittel"),
            new FuzzyRule({ Distanz: "lang", Fahrzeuge: "viele", Warenlaenge: "mittel" }, "lang"),
            new FuzzyRule({ Distanz: "lang", Fahrzeuge: "viele", Warenlaenge: "lang" }, "lang"),
        ])
        return fuzzySystem.computeSystem(values)
    }
}