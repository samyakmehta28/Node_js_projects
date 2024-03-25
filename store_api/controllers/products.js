const Product = require('../models/product');

const getAllProductsStatic = async(req,res)=>{
    const products = await Product.find({price:{$gt :30 }}).sort('price').select('name price')
    res.status(200).json({products})
}

const getAllProducts = async(req,res)=>{
    const { featured, company, name, sort, field, numericFilters } = req.query
    const objectquery = {}
    if(featured){
        objectquery.featured = featured === 'true'? true:false
    }
    if(company){
        objectquery.company = company
    }
    if(name){
        objectquery.name = {$regex : name, $options: 'i'}
    }
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`)
        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                objectquery[field] = {[operator]: Number(value)}
            }
        })
    }
    console.log(objectquery)
    let result = Product.find(objectquery)
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    else{
        result = result.sort('createAt');
    }

    if(field){
        const fieldList = field.split(',').join(' ');
        result = result.select(fieldList);
    }
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page-1)*limit;
    result = result.skip(skip).limit(limit);

    const products = await result
    res.status(200).json({products})
}

module.exports  ={getAllProducts, getAllProductsStatic}