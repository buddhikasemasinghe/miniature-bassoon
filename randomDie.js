class RandomDie {
    constructor(numSides){
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}){
        var outPut = [];
        [...Array(numRolls).keys()].forEach(i => {
            outPut.push(this.rollOnce());
        })
        return outPut;
    }
}

module.exports = RandomDie;