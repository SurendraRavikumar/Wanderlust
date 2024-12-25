module.exports = (fn)=>{
    return (req,res,next) => {
        // fn(req,res,next).catch(err);
        fn(req, res, next).catch(next);
    };
};