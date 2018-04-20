const { readFileSync, writeFileSync } = require("fs")

function getAppliedMigrations() {
    try {
        const migrations = readFileSync('/tmp/.migratum.dummy-applied', 'utf-8')
        return JSON.parse(migrations)
    } catch (err) {
        return []
    }
}

exports.init = function init(connectionString) {
    return Promise.resolve({
        createMigrationTable: function() {
            return true
        },
        migrationsList: function() {
            return getAppliedMigrations()
        },
        applyMigration: function(name, text, direction) {
            console.log(`Applying migration ${name}/${direction} with the following text:`)
            console.log('----------------------------------------------------------------------')
            console.log(text)
            console.log('----------------------------------------------------------------------')
            try {
                let list = getAppliedMigrations()
                if (direction == 'up')
                    list.push(name)
                else if (direction == 'down')
                    list = list.filter(n => n !== name)
                writeFileSync('/tmp/.migratum.dummy-applied', JSON.stringify(list))
            } catch (err) {}
        }
    });
}
