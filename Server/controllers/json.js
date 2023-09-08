const fs = require('fs');

class JsonController {

    data = {};

    constructor() {
        try {
            let rawdata = fs.readFileSync('data.json', 'utf8');
            this.data = JSON.parse(rawdata);
        } catch (e) {
            // Data doesn't exist, leave it blank
        }
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
        this.save();
    }

    save() {
        fs.writeFileSync('data.json', JSON.stringify(this.data))
    }
}

module.exports = JsonController;