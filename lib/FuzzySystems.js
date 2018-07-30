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

    shipFailure(values) {
        var fuzzySystem = new FuzzySystem(DefuzzyficationMethods.centroidMethod)

        fuzzySystem.addInput(new LinguisticVariable("Umschlagszahl", new Range(0, 12), [
            new LinguisticTerm("niedrig", new Triangular([0, 0, 6])),
            new LinguisticTerm("mittel", new Trapezoidal([0, 5.5, 6.5, 12])),
            new LinguisticTerm("hoch", new Triangular([6, 12, 12]))
        ]))

        fuzzySystem.addInput(new LinguisticVariable("Schiffsgroesse", new Range(5, 18), [
            new LinguisticTerm("niedrig", new Triangular([5, 5, 11])),
            new LinguisticTerm("mittel", new Trapezoidal([5, 10, 12, 18])),
            new LinguisticTerm("hoch", new Triangular([11, 18, 18]))
        ]))

        fuzzySystem.addInput(new LinguisticVariable("Defektschwere", new Range(0, 10), [
            new LinguisticTerm("niedrig", new Triangular([0, 0, 5])),
            new LinguisticTerm("mittel", new Triangular([0, 5, 10])),
            new LinguisticTerm("hoch", new Triangular([5, 10, 10]))
        ]))

        fuzzySystem.addOutput(new LinguisticVariable("Lieferverlängerung", new Range(0, 30), [
            new LinguisticTerm("niedrig", new Triangular([0, 0, 15])),
            new LinguisticTerm("mittel", new Triangular([0, 15, 30])),
            new LinguisticTerm("hoch", new Triangular([15, 30, 30]))
        ]))

        fuzzySystem.addRules([
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
        ])
        return fuzzySystem.computeSystem(values)
    }
}