/**
* Execute the smart clause
* @param {Context} context - the Accord context
* @param {org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyRequest} context.request - the incoming request
* @param {org.accordproject.latedeliveryandpenalty.LateDeliveryAndPenaltyResponse} context.response - the response
* @AccordClauseLogic
*/
function execute(context) {
    var req = context.request, res = context.response, data = context.data
    var now = moment(req.timestamp), agreed = moment(req.agreedDelivery)

    res.buyerMayTerminate = (req.forceMajeure && data.forceMajeure) // Can forceMajeure be claimed?
    res.penalty = 0

    if (!res.buyerMayTerminate && now.isAfter(agreed)) { // is the delivery late?
        var diff = now.diff(agreed, data.penaltyDuration.unit)
        var penalty = (diff / data.penaltyDuration.amount) * data.penaltyPercentage / 100 * req.goodsValue
        res.penalty = Math.min(penalty, data.capPercentage / 100 * req.goodsValue) // cap the maximum penalty

        switch (req.scenario) { // check if one the the scenarios apply
            case "inTransportProblem":
                res.maxDelayUntilTermination = FuzzySystems.InTransportProblem({Distanz: req.fuzzyInputValues[0], Fahrzeuge: req.fuzzyInputValues[1], Warenlaenge: req.fuzzyInputValues[2]})
                break;
            default:
                res.maxDelayUntilTermination = 500
        }
            // Fuzzy Logic clause active and machine failure?
            //res.maxDelayUntilTermination = calculateMaxDelay({Defektschwere: req.malfunction, Schiffsgroesse: req.shipSize, Umschlagszahl: req.transhipmentFigures})
            //res.buyerMayTerminate = (diff > res.maxDelayUntilTermination)
    }
}
