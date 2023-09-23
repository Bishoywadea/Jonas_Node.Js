const print = console.log
class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        // 1A) Filtering
        const queryCpy = { ...this.queryStr };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryCpy[element]);

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryCpy);
        // this to covert for example lte to $lte
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matched) => {
            return `$${matched}`;
        });
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            print(sortBy);
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limiting() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            print(fields);
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        this.query = this.query.skip((page - 1) * limit).limit(limit)

        return this;
    }
}

module.exports = APIFeatures;