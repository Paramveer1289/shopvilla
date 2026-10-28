// APIFeatures Helper Class
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = {
        $or: [
          { name: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ],
      };
      this.query = this.query.find(keyword);
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };

    // Fields to remove from exact matching
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Advanced filtering for price, rating (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    const parsedFilter = JSON.parse(queryStr);

    // If category is provided and not empty
    if (parsedFilter.category && parsedFilter.category !== 'all') {
      parsedFilter.category = parsedFilter.category;
    } else {
      delete parsedFilter.category;
    }

    this.query = this.query.find(parsedFilter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort;
      if (sortBy === 'price-low') sortBy = 'price';
      else if (sortBy === 'price-high') sortBy = '-price';
      else if (sortBy === 'rating') sortBy = '-ratingAverage';
      else if (sortBy === 'newest') sortBy = '-createdAt';
      else sortBy = sortBy.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default newest first
    }
    return this;
  }

  paginate() {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit, 10) || 12);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
