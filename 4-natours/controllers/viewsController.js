const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverView = catchAsync(async (req,res)=>{
    const tours = await Tour.find();
    res.status(200).render('overview',{
        title:'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req,res)=>{
    const str = req.params.name;
    const tourName = str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const tour = await Tour.findOne({name: `${tourName}`}).populate({
        path:'reviews',
        fields:'review rating user'
    });
    res.status(200).render('tour',{
        title:tourName,
        tour
    });
});