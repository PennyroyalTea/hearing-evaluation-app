const _ = require('lodash');
lodashId = require('lodash-id');
_.mixin(lodashId);

const ObjectsToCsv = require('objects-to-csv');

class CSVHelper {
    _formatDate(date) {
        const _leadingZero = x => (x < 10 ? '0' + x : x);
        const hrs = _leadingZero(date.getHours());
        const mins = _leadingZero(date.getMinutes());
        const day = _leadingZero(date.getDate());
        const month = _leadingZero(date.getMonth() + 1);
        const year = date.getFullYear();
        return {
            date: `${day}.${month}.${year}`,
            time: `${hrs}:${mins}`
        };
    }

    getCSVMain(attempts, users) {
        const res = attempts.map(attempt => {
            const user = _.getById(users, attempt.userId)
            const date = new Date(attempt.ts)
            let row = {};
            row['Фамилия'] = user.surname;
            row['Имя'] = user.name;
            row['Отчество'] = user.patronal;
            row['Дата'] = this._formatDate(date).date;
            row['Время'] = this._formatDate(date).time;
            row['Тест'] = attempt.testId;
            row['Правильных'] = attempt.succ;
            row['Всего'] = attempt.all;
            row['Порог'] = attempt.threshold;
            row['Среднее время ответа'] = attempt.averageSpeed;
            return row;
        })

        return new ObjectsToCsv(res);
    }

    getCSVFull(attempts, users) {
        const res = attempts.map(attempt => {
            const user = _.getById(users, attempt.userId)
            const date = new Date(attempt.ts)
            let row = {};
            row['Фамилия'] = user.surname;
            row['Имя'] = user.name;
            row['Отчество'] = user.patronal;
            row['Дата Рождения'] = this._formatDate(new Date(user.birthday)).date;
            row['Возраст'] = new Date((new Date().getTime() - new Date(user.birthday).getTime())).getUTCFullYear() - 1970;
            row['Дата'] = this._formatDate(date).date;
            row['Время'] = this._formatDate(date).time;
            row['Тест'] = attempt.testId;
            row['Правильных'] = attempt.succ;
            row['Всего'] = attempt.all;
            row['Порог'] = attempt.threshold;
            row['Среднее время ответа'] = (attempt.averageSpeed / 1000).toFixed(2);
            return row;
        })

        return new ObjectsToCsv(res);
    }

    async commit(attempts, users, filePath, level) {
        let csv;
        switch (level) {
            case 'main':
                csv = this.getCSVMain(attempts, users);
                break;
            case 'full':
                csv = this.getCSVFull(attempts, users);
                break;
            default:
                throw `unsupported level: ${level}`;
        }

        await csv.toDisk(filePath);
    }
}

module.exports.CSVHelper = CSVHelper